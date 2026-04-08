require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise'); 
const cors = require('cors');
const path = require('path'); 
const fs = require('fs'); 
const cron = require('node-cron'); 
const multer = require('multer'); 
const { v4: uuidv4 } = require('uuid'); 

// Importação de Rotas e Controllers
const routes = require('./src/routes');
const pedidoController = require('./src/controllers/pedidoController'); 

const app = express();

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '123456', // <--- SENHA DEFINIDA DIRETAMENTE AQUI
  database: 'loja_sapatilhas',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Teste de conexão imediato para conferir no terminal
pool.getConnection()
  .then(conn => {
    console.log("✅ Conexão SQL Direta (Pool/Robô) OK!");
    conn.release();
  })
  .catch(err => {
    console.error("❌ ERRO CRÍTICO NO BANCO:", err.message);
  });

// --- MIDDLEWARES ---
app.use(cors());
app.use(express.json());

// --- CONFIGURAÇÃO DE UPLOAD (MULTER) ---
const pastaImagens = path.resolve(__dirname, 'img');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(pastaImagens)) fs.mkdirSync(pastaImagens, { recursive: true });
    cb(null, pastaImagens);
  },
  filename: (req, file, cb) => {
    const extensao = path.extname(file.originalname).toLowerCase();
    cb(null, `sap-${uuidv4().slice(0, 8)}${extensao}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Apenas imagens são permitidas!'));
  }
});

// --- SERVINDO ARQUIVOS ESTÁTICOS ---
app.use('/img', express.static(pastaImagens));

// --- ROTA DE CADASTRO PROFISSIONAL (PRODUTO + GRADE + FOTO) ---
app.post('/produtos/cadastrar', upload.single('imagemFile'), async (req, res) => {
  let conn;
  try {
    const { nome, preco, cor, descricao, grade } = req.body;
    const gradeArray = JSON.parse(grade || '[]'); 
    const nomeImagem = req.file ? req.file.filename : 'placeholder.webp';

    conn = await pool.getConnection();
    await conn.beginTransaction(); 

    // 1. Inserir o Produto (Ajustado para a tabela 'produtos' no plural)
    const [resProd] = await conn.execute(
      'INSERT INTO produtos (nome, preco, cor, descricao, imagem, status, categoria_id) VALUES (?, ?, ?, ?, ?, "Ativo", 1)',
      [nome, preco, cor, descricao, nomeImagem]
    );

    const produtoId = resProd.insertId;

    // 2. Inserir a Grade de Estoque
    if (gradeArray.length > 0) {
      for (const item of gradeArray) {
        await conn.execute(
          'INSERT INTO estoque (produto_id, tamanho, quantidade) VALUES (?, ?, ?)',
          [produtoId, String(item.tamanho), Number(item.quantidade)]
        );
      }
    }

    await conn.commit(); 
    res.status(201).json({ mensagem: "Sapatilha cadastrada com sucesso!", id: produtoId });

  } catch (err) {
    if (conn) await conn.rollback(); 
    console.error("❌ Erro ao cadastrar:", err);
    res.status(500).json({ erro: "Erro ao salvar no banco.", detalhes: err.message });
  } finally {
    if (conn) conn.release();
  }
});

// --- DEMAIS ROTAS DA API ---
app.use(routes);

// --- 🤖 ROBÔ DE AGENDAMENTO (Cron Job) ---
cron.schedule('*/5 * * * *', async () => {
  try {
    console.log("🤖 Robô: Verificando pedidos expirados...");
    await pedidoController.cancelarPedidosExpirados();
  } catch (err) {
    console.error("❌ Erro no robô de cancelamento:", err.message);
  }
});

// --- INICIALIZAÇÃO DO SERVIDOR ---
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`
  🚀 API da Casa da Sapatilha v2.0 Ativa!
  ---------------------------------------------------------
  🔥 Servidor: http://localhost:${PORT}
  📸 Uploads: Habilitado (Pasta: /img)
  📦 Banco: MySQL (Porta 3306)
  ---------------------------------------------------------
  `);
});