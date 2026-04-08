const { prisma } = require('../database'); 

if (!prisma) {
  console.error("❌ ERRO CRÍTICO: O objeto Prisma não foi exportado corretamente do database.js.");
}

// 1. LISTAR TODOS (Vitrine)
exports.listarTodos = async (req, res) => {
  try {
    const produtos = await prisma.produtos.findMany({
      include: { 
        categoria: true,
        estoque: true 
      },
      orderBy: { criado_em: 'desc' }
    });
    res.json(produtos);
  } catch (error) {
    console.error("Erro ao listar produtos:", error.message);
    res.status(500).json({ erro: "Erro ao buscar produtos", detalhes: error.message });
  }
};

// 2. BUSCAR POR ID
exports.buscarPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const produto = await prisma.produtos.findUnique({
      where: { id: Number(id) },
      include: { categoria: true, estoque: true }
    });

    if (!produto) return res.status(404).json({ erro: "Sapatilha não encontrada" });

    res.json(produto);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar detalhes", detalhes: error.message });
  }
};

// 3. CADASTRAR (Com Galeria de Imagens e Tratamento de Dados)
exports.cadastrar = async (req, res) => {
  try {
    const { 
      nome, descricao, preco, preco_antigo, 
      imagem, imagem_2, imagem_3, 
      cor, categoria_id, variacoes 
    } = req.body;

    const novoProduto = await prisma.produtos.create({
      data: {
        nome,
        descricao,
        preco: parseFloat(preco), 
        preco_antigo: preco_antigo ? parseFloat(preco_antigo) : null,
        imagem,
        imagem_2, 
        imagem_3, 
        cor: cor || "Padrão",
        status: "Ativo",
        // Conexão com categoria garantindo que seja um número
        categoria: categoria_id ? { connect: { id: Number(categoria_id) } } : undefined,
        // Garante que tamanhos sejam Strings e quantidades sejam Números
        estoque: {
          create: variacoes ? variacoes.map(v => ({
            tamanho: String(v.tamanho),
            quantidade: parseInt(v.quantidade) || 0
          })) : []
        }
      },
      include: { estoque: true }
    });

    res.status(201).json(novoProduto);
  } catch (error) {
    console.error("Erro no cadastro (Prisma):", error.message);
    res.status(500).json({ erro: "Erro ao salvar no banco.", detalhes: error.message });
  }
};

// 4. ATUALIZAR (EDITAR)
exports.atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      nome, descricao, preco, 
      imagem, imagem_2, imagem_3, 
      cor, status 
    } = req.body;

    const produtoAtualizado = await prisma.produtos.update({
      where: { id: Number(id) },
      data: {
        nome,
        descricao,
        preco: preco ? parseFloat(preco) : undefined,
        imagem,
        imagem_2, 
        imagem_3, 
        cor,
        status: status || undefined
      }
    });

    res.json(produtoAtualizado);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao atualizar produto", detalhes: error.message });
  }
};

// 5. DELETAR
exports.deletar = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.estoque.deleteMany({ where: { produto_id: Number(id) } });
    await prisma.produtos.delete({ where: { id: Number(id) } });
    
    res.json({ mensagem: "Produto removido com sucesso!" });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao deletar", detalhes: error.message });
  }
};