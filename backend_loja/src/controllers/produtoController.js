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

// ✅ NOVA FUNÇÃO: BUSCAR UM PRODUTO PELO ID
exports.buscarPorId = async (req, res) => {
  try {
    const { id } = req.params; // Pega o ID da URL

    const produto = await prisma.produtos.findUnique({
      where: { id: parseInt(id) }, // Converte o ID para número inteiro
      include: { categoria: true }  // Traz os dados da categoria junto
    });

    if (!produto) {
      return res.status(404).json({ erro: "Sapatilha não encontrada" });
    }

    res.json(produto);
  } catch (error) {
    console.error("Erro ao buscar por ID:", error);
    res.status(500).json({ erro: "Erro ao buscar detalhes do produto", detalhes: error.message });
  }
};

// CADASTRAR COM PRISMA
exports.cadastrar = async (req, res) => {
  try {
    const { nome, descricao, preco, estoque, imagem, categoria_id } = req.body;

    const novoProduto = await prisma.produtos.create({
      data: {
        nome: nome,
        descricao: descricao,
        preco: parseFloat(preco), 
        estoque: parseInt(estoque), 
        imagem: imagem,
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