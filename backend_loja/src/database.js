const mysql = require('mysql2/promise');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

// 1. Motor do Robô e Cadastro Direto (mysql2)
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '123456', 
  database: 'loja_sapatilhas',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 2. Motor do Site (Prisma) 
const prisma = new PrismaClient();

// Teste de conexão manual
pool.getConnection()
  .then(conn => {
    console.log("🤖 Robô: Conexão manual OK!");
    conn.release();
  })
  .catch(err => console.error("❌ Erro no mysql2:", err.message));

module.exports = { pool, prisma };