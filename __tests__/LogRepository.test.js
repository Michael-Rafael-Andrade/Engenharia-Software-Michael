const LogRepository = require('../src/models/LogRepository');

describe('Teste Unitário: LogRepository', () => {
    let repo;

    beforeEach(() => {
        // Cria uma nova instância antes de cada teste para isolamento
        repo = new LogRepository();
    });

    // Teste 1: Valida se os dados iniciais estão sendo carregados (constructor)
    test('1. O repositório deve ser inicializado com logs', async () => {
        const logs = await repo.getLogs();
        expect(logs.length).toBe(2); 
        expect(logs[0].original).toBe('banana');
    });

    // Teste 2: Valida a escrita de novos logs (addLog)
    test('2. Deve adicionar um novo log corretamente', async () => {
        const initialCount = (await repo.getLogs()).length;
        await repo.addLog('engenharia', 'airahnegne');
        const logs = await repo.getLogs();
        expect(logs.length).toBe(initialCount + 1);
        expect(logs[2].inverted).toBe('airahnegne');
    });

    // Teste 3: COBERTURA CRÍTICA: Cobre a função clearLogs (Linhas 36-37)
    test('3. Deve limpar todos os logs corretamente', async () => {
        // 1. Verifica se há logs antes da limpeza
        expect((await repo.getLogs()).length).toBeGreaterThan(0); 
        
        // 2. Chama a função que precisa de cobertura
        repo.clearLogs(); 

        // 3. Verifica se a lista está vazia
        const logsAfterClear = await repo.getLogs();
        expect(logsAfterClear.length).toBe(0); 
    });
});