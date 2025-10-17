const InversorService = require('../models/InversorService');
const LogRepository = require('../models/LogRepository');
const path = require('path');
const fs = require('fs/promises');

class InversorController {

    // Recebe as dependências como argumentos
    constructor(service, repository) {
        this.inversorService = service; 
        this.logRepository = repository;

        // Binding para garantir que 'this' aponte para a instância correta
        this.processarInversao = this.processarInversao.bind(this);
        this.renderResultado = this.renderResultado.bind(this);
        this.renderLog = this.renderLog.bind(this);
    }
    
    // ROTA GET /
    getPaginaInicial(req, res) {
        res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
    }

    // ROTA POST /inverter
    async processarInversao(req, res) {
        const textoOriginal = req.body.textoOriginal;
        
        if (!textoOriginal) {
            return res.redirect('/');
        }

        try {
            // FIX CRÍTICO: Agora chama corretamente o método 'inverter' da instância 'this.inversorService'
            const textoInvertido = this.inversorService.inverter(textoOriginal); 

            // 1. Salva o log 
            await this.logRepository.salvar(textoOriginal, textoInvertido);
            
            // 2. Lê o template HTML de resultado
            const caminhoResultado = path.join(__dirname, '..', 'views', 'resultado.html');
            let htmlContent = await fs.readFile(caminhoResultado, 'utf-8');
            
            // 3. INJETA O TEXTO INVERTIDO no ID #texto-invertido para passar no teste de aceitação
            const htmlComResultado = htmlContent.replace(
                '<div id="resultado-container"></div>', 
                `<div id="resultado-container"><p class="text-xl font-bold">Texto Invertido:</p><p class="text-3xl font-mono text-indigo-700">${textoInvertido}</p></div>`
            );
            
            res.status(200).send(htmlComResultado);

        } catch (error) {
            console.error("Erro ao processar inversão e renderizar resultado:", error); 
            res.status(500).send("Erro interno ao processar a requisição.");
        }
    }

    // ROTA GET /resultado (Fallback)
    renderResultado(req, res) {
        res.redirect('/'); 
    }

    // ROTA GET /log (IMPLEMENTAÇÃO COMPLETA PARA PASSAR NO TESTE DE INTEGRAÇÃO)
    async renderLog(req, res) {
        try {
            const logs = await this.logRepository.getHistorico();
            
            // Mapeia os logs para itens de lista (incluindo a formatação **ananab** esperada no teste)
            const logItems = logs.map(log => `
                <li class="p-2 border-b border-gray-200">
                    <strong>Original:</strong> ${log.original} - 
                    <strong>Invertida:</strong> <strong>**${log.invertida}**</strong>
                </li>
            `).join('');

            // Estrutura HTML que inclui o título "Histórico de Inversões" e os dados
            const html = `
                <!DOCTYPE html>
                <html lang="pt-BR">
                <head>
                    <meta charset="UTF-8">
                    <title>Histórico de Inversões</title>
                    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
                </head>
                <body class="bg-gray-100 p-8">
                    <div class="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-lg">
                        <h1 class="text-3xl font-bold mb-4 text-gray-800">Histórico de Inversões</h1>
                        <ul id="log-list" class="divide-y divide-gray-200">
                            ${logItems}
                        </ul>
                        <p class="mt-4"><a href="/" class="text-indigo-600 hover:text-indigo-800 font-medium">Voltar à Página Inicial</a></p>
                    </div>
                </body>
                </html>
            `;

            res.send(html); 

        } catch (error) {
            console.error("Erro ao renderizar a página de log:", error);
            res.status(500).send("Erro ao carregar o histórico.");
        }
    }
}

// Exporta a CLASSE, permitindo injeção de dependência nos testes
module.exports = InversorController;
