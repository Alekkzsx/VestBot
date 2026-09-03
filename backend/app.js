const express = require('express');
const cors = require('cors');
const path = require('path');
const rotas = require('./rotas');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Suporte a payloads em lote

// Servir arquivos estáticos do frontend e pasta de imagens
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/images', express.static(path.join(__dirname, '../images')));

// Rota escondida: Painel de Engenharia (Admin)
app.get(['/engenharia', '/engenharia/'], (req, res) => {
  res.redirect('/telaEngenharia/index.html');
});

// Redirecionamento da raiz para a tela inicial (Painel)
app.get('/', (req, res) => {
  res.redirect('/telaPainel/index.html');
});

// Montagem das rotas da API
app.use('/api', rotas);

module.exports = app;
