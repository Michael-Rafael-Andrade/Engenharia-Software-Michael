const InversorService = require('../models/InversorService');
const LogRepository = require('../models/LogRepository');
const fs = require('fs');
const path = require('path');

// Rota GET /log: Lidar com injeção de dados sem Template Engine
class InversorController {
    static renderLog(req, res) {
        // O Controller solicita os dados ao Model (LogRepository)
        const historico = LogRepository.getLog();

        // Monta o código HTML para injetar
        let logHtml = '<ul>';
        historico.forEach(item => {
            logHtml += `<li>Original: ${item.original} | Invertida: **${item.invertida}** | Data: ${item.data}</li>`;
        });
        logHtml += '</ul>';

        // Lê o arquivo HTML da View
        const logFilePath = path.join(__dirname, '..', 'views', 'log.html');
        fs.readFile(logFilePath, 'utf8', (err, data) => {
            if (err) {
                console.error("Erro ao ler log.html:", err);
                return res.status(500).send("Erro interno do servidor.");
            }
            
            // Substitui a tag de placeholder (simulando injeção)
            const htmlModificado = data.replace('<div id="historico-container"></div>', 
                                                `<div id="historico-container">${logHtml}</div>`);
            
            // Envia o HTML modificado ao usuário
            res.send(htmlModificado);
        });
    }

    // Rotas de Inversão (POST /inverter e GET /resultado) virão a seguir...
    static processarInversao(req, res) { /* ... */ } 
    static renderResultado(req, res) { /* ... */ } 

// Variável estática para armazenamento temporário do último resultado
    static ultimoResultado = { original: '', invertida: '' }; // <--- NOVO ARMAZENAMENTO

    // ... (renderLog e outras funções)


    // Rota POST /inverter: Processa o formulário

    static processarInversao(req, res) {
        // 1. Extrai o texto do corpo da requisição POST
        const { texto } = req.body;

        // 2. Chama a lógica pura do Model (InversorService)
        const textoInvertido = InversorService.inverterString(texto);

        // 3. Salva o resultado no armazenamento temporário (simples)
        InversorController.ultimoResultado = {
            original: texto,
            invertida: textoInvertido
        };
        
        // **NÃO** salvamos no LogRepository aqui, apenas no resultado temporário.

        // 4. Redireciona o usuário para a rota GET /resultado
        res.redirect('/resultado'); // Padrão POST-Redirect-GET (PRG)
    }

    // Rota GET /resultado: Exibe a View com o resultado
    
    static renderResultado(req, res) {
        const { original, invertida } = InversorController.ultimoResultado;

        // 1. O Controller precisa servir uma View dinâmica para mostrar o resultado.
        // Como estamos usando HTML puro, faremos a mesma injeção que fizemos para o /log.

        const resultadoHtml = `
            <h2>Resultado da Inversão</h2>
            <p>Texto Original: <strong>${original}</strong></p>
            <p>Texto Invertido: <strong>${invertida}</strong></p>
            <a href="/">Fazer outra inversão</a>
        `;
        
        // 2. Criação de um HTML Dinâmico Básico para a resposta
        res.send(`
            <!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Resultado</title></head>
            <body>
                <h1>Inversor de Strings Simples</h1>
                <nav><a href="/">Formulário</a> | <a href="/log">Histórico</a></nav><hr>
                ${resultadoHtml}
            </body>
            </html>
        `);
        // Note: Se estivéssemos usando EJS, seria apenas: res.render('resultado', { original, invertida });
    }
}

module.exports = InversorController;