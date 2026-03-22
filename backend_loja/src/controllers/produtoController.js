const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. LISTAR TODOS (Com estoque e categoria - Ponto 16)
exports.listarTodos = async (req, res) => {
  try {
    const produtos = await prisma.produtos.findMany({
      where: { status: "ativo" }, // Ponto 5: Soft Delete
      include: { 
        categoria: true,
        estoque: true // Traz os tamanhos e quantidades de cada produto
      } 
    });
    res.json(produtos);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar produtos", detalhes: error.message });
  }
};

// 2. BUSCAR POR ID (Ponto 6 - Detalhes para o pedido)
exports.buscarPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const produto = await prisma.produtos.findUnique({
      where: { id: parseInt(id) },
      include: { 
        categoria: true,
        estoque: true // Mostra os tamanhos disponíveis na página de detalhes
      }
    });

    if (!produto) {
      return res.status(404).json({ erro: "Sapatilha não encontrada" });
    }

    res.json(produto);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar detalhes", detalhes: error.message });
  }
};

// 3. CADASTRAR (Ponto 1, 3 e 11 - Integrado com a grade do Admin)
exports.cadastrar = async (req, res) => {
  try {
    const { 
      nome, 
      descricao, 
      preco, 
      preco_antigo, 
      imagem, 
      cor, 
      categoria_id,
      variacoes // Aqui recebemos o array de tamanhos do seu Admin.jsx
    } = req.body;

    const novoProduto = await prisma.produtos.create({
      data: {
        nome,
        descricao,
        preco: parseFloat(preco), 
        preco_antigo: preco_antigo ? parseFloat(preco_antigo) : null,
        imagem,
        cor,
        status: "ativo",
        categoria: categoria_id ? {
          connect: { id: parseInt(categoria_id) }
        } : undefined,
        // ✅ CRÍTICO: Salvando na nova tabela de estoque (Ponto 1)
        estoque: {
          create: variacoes.map(v => ({
            tamanho: parseInt(v.tamanho),
            quantidade: parseInt(v.quantidade)
          }))
        }
      },
      include: {
        estoque: true
      }
    });

    res.status(201).json(novoProduto);
  } catch (error) {
    console.error("Erro ao cadastrar:", error);
    res.status(500).json({ erro: "Erro ao cadastrar produto", detalhes: error.message });
  }
};

// 4. DESATIVAR (Ponto 5 - Soft Delete)
exports.desativar = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.produtos.update({
      where: { id: parseInt(id) },
      data: { status: "inativo" }
    });
    res.json({ mensagem: "Produto desativado com sucesso!" });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao desativar", detalhes: error.message });
  }
};