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


    // Importa o serviço real (para restaurar depois)
    const InversorService = require('../src/models/InversorService');

    // ... (código existente da mockLogRepository)

    describe('Teste de Integracao: Controller e LogRepository', () => {
        // ... (Testes 1 e 2 existentes)

        // NOVO TESTE: COBERTURA DO CAMINHO DE EXCEÇÃO (InversorController Linhas 73-74)
        test('3. POST /inverter deve retornar status 500 se o Service falhar', async () => {
            // 1. Mocka o Service para SEMPRE lançar um erro
            const mockServiceFalho = {
                // O mock deve imitar a interface: tem que ter o método inverterString
                inverterString: jest.fn(() => {
                    throw new Error("Erro simulado do service"); // Força a exceção
                })
            };

            // 2. Injeta o mock no Controller para este teste
            const originalService = controller.inversorService; // Salva o original
            controller.inversorService = mockServiceFalho;

            // 3. Simula o POST
            const response = await request(app)
                .post('/inverter')
                .send('textoOriginal=teste');

            // 4. Verifica se o Controller capturou o erro e retornou 500
            expect(response.statusCode).toBe(500);
            expect(response.text).toContain("Erro interno ao processar a requisição.");

            // 5. CRÍTICO: Restaura o service original para que os outros testes funcionem
            controller.inversorService = originalService;
        });

        // NOVO TESTE: COBERTURA DA VALIDAÇÃO (InversorController Linha 60)
        test('4. POST /inverter com campo vazio deve redirecionar para /', async () => {
            // 1. Simula o POST sem o textoOriginal (ou com ele vazio)
            const response = await request(app)
                .post('/inverter')
                .send('textoOriginal='); // Envia string vazia

            // 2. Verifica se houve o redirecionamento (status 302)
            expect(response.statusCode).toBe(302);
            expect(response.headers.location).toBe('/'); // Verifica se redirecionou para a raiz
        });

        // NOVO TESTE: COBERTURA DO CATCH NO RENDER LOG (InversorController Linhas 160-161) <- REFERENTE A ERROS QUE FORAM REPARADOS AO LONGO DA CRIAÇÃO DO CÓDIGO
        test('5. GET /log deve retornar status 500 se o LogRepository falhar', async () => {
            // 1. Mocka o Repository para SEMPRE lançar um erro
            const mockRepoFalho = {
                // Mocka o método que o Controller chama
                getLogs: jest.fn(() => {
                    throw new Error("Erro simulado do LogRepository"); // Força a exceção
                })
            };

            // 2. Injeta o mock no Controller para este teste
            const originalRepo = controller.logRepository; // Salva o original
            controller.logRepository = mockRepoFalho;

            // 3. Simula o GET
            const response = await request(app)
                .get('/log');

            // 4. Verifica se o Controller capturou o erro e retornou 500
            expect(response.statusCode).toBe(500);
            expect(response.text).toContain("Erro ao carregar o histórico.");

            // 5. CRÍTICO: Restaura o repositório original
            controller.logRepository = originalRepo;
        });

    });

    // Importa a função getServerInstance
    const { getServerInstance } = require('../server');

    describe('Teste de Cobertura Final: server.js', () => {
        test('6. Deve chamar a função getServerInstance para cobertura de 100%', () => {
            // Simplesmente chamar a função é suficiente para cobrir a linha
            const instance = getServerInstance();

            // A instância deve ser o app
            expect(instance).toBe(app);
        });
    });


    // Tratando - mock / silenciar o console.error
    let errorSpy;

    beforeAll(() => {
        // Espiona o console.error e o substitui por uma função vazia.
        // Isso evita que os erros simulados nos blocos catch poluam a saída.
        errorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterAll(() => {
        // Restaura a função original do console.error após todos os testes.
        errorSpy.mockRestore();
    });

});