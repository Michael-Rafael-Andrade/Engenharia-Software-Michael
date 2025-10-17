const express = require('express');
const path = require('path');
// Importaremos o Controller aqui quando ele estiver pronto

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


const server = app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

// Exporta o app para que os testes (Supertest) possam usá-lo
module.exports = app;