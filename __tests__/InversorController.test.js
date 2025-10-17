// __tests__/InversorController.test.js

const InversorController = require('../src/controllers/InversorController');

// Mocks simples para garantir que a injeção funcione
const mockService = { inverterString: jest.fn() };
const mockRepository = { getLogs: jest.fn() };

describe('InversorController - Testes de Unidade', () => {

    // TESTE PARA O BRANCH 2: Passando Mocks (Argumentos)
    test('1. O construtor deve aceitar e usar as dependências passadas (Injeção de Dependência)', () => {
        // 1. Instancia o Controller, passando os mocks
        const controller = new InversorController(mockService, mockRepository);

        // 2. Verifica se as propriedades do Controller foram definidas com os mocks
        expect(controller.inversorService).toBe(mockService);
        expect(controller.logRepository).toBe(mockRepository);
    });

    // TESTE PARA O BRANCH 1: Sem passar nada (Usando Defaults)
    test('2. O construtor deve usar dependências padrão quando nenhum argumento for passado', () => {
        // 1. Instancia o Controller sem argumentos
        const controller = new InversorController();

        // 2. Verifica se as propriedades foram definidas (com as instâncias padrão)
        // O Jest detectará que o código executou a lógica de 'new InversorService()' e 'new LogRepository()'
        expect(controller.inversorService).toBeDefined();
        expect(controller.logRepository).toBeDefined();
        // O mais importante: a linha do construtor é coberta agora!
    });

    // NOVO TESTE 3: Cobrir o caso de input vazio
    test('3. processarInversao deve redirecionar para "/" se textoOriginal estiver vazio', async () => {
        // Mock de Express Request/Response
        const req = { body: { textoOriginal: '' } }; // Input vazio
        const res = { redirect: jest.fn() };

        const controller = new InversorController(mockService, mockRepository);

        await controller.processarInversao(req, res);

        // Verifica se o método de serviço NÃO foi chamado, e sim o redirecionamento.
        expect(mockService.inverterString).not.toHaveBeenCalled();
        expect(res.redirect).toHaveBeenCalledWith('/');
    });

    // NOVO TESTE 4: Cobrir o caso de query param 'invertido' faltando
    test('4. renderResultado deve redirecionar para "/" se o query param "invertido" estiver faltando', async () => {
        // Mock de Express Request/Response
        const req = { query: { original: 'teste', invertido: undefined } }; // 'invertido' faltando
        const res = { redirect: jest.fn(), status: jest.fn(() => res), send: jest.fn() };
        
        const controller = new InversorController(mockService, mockRepository);

        await controller.renderResultado(req, res);

        // Verifica se houve redirecionamento e não houve envio de HTML
        expect(res.redirect).toHaveBeenCalledWith('/');
        expect(res.send).not.toHaveBeenCalled();
    });

    // NOVO TESTE 5: Cobrir a exibição de logs vazios
    test('5. renderLog deve exibir a mensagem de "Nenhum registro" quando a lista de logs for vazia', async () => {
        // Configura o mockRepository para retornar uma lista vazia
        mockRepository.getLogs.mockResolvedValue([]); 
        
        // Mock de Express Request/Response
        const req = {}; 
        const res = { send: jest.fn() };
        
        const controller = new InversorController(mockService, mockRepository);

        await controller.renderLog(req, res);

        // Verifica se o repositório foi chamado
        expect(mockRepository.getLogs).toHaveBeenCalled();
        // Verifica se a mensagem de "Nenhum registro" foi incluída no HTML (ramo de 'false' do ternário)
        expect(res.send).toHaveBeenCalledWith(expect.stringContaining('Nenhum registro de inversão encontrado.'));
    });
    
    // IMPORTANTE: Reseta o mock para o estado anterior (retorno com logs)
    // para não afetar outros testes de integração/aceitação.
    afterAll(() => {
        mockRepository.getLogs.mockRestore(); 
    });

});