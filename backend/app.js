const express = require('express');
const cors = require('cors');
const rotas = require('./rotas');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Suporte a payloads em lote

// Montagem das rotas da API
app.use('/api', rotas);

module.exports = app;
