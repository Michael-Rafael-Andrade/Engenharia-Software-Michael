// src/models/LogRepository.js

class LogRepository {
    /**
     * Simula a busca de logs em um banco de dados ou API externa.
     */
    static getLog() {
        return [
            { id: 1, original: 'banana', invertida: 'ananab', data: '2025-10-15' },
            { id: 2, original: 'tempo', invertida: 'opmet', data: '2025-10-15' },
            { id: 3, original: 'teste', invertida: 'etset', data: '2025-10-15' },
        ];
    }
}

module.exports = LogRepository;