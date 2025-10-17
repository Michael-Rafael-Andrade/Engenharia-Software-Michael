const path = require('path');
// Importações de modelos/serviços
const InversorService = require('../models/InversorService');
const LogRepository = require('../models/LogRepository');

// NOTA: Removido 'fs/promises' pois o HTML agora é gerado pelo Controller
class InversorController {

    // Recebe as dependências como argumentos (DI)
    constructor(service = new InversorService(), repository = new LogRepository()) {
        this.inversorService = service; 
        this.logRepository = repository;

        // Binding necessário para o Express usar métodos de instância
        this.getPaginaInicial = this.getPaginaInicial.bind(this);
        this.processarInversao = this.processarInversao.bind(this);
        this.renderResultado = this.renderResultado.bind(this);
        this.renderLog = this.renderLog.bind(this);
    }
    
    // ROTA GET /
    getPaginaInicial(req, res) {
        // Gera o HTML da página inicial (index.html) diretamente
        res.send(`
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Inversor de Strings Simples</title> 
                <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
            </head>
            <body class="bg-gray-100 flex items-center justify-center min-h-screen">
                <div class="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
                    <h1 class="text-2xl font-bold mb-6 text-indigo-600">Inversor de Strings</h1>
                    <form action="/inverter" method="POST" class="space-y-4">
                        <label for="texto-original" class="block text-left font-medium text-gray-700">Digite a string:</label>
                        <input type="text" id="texto-original" name="textoOriginal" required placeholder="Ex: michael"
                               class="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500">
                        
                        <button type="submit" id="botao-inverter"
                                class="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-150">
                            Inverter
                        </button>
                    </form>
                    <p class="mt-4 text-sm text-gray-500">
                        <a href="/log" class="text-indigo-600 hover:text-indigo-800">Ver Histórico de Inversões</a>
                    </p>
                </div>
            </body>
            </html>
        `);
    }

    // ROTA POST /inverter
    async processarInversao(req, res) {
        const textoOriginal = req.body.textoOriginal;
        
        if (!textoOriginal) {
            return res.redirect('/');
        }

        try {
            const textoInvertido = this.inversorService.inverterString(textoOriginal); 

            // 1. Salva o log (agora usa addLog)
            await this.logRepository.addLog(textoOriginal, textoInvertido);
            
            // 2. Redireciona para /resultado, passando os dados via query string
            return res.redirect(`/resultado?original=${encodeURIComponent(textoOriginal)}&invertido=${encodeURIComponent(textoInvertido)}`);

        } catch (error) {
            console.error("Erro ao processar inversão:", error); 
            res.status(500).send("Erro interno ao processar a requisição.");
        }
    }

    // ROTA GET /resultado 
    async renderResultado(req, res) {
        const { original, invertido } = req.query;

        // Se faltarem dados na query, volta para o início
        if (!invertido) return res.redirect('/'); 

        // Gera o HTML da página de resultado (resultado.html) diretamente
        res.status(200).send(`
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Resultado da Inversão</title>
                <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
            </head>
            <body class="bg-gray-100 flex items-center justify-center min-h-screen">
                <div class="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
                    <h1 class="text-2xl font-bold mb-6 text-indigo-600">Resultado da Inversão</h1>
                    <p class="text-gray-600 mb-4">Original: <span class="font-mono font-medium text-gray-800">${original}</span></p>
                    
                    <div class="border-2 border-red-300 bg-red-50 p-6 rounded-lg my-4">
                        <p class="text-lg font-medium text-red-700 mb-2">String Invertida:</p>
                        <div class="text-4xl font-extrabold text-red-600 break-all" id="texto-invertido">
                            ${invertido}
                        </div>
                    </div>

                    <a href="/" class="inline-block mt-6 py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-150">
                        Nova Inversão
                    </a>
                </div>
            </body>
            </html>
        `);
    }

    // ROTA GET /log
    async renderLog(req, res) {
        try {
            // Usa o NOVO método getLogs
            const logs = await this.logRepository.getLogs();
            
            // Mapeia logs para HTML
            const logItems = logs.map(log => `
                <li class="p-3 border-b border-gray-200 flex justify-between items-center">
                    <div>
                        <span class="font-medium text-gray-700">Original:</span> ${log.original} 
                    </div>
                    <div>
                        <span class="font-medium text-gray-700">Invertida:</span> 
                        <strong class="text-indigo-600">**${log.inverted}**</strong> 
                    </div>
                </li>
            `).join('');
            
            // Gera o HTML da página de log (log.html) diretamente
            res.send(`
                <!DOCTYPE html>
                <html lang="pt-BR">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Histórico de Inversões</title>
                    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
                </head>
                <body class="bg-gray-100 p-8 min-h-screen">
                    <div class="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-lg">
                        <h1 class="text-3xl font-bold mb-4 text-gray-800">Histórico de Inversões</h1>
                        <ul id="log-list" class="divide-y divide-gray-200 border border-gray-200 rounded-lg">
                            ${logItems.length > 0 ? logItems : '<li class="p-4 text-center text-gray-500 italic">Nenhum registro de inversão encontrado.</li>'}
                        </ul>
                        <p class="mt-4 text-center">
                            <a href="/" class="text-indigo-600 hover:text-indigo-800 font-medium">Voltar à Página Inicial</a>
                        </p>
                    </div>
                </body>
                </html>
            `);

        } catch (error) {
            console.error("Erro ao renderizar a página de log:", error);
            res.status(500).send("Erro ao carregar o histórico.");
        }
    }
}

module.exports = InversorController;