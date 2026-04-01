require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path'); 
const fs = require('fs'); 
const cron = require('node-cron'); 

// Importação de Rotas e Controllers
const routes = require('./src/routes');
const pedidoController = require('./src/controllers/pedidoController'); 

const app = express();

// --- MIDDLEWARES ---
app.use(cors());
app.use(express.json());

// ---  CONFIGURAÇÃO DE ARQUIVOS ESTÁTICOS (IMAGENS) ---
// Tentamos encontrar a pasta 'public/img' ou 'img' para servir as fotos
const caminhosPossiveis = [
    path.join(__dirname, 'public'),
    path.join(__dirname, 'public', 'img'),
    path.join(__dirname, 'img')
];

caminhosPossiveis.forEach(caminho => {
    if (fs.existsSync(caminho)) {
        console.log(`✅ Servindo arquivos estáticos de: ${caminho}`);
        app.use(express.static(caminho));
        // Criei um apelido '/img' para facilitar a busca no Frontend
        app.use('/img', express.static(caminho));
    }
});

// --- ROTAS DA API ---
app.use(routes);

// --- 🤖 ROBÔ DE AGENDAMENTO (Cron Job) ---
// Roda a cada 5 minutos para limpar pedidos que não foram pagos
cron.schedule('*/5 * * * *', async () => {
  try {
    console.log("🤖 Robô: Verificando pedidos expirados...");
    await pedidoController.cancelarPedidosExpirados();
  } catch (err) {
    console.error("❌ Erro no robô de cancelamento:", err);
  }
});

// --- INICIALIZAÇÃO DO SERVIDOR ---
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`
  🚀 API da Casa da Sapatilha Online!
  -----------------------------------------
  🔥 Porta: ${PORT}
  📂 Backend: D:\\documento_proa\\Casa_sapatilha\\backend_loja
  📸 Teste de imagem: http://localhost:${PORT}/img/NOME_DA_SUA_FOTO.jpg
  -----------------------------------------
  `);
});