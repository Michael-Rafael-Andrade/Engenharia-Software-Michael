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
});