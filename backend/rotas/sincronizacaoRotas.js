const express = require('express');
const router = express.Router();
const { ping, sincronizar } = require('../controladores/sincronizacaoControlador');

router.get('/ping', ping);
router.post('/sync', sincronizar);

module.exports = router;
