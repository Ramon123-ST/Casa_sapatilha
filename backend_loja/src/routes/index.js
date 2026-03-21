const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');
const usuarioController = require('../controllers/usuarioController');

router.get('/', (req, res) => {
  res.send("API funcionando 🚀 - Casa da Sapatilha");
});

// 👟 ROTAS DE PRODUTOS
router.get('/produtos', produtoController.listarTodos);
router.get('/produtos/:id', produtoController.buscarPorId);
router.post('/produtos', produtoController.cadastrar);

// 👤 ROTAS DE USUÁRIO
// Dica: Use nomes simples para o fetch do React ficar fácil: /usuarios e /login
router.post('/usuarios', usuarioController.cadastrar);
router.post('/login', usuarioController.login);

module.exports = router;