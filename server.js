// server.js

// 1. IMPORTS
const express = require('express');
const path = require('path');
const InversorController = require('./src/controllers/InversorController'); 

// 2. CONFIGURAÇÃO BASE E INSTÂNCIA DO APP
const app = express();
const PORT = 3000;

// 3. MIDDLEWARES (Configurações Globais)
app.use(express.urlencoded({ extended: true }));

// ** Middleware para servir arquivos estáticos/views **
// Configura o Express para buscar arquivos estáticos (index.html, CSS, JS)
// no diretório 'src/views'. Isso garante que 'index.html' seja servido
// automaticamente quando a rota raiz ('/') for acessada.
app.use(express.static(path.join(__dirname, 'src', 'views')));


// 4. DEFINIÇÃO DE ROTAS (Mapeamento do Controller)

// A rota GET / é agora implicitamente tratada por express.static,
// então a removemos para evitar conflitos ou código redundante.

// Rota para processar o formulário (POST /inverter)
app.post('/inverter', InversorController.processarInversao); 

// Rota para mostrar o resultado final (GET /resultado)
app.get('/resultado', InversorController.renderResultado); 

// Rota para mostrar o histórico (GET /log)
app.get('/log', InversorController.renderLog); 


// 5. EXPORTA O APP PRIMEIRO (Para uso nos testes)
module.exports = app; 

// 6. INICIA O SERVIDOR CONDICIONALMENTE (Usa a porta 3000)
if (require.main === module) {
    const server = app.listen(PORT, () => {
        console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
}
