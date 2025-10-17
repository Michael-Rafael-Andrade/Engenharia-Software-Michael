const express = require('express');
// ... (imports)
const path = require('path');
const InversorController = require('./src/controllers/InversorController'); // <--- NOVO

const app = express();
// ... (configurações)

// Rota GET /log (AGORA USANDO O CONTROLLER)
app.get('/log', InversorController.renderLog); // <--- ATUALIZADO
app.get('/', (req, res) => { /* ... */ });

// ... (Inicia o servidor e exporta o app)
const app = express();
const PORT = 3000;

// Configuração para servir arquivos estáticos (como nossos HTML puros)
app.use(express.static(path.join(__dirname, 'src', 'views')));

// Middleware para processar dados do formulário (POST body)
app.use(express.urlencoded({ extended: true }));

// Rotas: Vamos definir as rotas aqui, mas a lógica irá para o Controller.

// Rota GET / (Para servir index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'views', 'index.html'));
});

// Rota GET /log (Para servir log.html)
app.get('/log', (req, res) => {
    // Note que ainda precisamos da lógica para injetar o histórico no HTML
    res.sendFile(path.join(__dirname, 'src', 'views', 'log.html'));
});

// Rotas:
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'views', 'index.html'));
});

// Rota para mostrar o histórico (GET /log)
app.get('/log', InversorController.renderLog); 

// Rota para processar o formulário (POST /inverter)
app.post('/inverter', InversorController.processarInversao); // <--- NOVO

// Rota para mostrar o resultado final (GET /resultado)
app.get('/resultado', InversorController.renderResultado); // <--- NOVO

const server = app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

// Exporta o app para que os testes (Supertest) possam usá-lo
module.exports = app;