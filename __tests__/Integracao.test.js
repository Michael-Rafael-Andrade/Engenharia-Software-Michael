const request = require('supertest');
const LogRepository = require('../src/models/LogRepository');

// Ajusta a importação para desestruturar 'app' e 'controller'
const { app, controller } = require('../server'); 

// 1. Configuração do Mock (AGORA COM NOMES CORRIGIDOS: getLogs e addLog)
const mockLogRepository = {
    // Mocka o método que será chamado pelo GET /log
    getLogs: jest.fn().mockResolvedValue([ // Renomeado de 'getHistorico' para 'getLogs'
        // Dados mockados que devem ser exibidos no log
        { original: 'banana', inverted: 'ananab' }, // Renomeado para 'inverted'
        { original: 'casa', inverted: 'asac' }, // Renomeado para 'inverted'
    ]),
    // Mocka o método que será chamado pelo POST /inverter
    addLog: jest.fn().mockResolvedValue(), // Renomeado de 'salvar' para 'addLog'
};

// 2. Injeção do Mock
// Sobrescrevemos a instância real do LogRepository no controller com nosso mock
controller.logRepository = mockLogRepository;

describe('Teste de Integracao: Controller e LogRepository', () => {
    
    // Testa o GET /log
    test('1. Deve carregar a página /log e exibir o histórico mockado (Teste de Renderização)', async () => {
        // 1. Faz a requisição para a rota /log
        const response = await request(app).get('/log');
        
        // 2. Verifica Resposta HTTP e se o método do repositório foi chamado
        expect(response.statusCode).toBe(200); 
        // Verifica o NOVO nome do método
        expect(mockLogRepository.getLogs).toHaveBeenCalledTimes(1); 
        
        // 3. Verifica Integração: Confirma se os dados mockados foram injetados no HTML
        expect(response.text).toContain('Histórico de Inversões');
        // CORRIGIDO: Agora verifica APENAS a string exclusiva com o valor invertido.
        expect(response.text).toContain('**ananab**'); 
        expect(response.text).toContain('**asac**');
    });

    // Testa o POST /inverter
    test('2. POST /inverter deve chamar o método addLog do LogRepository (Teste de Comportamento)', async () => {
        // Limpa o mock do 'addLog'
        mockLogRepository.addLog.mockClear(); 

        const textoTeste = 'engenharia';
        
        // 1. Simula o envio do formulário (POST)
        await request(app)
            .post('/inverter')
            .send('textoOriginal=engenharia'); 

        // 2. Verifica se o NOVO método addLog foi chamado com os argumentos corretos
        expect(mockLogRepository.addLog).toHaveBeenCalledWith(
            textoTeste, 
            'airahnegne' // texto invertido
        );
        expect(mockLogRepository.addLog).toHaveBeenCalledTimes(1);
    });
});