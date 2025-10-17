const { defineFeature, loadFeature } = require('jest-cucumber');
const puppeteer = require('puppeteer');
const app = require('../server'); // O servidor Express

const feature = loadFeature('./__tests__/Aceitacao.feature');

let browser;
let page;
let server;
let url;

defineFeature(feature, test => {   
    // Configuração e Limpeza
    beforeAll((done) => { // ADICIONE 'done'
        // Inicia o servidor, usando done para sinalizar que a operação assíncrona terminou
        server = app.listen(3001, () => {
            console.log('Test server started on port 3001');
            done(); // Sinaliza ao Jest que a configuração está completa
        }); 
        url = 'http://localhost:3001';
    });

    afterAll(async () => {
        // Garante que o servidor seja fechado após todos os testes de aceitação
        if (server) {
            await new Promise(resolve => server.close(resolve)); // Fecha o servidor de forma assíncrona
        }
    });

    beforeEach(async () => {
        browser = await puppeteer.launch({ headless: true });
        page = await browser.newPage();
    });

    afterEach(async () => {
        await browser.close();
    });
    // Fim Configuração

    test('Inversao de string atraves do formulario', ({ given, when, then }) => {
        
        given(/^O servidor esta rodando em "(.*)"$/, async (endereco) => {
            await page.goto(url);
            // Verifica se a página inicial carregou corretamente
            await expect(page.title()).resolves.toMatch('Inversor de Strings'); 
        });

        when(/^O usuario digita "(.*)" no campo de texto$/, async (texto) => {
            await page.type('#texto', texto); // #texto é o ID do input
        });

        when(/^Clica no botao "(.*)"$/, async (botao) => {
            await page.click('button[type="submit"]');
        });

        then(/^Deve ser redirecionado para a pagina de resultado$/, async () => {
            // Verifica se o URL mudou para /resultado (Confirma o PRG)
            await page.waitForNavigation();
            expect(page.url()).toBe(`${url}/resultado`);
        });

        then(/^O texto na pagina deve conter "(.*)"$/, async (textoEsperado) => {
            // Confirma se o resultado da inversão (ohnimac) foi renderizado na tela
            const content = await page.content();
            expect(content).toContain(textoEsperado);
        });
    });
});