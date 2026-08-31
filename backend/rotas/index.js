const express = require('express');
const router = express.Router();

const sincronizacaoRotas = require('./sincronizacaoRotas');
const usuarioRotas = require('./usuarioRotas');
const painelRotas = require('./painelRotas');
const youtubeRotas = require('./youtubeRotas');
const engenhariaRotas = require('./engenhariaRotas');

// Monta os sub-roteadores
router.use('/', sincronizacaoRotas);
router.use('/', usuarioRotas);
router.use('/', painelRotas);
router.use('/youtube', youtubeRotas);
router.use('/', engenhariaRotas);

module.exports = router;
