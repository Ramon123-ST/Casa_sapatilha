const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');
const usuarioController = require('../controllers/usuarioController');
const pedidoController = require('../controllers/pedidoController');

// Rota de teste
router.get('/', (req, res) => {
  res.send("API funcionando 🚀 - Casa da Sapatilha");
});

// --- ROTAS DE PRODUTOS ---
router.get('/produtos', produtoController.listarTodos);           // Vitrine e Listagem
router.get('/produtos/:id', produtoController.buscarPorId);      // Detalhes do Produto
router.post('/produtos', produtoController.cadastrar);           // Cadastro de novo item
router.put('/produtos/:id', produtoController.atualizar);        // EDITAR o produto
router.delete('/produtos/:id', produtoController.deletar);       // EXCLUIR o produto (Desativar)

// --- ROTAS DE USUÁRIO ---
router.post('/usuarios', usuarioController.cadastrar);           // Criar conta manual
router.post('/login', usuarioController.login);                 // Entrar no sistema manual

// NOVA ROTA: Login com Google
router.post('/login-google', usuarioController.loginGoogle); 

// --- ROTAS DE PEDIDOS ---
router.post('/pedidos', pedidoController.criar);                 // Cliente finaliza compra
router.get('/pedidos', pedidoController.listarTodos);           // Admin lista todos (GestaoPedidos.jsx)
router.patch('/pedidos/:id/status', pedidoController.atualizarStatus); // Admin muda status

// --- ROTA DO DASHBOARD ---
router.get('/admin/dashboard', pedidoController.dashboardResumo); // Dados do gráfico e resumo

module.exports = router;