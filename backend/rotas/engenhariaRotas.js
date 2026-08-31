const express = require('express');
const router = express.Router();
const engenhariaControlador = require('../controladores/engenhariaControlador');

// Rota para cadastrar uma nova questão
router.post('/engenharia/questoes', engenhariaControlador.adicionarQuestao);

module.exports = router;
