const InversorService = require('../models/InversorService');
const LogRepository = require('../models/LogRepository');
const fs = require('fs');
const path = require('path');

class InversorController {
    
    // 1. PROPRIEDADE ESTÁTICA (Armazenamento temporário)
    static ultimoResultado = { original: '', invertida: '' };

    // ------------------------------------------------------------------
    // Rota GET /log: Lidar com injeção de dados sem Template Engine
    // ------------------------------------------------------------------
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
            
            // Substitui a tag de placeholder
            const htmlModificado = data.replace('<div id="historico-container"></div>', 
                                                `<div id="historico-container">${logHtml}</div>`);
            
            res.send(htmlModificado);
        });
    }

    // ------------------------------------------------------------------
    // Rota POST /inverter: Processa o formulário
    // ------------------------------------------------------------------
    static processarInversao(req, res) {
        const { texto } = req.body;
        const textoInvertido = InversorService.inverterString(texto);

        // Salva o resultado no armazenamento temporário
        InversorController.ultimoResultado = {
            original: texto,
            invertida: textoInvertido
        };
        
        // Padrão POST-Redirect-GET
        res.redirect('/resultado'); 
    }

    // ------------------------------------------------------------------
    // Rota GET /resultado: Exibe a View com o resultado
    // ------------------------------------------------------------------
    static renderResultado(req, res) {
        const { original, invertida } = InversorController.ultimoResultado;

        const resultadoHtml = `
            <!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Resultado</title></head>
            <body>
                <h1>Inversor de Strings Simples</h1>
                <nav><a href="/">Formulário</a> | <a href="/log">Histórico</a></nav><hr>
                <h2>Resultado da Inversão</h2>
                <p>Texto Original: <strong>${original}</strong></p>
                <p>Texto Invertido: <strong>${invertida}</strong></p>
                <a href="/">Fazer outra inversão</a>
            </body>
            </html>
        `;
        res.send(resultadoHtml);
    }
}

module.exports = InversorController;