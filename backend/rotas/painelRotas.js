const express = require('express');
const router = express.Router();
const { obterPainel, obterDesafiosUsuario } = require('../controladores/painelControlador');

router.get('/dashboard/:id', obterPainel);
router.get('/desafios/:id', obterDesafiosUsuario);

module.exports = router;
