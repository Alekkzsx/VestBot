const express = require('express');
const router = express.Router();
const { obterUsuario, obterProximaProvaAgendada } = require('../controladores/usuarioControlador');

router.get('/usuario/:id', obterUsuario);
router.get('/proxima-prova', obterProximaProvaAgendada);

module.exports = router;
