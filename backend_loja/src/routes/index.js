const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');
const usuarioController = require('../controllers/usuarioController');
const pedidoController = require('../controllers/pedidoController');

router.get('/', (req, res) => {
  res.send("API funcionando 🚀 - Casa da Sapatilha");
});

// 👟 ROTAS DE PRODUTOS
router.get('/produtos', produtoController.listarTodos);
router.get('/produtos/:id', produtoController.buscarPorId);
router.post('/produtos', produtoController.cadastrar);
router.put('/produtos/desativar/:id', produtoController.desativar);

// 👤 ROTAS DE USUÁRIO
router.post('/usuarios', usuarioController.cadastrar);
router.post('/login', usuarioController.login);

// 📦 ROTAS DE PEDIDOS
// Para o cliente criar o pedido
router.post('/pedidos', pedidoController.criar);

// ✅ NOVO: Para o Admin listar todos os pedidos na tabela (GestaoPedidos.jsx)
router.get('/pedidos', pedidoController.listarTodos);

// Para o Admin mudar o status (Pendente -> Pago)
router.patch('/pedidos/:id/status', pedidoController.atualizarStatus);

// 📊 ROTA DO DASHBOARD
router.get('/admin/dashboard', pedidoController.dashboardResumo);

module.exports = router;