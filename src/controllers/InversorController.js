const InversorService = require('../models/InversorService');
const LogRepository = require('../models/LogRepository');
const path = require('path');
// Importa o módulo File System com Promises para leitura assíncrona
const fs = require('fs/promises');

class InversorController {

    constructor(service, repository) {
        this.inversorService = service;
        this.logRepository = repository;
    }

    // Método para servir a página inicial (index.html)
    getPaginaInicial(req, res) {
        // Assume que o server.js já configurou a rota estática para servir index.html
        res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
    }

    // Método para processar a inversão e servir a página de resultado
    async postInverter(req, res) {
        const textoOriginal = req.body.textoOriginal;
        
        if (!textoOriginal) {
            // Se o texto estiver vazio, redireciona para a página inicial
            return res.redirect('/');
        }

        try {
            // 1. Inverte o texto
            const textoInvertido = this.inversorService.inverter(textoOriginal);

            // 2. Salva o log (opcional, dependendo do seu LogRepository)
            // Se o LogRepository for assíncrono, use await aqui.
            // this.logRepository.salvar(textoOriginal, textoInvertido);
            
            // 3. Lê o template HTML de resultado
            const caminhoResultado = path.join(__dirname, '..', 'views', 'resultado.html');
            let htmlContent = await fs.readFile(caminhoResultado, 'utf-8');

            // 4. INJETA O TEXTO INVERTIDO NO LOCAL CORRETO
            // Usamos uma substituição de string simples para injetar o resultado.
            const placeholder = '<!-- INVERTED_TEXT -->';
            
            // A substituição deve ocorrer dentro do elemento com ID 'texto-invertido'
            // Assumimos que o resultado.html usa o placeholder:
            // <div class="resultado" id="texto-invertido"><!-- INVERTED_TEXT --></div>
            
            // Verifica se o template contém o ID e injeta o texto invertido
            // Para simplificar, vamos substituir o conteúdo da tag que o teste verifica.
            
            // Primeiro, cria a tag HTML com o resultado real
            const elementoComResultado = `<div class="resultado" id="texto-invertido">${textoInvertido}</div>`;
            
            // Substitui o placeholder existente (se houver) ou a versão pura da tag no arquivo HTML original.
            // Vamos garantir que a substituição ocorra na tag que criamos no HTML
            // Para isso, faremos uma substituição de segurança que encontra a div
            
            // Substitui a div de resultado no HTML pelo resultado injetado.
            // Nota: Esta regex simples funciona se a tag for exatamente como no template.
            const regexDiv = /<div class="resultado" id="texto-invertido">[\s\S]*?<\/div>/;
            
            // Se o resultado.html tiver o placeholder: <div class="resultado" id="texto-invertido"><!-- PLACEHOLDER_TEXT --></div>
            // A maneira mais simples e robusta é fazer a substituição em duas etapas ou configurar o HTML para ter um placeholder interno.
            
            // SOLUÇÃO ROBUSTA: Garantimos que o texto invertido seja injetado entre as tags.
            const htmlComResultado = htmlContent.replace(
                '<div class="resultado" id="texto-invertido">', 
                `<div class="resultado" id="texto-invertido">${textoInvertido}`
            );
            
            // 5. Envia a View de Resultado Modificada
            res.send(htmlComResultado);

        } catch (error) {
            console.error("Erro ao processar inversão e renderizar resultado:", error);
            // Em caso de erro, redireciona ou mostra uma página de erro
            res.status(500).send("Erro interno ao processar a requisição.");
        }
    }
}

// Exporta uma instância para ser usada no server.js
module.exports = new InversorController(new InversorService(), new LogRepository());
