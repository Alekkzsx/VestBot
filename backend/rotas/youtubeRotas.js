const express = require('express');
const router = express.Router();
const youtubeControlador = require('../controladores/youtubeControlador');

// GET /api/youtube/search?q=TERMO
router.get('/search', youtubeControlador.buscarVideos);

module.exports = router;
