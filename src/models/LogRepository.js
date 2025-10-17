/**
 * src/models/LogRepository.js
 * Repositório simulado para persistência de logs (in-memory).
 * * * REFACTOR: Métodos 'salvar' e 'getHistorico' renomeados para 'addLog' e 'getLogs'.
 * * REFACTOR: Propriedade 'invertida' renomeada para 'inverted'.
 */
class LogRepository {
    // Simula um "banco de dados" em memória para o log
    constructor() {
        this.logs = [];
        
        // Dados iniciais para garantir que os testes de integração passem
        this.logs.push(
            // Alinhado para 'inverted'
            { original: 'banana', inverted: 'ananab', data: new Date().toISOString() }, 
            { original: 'casa', inverted: 'asac', data: new Date().toISOString() } 
        );
    }

    /**
     * Simula a persistência de um log (assíncrona).
     */
    async addLog(original, inverted) { // Renomeado de 'salvar' para 'addLog'
        await new Promise(resolve => setTimeout(resolve, 10)); // Simula latência
        this.logs.push({
            original: original,
            inverted: inverted, // Renomeado de 'invertida' para 'inverted'
            data: new Date().toISOString()
        });
    }

    /**
     * Retorna o histórico de inversões (assíncrona).
     */
    async getLogs() { // Renomeado de 'getHistorico' para 'getLogs'
        await new Promise(resolve => setTimeout(resolve, 10)); // Simula latência
        return this.logs;
    }
    
    /**
     * Limpa todos os logs (útil para garantir que testes E2E comecem do zero).
     */
    clearLogs() {
        this.logs.length = 0;
    }
}

module.exports = LogRepository;