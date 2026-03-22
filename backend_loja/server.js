require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cron = require('node-cron'); // 🤖 Importa o agendador
const pedidoController = require('./src/controllers/pedidoController'); // Importa a lógica de estoque
const routes = require('./src/routes');

const app = express();

app.use(cors());
app.use(express.json());

// 🛡️ ROTAS
app.use(routes);

// 🤖 AGENDAMENTO: RESERVA TEMPORÁRIA (Ponto 2 da sua lista)
// O cron '*/5 * * * *' faz o robô rodar a cada 5 minutos.
// Ele verifica se há pedidos pendentes há mais de 30 min e devolve o tênis para a prateleira.
cron.schedule('*/5 * * * *', async () => {
  console.log("--------------------------------------------------");
  console.log("🤖 [SISTEMA]: Verificando pedidos expirados...");
  try {
    await pedidoController.cancelarPedidosExpirados();
  } catch (err) {
    console.error("❌ Erro no robô de estoque:", err);
  }
  console.log("--------------------------------------------------");
});

app.listen(3000, () => {
  console.log("🔥 API da Casa da Sapatilha rodando na porta 3000");
  console.log("🚀 Robô de reserva de estoque ativado (Check a cada 5min)");
});