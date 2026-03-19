const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');

router.get('/', (req, res) => {
  res.send("API funcionando 🚀");
});

// Suas rotas
router.get('/produtos', produtoController.listarTodos);
router.post('/produtos', produtoController.cadastrar); // 👈 Adicione esta linha

module.exports = router;