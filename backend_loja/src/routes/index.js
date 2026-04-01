const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');
const usuarioController = require('../controllers/usuarioController');
const pedidoController = require('../controllers/pedidoController');

// Rota de teste
router.get('/', (req, res) => {
  res.send("API funcionando 🚀 - Casa da Sapatilha");
});

//  ROTAS DE PRODUTOS
router.get('/produtos', produtoController.listarTodos);           // Vitrine e Listagem
router.get('/produtos/:id', produtoController.buscarPorId);      // Detalhes do Produto
router.post('/produtos', produtoController.cadastrar);           // Cadastro de novo item

//  ATUALIZADO: Rota para EDITAR o produto (Ponto 11)
router.put('/produtos/:id', produtoController.atualizar); 

//  ATUALIZADO: Rota para EXCLUIR o produto (Botão Desativar)
router.delete('/produtos/:id', produtoController.deletar);

//  ROTAS DE USUÁRIO
router.post('/usuarios', usuarioController.cadastrar);           // Criar conta
router.post('/login', usuarioController.login);                 // Entrar no sistema

//  ROTAS DE PEDIDOS
router.post('/pedidos', pedidoController.criar);                 // Cliente finaliza compra
router.get('/pedidos', pedidoController.listarTodos);           // Admin lista todos (GestaoPedidos.jsx)
router.patch('/pedidos/:id/status', pedidoController.atualizarStatus); // Admin muda status (Pendente -> Pago)

//  ROTA DO DASHBOARD
router.get('/admin/dashboard', pedidoController.dashboardResumo); // Dados do gráfico e resumo

module.exports = router;