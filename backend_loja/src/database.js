const { PrismaClient } = require('@prisma/client');

// instância do banco de dados
const prisma = new PrismaClient();

module.exports = prisma;