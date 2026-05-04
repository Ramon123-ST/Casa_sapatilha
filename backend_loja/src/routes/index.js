const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');
const usuarioController = require('../controllers/usuarioController');
const pedidoController = require('../controllers/pedidoController');

// Rota de teste para verificar se o Back-end está online
router.get('/', (req, res) => {
  res.send("API funcionando 🚀 - Casa da Sapatilha");
});

// --- ROTAS DE PRODUTOS ---
router.get('/produtos', produtoController.listarTodos);           // Vitrine
router.get('/produtos/:id', produtoController.buscarPorId);      // Detalhes
router.post('/produtos', produtoController.cadastrar);           // Cadastro (Admin)
router.put('/produtos/:id', produtoController.atualizar);        // Editar (Admin)
router.delete('/produtos/:id', produtoController.deletar);       // Excluir (Admin)

// --- ROTAS DE USUÁRIO (Autenticação) ---
router.post('/usuarios', usuarioController.cadastrar);           // Registro manual
router.post('/login', usuarioController.login);                 // Login manual
router.post('/login-google', usuarioController.loginGoogle);    // Login social

// --- RECUPERAÇÃO DE SENHA ---
// --- Envia e-mail com o código ---
router.post('/recuperar-senha', usuarioController.solicitarRecuperacao); 

// --- Valida código e troca a senha ---
router.post('/redefinir-senha', usuarioController.redefinirSenha);

// --- ROTAS DE PEDIDOS ---
router.post('/pedidos', pedidoController.criar);                 // Finalizar compra
router.get('/pedidos', pedidoController.listarTodos);           // Lista geral (Admin)
router.patch('/pedidos/:id/status', pedidoController.atualizarStatus); // Mudar status

// --- DASHBOARD E RELATÓRIOS ---
router.get('/admin/dashboard', pedidoController.dashboardResumo);

module.exports = router;