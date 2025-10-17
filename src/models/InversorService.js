/**
 * src/models/InversorService.js
 * Lógica de Negócio para a inversão de strings.
 * * * CORREÇÃO CRÍTICA: Refatorado de objeto literal para CLASSE (Constructor)
 * * para resolver o TypeError: InversorService is not a constructor.
 */
class InversorService { // AGORA É UMA CLASSE
    /**
     * Inverte a ordem dos caracteres em uma string.
     * @param {string} texto - A string a ser invertida.
     * @returns {string} - A string invertida.
     */
    inverterString(texto) {
        if (!texto || typeof texto !== 'string' || texto.length === 0) {
            return '';
        }

        // Lógica de inversão: divide, reverte e junta (Cenários 1 e 2 cobertos)
        return texto.split('').reverse().join('');
    }
}

module.exports = InversorService;