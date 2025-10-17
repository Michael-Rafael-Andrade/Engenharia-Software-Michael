const request = require('supertest');
const app = require('../server');

describe('Teste de Integracao: Controller e LogRepository', () => {
    test('Deve carregar a página /log e exibir o histórico mockado', async () => {
        const response = await request(app).get('/log');

        // 1. Verifica Resposta HTTP
        expect(response.statusCode).toBe(200); 
        
        // 2. Verifica Integração: Confirma se os dados mockados do LogRepository foram injetados no HTML
        expect(response.text).toContain('Histórico de Inversões');
        expect(response.text).toContain('Original: banana');
        expect(response.text).toContain('Invertida: **ananab**');
    });
});