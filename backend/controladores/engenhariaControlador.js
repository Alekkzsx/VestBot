const engenhariaServico = require('../servicos/engenhariaServico');

async function adicionarQuestao(req, res) {
  try {
    const dados = req.body;
    
    // Validação básica
    if (!dados.disciplina || !dados.assunto || !dados.enunciado || !dados.alternativaCorreta || !dados.alternativas) {
      return res.status(400).json({ erro: "Dados obrigatórios incompletos." });
    }

    if (dados.isInterpretacao && !dados.textoBaseConteudo && !dados.textoBaseIdExistente) {
      return res.status(400).json({ erro: "Questão de interpretação exige um texto base." });
    }

    const resultado = await engenhariaServico.adicionarQuestao(dados);
    res.status(201).json(resultado);
  } catch (erro) {
    console.error("Erro no controlador de engenharia:", erro);
    res.status(500).json({ erro: "Falha interna ao salvar a questão." });
  }
}

module.exports = {
  adicionarQuestao
};
