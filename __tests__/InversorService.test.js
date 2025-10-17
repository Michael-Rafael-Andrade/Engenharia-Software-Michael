const InversorService = require('../src/models/InversorService');

describe('Teste Unitário: InversorService', () => {
    // Cenário 1: Entrada válida (Cobre a lógica principal)
    test('1. Deve inverter uma palavra simples corretamente', () => {
        expect(InversorService.inverterString('teste')).toBe('etset');
    });

    // Cenário 2: Entrada com espaços (Cobre a lógica principal)
    test('2. Deve inverter frase com espaços e manter a ordem dos caracteres', () => {
        expect(InversorService.inverterString('ola mundo')).toBe('odnum alo');
    });
    
    // Cenário 3: Entrada nula ou vazia (Cobre a lógica do if/return '')
    test('3. Deve retornar string vazia para entradas nulas ou inválidas', () => {
        expect(InversorService.inverterString(null)).toBe('');
        expect(InversorService.inverterString(undefined)).toBe('');
    });
});