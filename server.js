// server.js

// 1. IMPORTS
const express = require('express');
const path = require('path');

// Importa as CLASSES
const InversorController = require('./src/controllers/InversorController'); 
const InversorService = require('./src/models/InversorService'); // Agora é uma CLASSE
const LogRepository = require('./src/models/LogRepository'); 

// 2. CONFIGURAÇÃO BASE E INSTÂNCIA DO APP
const app = express();
const PORT = 3000;

let serverInstance;

// 3. INJEÇÃO DE DEPENDÊNCIA E INSTANCIAÇÃO
// Cria as instâncias das dependências
const inversorService = new InversorService(); // CORRIGIDO!
const logRepository = new LogRepository();   

// Cria a instância do Controller, injetando as dependências
const controller = new InversorController(inversorService, logRepository);

// 4. MIDDLEWARES (Configurações Globais)
app.use(express.urlencoded({ extended: true }));

// REMOVIDO: O middleware estático não é mais necessário, pois as views são geradas pelo Controller.
// app.use(express.static(path.join(__dirname, 'src', 'views')));


// 5. DEFINIÇÃO DE ROTAS
app.get('/', controller.getPaginaInicial); 
app.post('/inverter', controller.processarInversao); 
app.get('/resultado', controller.renderResultado); 
app.get('/log', controller.renderLog); 


// 6. EXPORTA O APP E O CONTROLLER (Para uso nos testes)
module.exports = { 
    app, 
    controller, // EXPORTADO: Essencial para injetar mocks nos testes de integração.
    // Função para obter a instância real do servidor ou o app (para o Supertest)
    getServerInstance: () => serverInstance || app 
}; 

// 7. INICIA O SERVIDOR CONDICIONALMENTE
if (require.main === module) {
    serverInstance = app.listen(PORT, () => {
        console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
}