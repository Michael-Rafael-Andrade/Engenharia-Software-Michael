class InversorService {
    /**
     * Lógica pura que inverte uma string.
     * Esta é a "unidade" de código que o Teste Unitário deve cobrir 100%.
     */
    static inverterString(texto) {
        if (!texto || typeof texto !== 'string') {
            return ''; // Retorna string vazia se a entrada for inválida
        }
        // Converte a string em array -> inverte o array -> junta de volta em string
        return texto.split('').reverse().join('');
    }
}

module.exports = InversorService;