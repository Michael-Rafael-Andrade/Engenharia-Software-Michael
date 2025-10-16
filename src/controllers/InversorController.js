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
}

module.exports = InversorController;
