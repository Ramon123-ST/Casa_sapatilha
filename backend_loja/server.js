require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise'); 
const cors = require('cors');
const path = require('path'); 
const fs = require('fs'); 
const cron = require('node-cron'); 
const multer = require('multer'); 
const { v4: uuidv4 } = require('uuid'); 
const routes = require('./src/routes'); 
const pedidoController = require('./src/controllers/pedidoController'); 

const app = express();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '123456', 
  database: process.env.DB_NAME || 'loja_sapatilhas',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection()
  .then(conn => {
    console.log("✅ Conexão SQL OK!");
    conn.release();
  })
  .catch(err => {
    console.error("⚠️ Aviso: Banco de dados offline ou em configuração:", err.message);
  });

// --- MIDDLEWARES ---
app.use(cors()); 
app.use(express.json()); 

// --- CONFIGURAÇÃO DE UPLOAD  ---
const pastaImagens = path.resolve(__dirname, 'img');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (process.env.NODE_ENV !== 'production') {
      if (!fs.existsSync(pastaImagens)) fs.mkdirSync(pastaImagens, { recursive: true });
    }
    cb(null, pastaImagens);
  },
  filename: (req, file, cb) => {
    const extensao = path.extname(file.originalname).toLowerCase();
    cb(null, `sap-${uuidv4().slice(0, 8)}${extensao}`);
  }
});

const upload = multer({ storage });

// --- SERVINDO ARQUIVOS ESTÁTICOS ---
app.use('/img', express.static(pastaImagens));

// --- ROTAS ---
app.use(routes); 

// --- ROBÔ DE CANCELAMENTO DE PRODUTOS ---
if (process.env.NODE_ENV !== 'production') {
  cron.schedule('*/5 * * * *', async () => {
    try {
      if (pedidoController?.cancelarPedidosExpirados) {
        await pedidoController.cancelarPedidosExpirados();
      }
    } catch (err) {
      console.error("❌ Erro no robô:", err.message);
    }
  });
}

// --- INICIALIZAÇÃO ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor pronto na porta: ${PORT}`);
});