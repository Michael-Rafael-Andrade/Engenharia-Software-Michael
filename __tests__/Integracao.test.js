const request = require('supertest');

// MOCK CRÍTICO: Mocka o LogRepository ANTES de carregar o servidor/aplicação.
// Isso garante que o InversorController (que é instanciado no server.js) 
// receba o repositório mockado em seu construtor.
jest.mock('../src/models/LogRepository', () => {
    // Retorna uma função construtora mockada que simula o LogRepository
    return jest.fn().mockImplementation(() => {
        return {
            salvar: jest.fn().mockResolvedValue(), // Mocka o método salvar
            getHistorico: jest.fn().mockResolvedValue([
                // Dados mockados que devem ser exibidos no log
                { original: 'banana', invertida: 'ananab' },
                { original: 'casa', invertida: 'asac' }, // Adicionado para robustez
            ]),
        };
    });
});

// A importação do app DEVE vir DEPOIS do mock
const { app } = require('../server'); 

describe('Teste de Integracao: Controller e LogRepository', () => {
    
    // O InversorController na aplicação está usando o LogRepository mockado
    test('Deve carregar a página /log e exibir o histórico mockado', async () => {
        // 1. Faz a requisição para a rota /log
        const response = await request(app).get('/log');
        
        // 2. Verifica Resposta HTTP
        expect(response.statusCode).toBe(200); 
        
        // 3. Verifica Integração: Confirma se os dados mockados do LogRepository foram injetados no HTML
        expect(response.text).toContain('Histórico de Inversões');
        
        // Verifica a primeira entrada mockada
        expect(response.text).toContain('Original: banana');
        expect(response.text).toContain('Invertida: **ananab**'); // Verifica a formatação esperada

        // Verifica a segunda entrada mockada para robustez
        expect(response.text).toContain('Original: casa');
        expect(response.text).toContain('Invertida: **asac**');
    });
});
