const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');

router.get('/', (req, res) => {
  res.send("API funcionando 🚀");
});

// Listar todas as sapatilhas
router.get('/produtos', produtoController.listarTodos);

// ✅ NOVA ROTA: Buscar uma sapatilha específica pelo ID
// O :id é o que permite o React pedir /produtos/1, /produtos/2, etc.
router.get('/produtos/:id', produtoController.buscarPorId);

// Cadastrar nova sapatilha
router.post('/produtos', produtoController.cadastrar);

module.exports = router;