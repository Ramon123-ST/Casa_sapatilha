const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Lista todos os produtos
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

// BUSCAR UM PRODUTO PELO ID (Usado na página DetalhesProduto.jsx)
exports.buscarPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const produto = await prisma.produtos.findUnique({
      where: { id: parseInt(id) },
      include: { categoria: true }
    });

    if (!produto) {
      return res.status(404).json({ erro: "Sapatilha não encontrada" });
    }

    res.json(produto);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar detalhes do produto", detalhes: error.message });
  }
};

// CADASTRAR COM PRISMA (Adicionado campos de cor, tamanho e promo)
exports.cadastrar = async (req, res) => {
  try {
    const { 
      nome, 
      descricao, 
      preco, 
      preco_antigo, 
      estoque, 
      imagem, 
      cor, 
      tamanho_disponivel, 
      categoria_id 
    } = req.body;

    const novoProduto = await prisma.produtos.create({
      data: {
        nome,
        descricao,
        preco: parseFloat(preco), 
        preco_antigo: preco_antigo ? parseFloat(preco_antigo) : null,
        estoque: parseInt(estoque), 
        imagem,
        cor,
        tamanho_disponivel,
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