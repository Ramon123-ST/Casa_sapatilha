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

// --- CONFIGURAÇÃO DO BANCO DE DADOS ---
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '123456', 
  database: 'loja_sapatilhas',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Teste de conexão
pool.getConnection()
  .then(conn => {
    console.log("✅ Conexão SQL OK!");
    conn.release();
  })
  .catch(err => {
    console.error("❌ ERRO NO BANCO:", err.message);
  });

// --- MIDDLEWARES ---
app.use(cors()); 
app.use(express.json()); 

// --- CONFIGURAÇÃO DE UPLOAD  ---
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

// --- ROTA DE PEDIDOS ---
app.get('/pedidos/meus-pedidos', async (req, res) => {
  try {
    const query = `
      SELECT p.id, p.status, p.total_geral, p.criado_em,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', ip.id, 'quantidade', ip.quantidade, 'tamanho_escolhido', ip.tamanho_escolhido,
            'preco_unitario', ip.preco_unitario,
            'produto', JSON_OBJECT('nome', prod.nome, 'imagem', prod.imagem)
          )
        ) AS itens_pedido
      FROM pedidos p
      LEFT JOIN itens_pedido ip ON p.id = ip.pedido_id
      LEFT JOIN produtos prod ON ip.produto_id = prod.id
      GROUP BY p.id
      ORDER BY p.criado_em DESC;
    `;
    const [rows] = await pool.execute(query);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao buscar pedidos." });
  }
});

// --- ROTA DE CADASTRO DE PRODUTOS ---
app.post('/produtos/cadastrar', upload.single('imagemFile'), async (req, res) => {
  let conn;
  try {
    const { nome, preco, cor, descricao, grade } = req.body;
    const gradeArray = JSON.parse(grade || '[]'); 
    const nomeImagem = req.file ? req.file.filename : 'placeholder.webp';

    conn = await pool.getConnection();
    await conn.beginTransaction(); 

    const [resProd] = await conn.execute(
      'INSERT INTO produtos (nome, preco, cor, descricao, imagem, status, categoria_id) VALUES (?, ?, ?, ?, ?, "Ativo", 1)',
      [nome, preco, cor, descricao, nomeImagem]
    );

    const produtoId = resProd.insertId;

    for (const item of gradeArray) {
      await conn.execute(
        'INSERT INTO estoque (produto_id, tamanho, quantidade) VALUES (?, ?, ?)',
        [produtoId, String(item.tamanho), Number(item.quantidade)]
      );
    }

    await conn.commit(); 
    res.status(201).json({ mensagem: "Sucesso!", id: produtoId });
  } catch (err) {
    if (conn) await conn.rollback(); 
    res.status(500).json({ erro: "Erro ao cadastrar produto." });
  } finally {
    if (conn) conn.release();
  }
});

// --- CENTRAL DE ROTAS (LOGIN, RECUPERAÇÃO, ETC) ---
app.use(routes);

// --- ROBÔ DE CANCELAMENTO DE PRODUTOS ---
cron.schedule('*/5 * * * *', async () => {
  try {
    if (pedidoController && pedidoController.cancelarPedidosExpirados) {
      console.log("🤖 Robô: Verificando pedidos expirados...");
      await pedidoController.cancelarPedidosExpirados();
    }
  } catch (err) {
    console.error("❌ Erro no robô:", err.message);
  }
});

// --- INICIALIZAÇÃO ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em: http://localhost:${PORT}`);
});