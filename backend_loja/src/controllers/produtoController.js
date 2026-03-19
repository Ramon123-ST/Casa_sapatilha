const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Função que você já tinha
exports.listarTodos = async (req, res) => {
  try {
    const produtos = await prisma.produtos.findMany({
      include: { categoria: true } 
    });
    res.json(produtos);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar produtos", detalhes: error.message });
  }
};

// 🚀 NOVA FUNÇÃO: CADASTRAR COM PRISMA
exports.cadastrar = async (req, res) => {
  try {
    const { nome, descricao, preco, estoque, imagem, categoria_id } = req.body;

    const novoProduto = await prisma.produtos.create({
      data: {
        nome: nome,
        descricao: descricao,
        preco: parseFloat(preco), // O Prisma exige que o preço seja um número decimal/float
        estoque: parseInt(estoque), // Garante que o estoque seja um número inteiro
        imagem: imagem,
        // Conexão com a categoria (chave estrangeira)
        categoria: {
          connect: { id: parseInt(categoria_id) }
        }
      }
    });

    res.status(201).json(novoProduto);
  } catch (error) {
    console.error("Erro ao cadastrar:", error);
    res.status(500).json({ erro: "Erro ao cadastrar produto", detalhes: error.message });
  }
};