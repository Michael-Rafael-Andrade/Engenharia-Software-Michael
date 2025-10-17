const { loadFeature, defineFeature } = require('jest-cucumber');
const puppeteer = require('puppeteer');
// Importa o app e o controller
const { app, controller } = require('../server');
const path = require('path');

// Caminho absoluto para o Aceitacao.feature
const feature = loadFeature(path.resolve(__dirname, 'Aceitacao.feature'));

let browser;
let page;
let server;

// CRÍTICO: Limpa o log real antes de rodar os testes E2E.
controller.logRepository.clearLogs();

defineFeature(feature, (test) => {

    // Configuração Inicial (Roda antes de TODOS os testes)
    beforeAll(async () => {
        // Inicia o servidor Express na porta 3001
        server = app.listen(3001, () => {
            console.log('Test server started on port 3001');
            
        });

        // Inicializa o Puppeteer
        browser = await puppeteer.launch({ headless: 'new' });
        page = await browser.newPage();
    });

    // Limpeza (Roda depois de TODOS os testes)
    afterAll(async () => {
        await browser.close();
        if (server) {
            // Garantimos que o servidor feche de forma assíncrona
            await new Promise(resolve => server.close(resolve));
            console.log('Test server closed');
        }
    });

    // Definição dos passos do cenário
    test('Inversao de string atraves do formulario', ({ given, when, and, then }) => {

        // PASSO 1/5: Given O servidor esta rodando em "http://localhost:3001"
        given(/^O servidor esta rodando em "(.*)"$/, async (url) => {
            // Navega para a URL correta e verifica se a página carregou.
            await page.goto(url);
            await expect(page.title()).resolves.toMatch('Inversor');
        });

        // PASSO 2/5: When O usuario digita "caminho" no campo de texto
        when(/^O usuario digita "(.*)" no campo de texto$/, async (texto) => {
            await page.type('#texto-original', texto);
        });

        // PASSO 3/5: And Clica no botao "Inverter"
        and(/^Clica no botao "(.*)"$/, async (botao) => {
            // Usa o ID do botão para maior robustez
            await page.click('#botao-inverter');
            // Aguarda o redirecionamento (do POST para o GET /resultado?...)
            await page.waitForNavigation();
        });

        // PASSO 4/5: Then Deve ser redirecionado para a pagina de resultado
        then('Deve ser redirecionado para a pagina de resultado', async () => {
            await expect(page.title()).resolves.toMatch('Resultado');
        });

        // PASSO 5/5: And O texto na pagina deve conter "ohnimac"
        and(/^O texto na pagina deve conter "(.*)"$/, async (textoInvertido) => {
            // Busca o texto no elemento com ID #texto-invertido (do resultado.html)
            const resultado = await page.$eval('#texto-invertido', (el) => el.textContent);
            await expect(resultado.trim()).toBe(textoInvertido);
        });

    });
});