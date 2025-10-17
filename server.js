// server.js

// 1. IMPORTS
const express = require('express');
const path = require('path');
const InversorController = require('./src/controllers/InversorController'); 

// 2. CONFIGURAÇÃO BASE E INSTÂNCIA DO APP
const app = express();
const PORT = 3000;

// 3. MIDDLEWARES (Configurações Globais)

// Processa dados do formulário (POST body)
app.use(express.urlencoded({ extended: true }));

// Configura para servir arquivos estáticos (HTML puro na pasta 'views')
// IMPORTANTE: Isso permite que você acesse index.html e log.html diretamente se eles fossem a única coisa no servidor.
// No nosso caso, usaremos rotas explícitas, mas o middleware é bom para outros arquivos (CSS, imagens).
// app.use(express.static(path.join(__dirname, 'src', 'views'))); 
// Comentamos essa linha pois estamos usando res.sendFile/Controller para ter controle total.


// 4. DEFINIÇÃO DE ROTAS (Mapeamento do Controller)

// Rota GET / (Página Inicial: Serve index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'views', 'index.html'));
});

// Rota para processar o formulário (POST /inverter)
app.post('/inverter', InversorController.processarInversao); 

// Rota para mostrar o resultado final (GET /resultado)
app.get('/resultado', InversorController.renderResultado); 

// Rota para mostrar o histórico (GET /log)
app.get('/log', InversorController.renderLog); 


// 5. INICIA O SERVIDOR
const server = app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

// 6. EXPORTA O APP (Para uso nos testes com Supertest)
module.exports = app;