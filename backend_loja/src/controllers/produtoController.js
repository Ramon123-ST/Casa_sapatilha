const prisma = require('../database'); 

//  Validação de Inicialização
if (!prisma || !prisma.produtos) {
  console.error("❌ ERRO CRÍTICO: O Prisma não foi carregado no Controller.");
}

// 1. LISTAR TODOS (Vitrine)
exports.listarTodos = async (req, res) => {
  try {
    const produtos = await prisma.produtos.findMany({
      where: { status: "ativo" }, 
      include: { 
        categoria: true,
        estoque: true 
      },
      orderBy: { criado_em: 'desc' }
    });
    res.json(produtos);
  } catch (error) {
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

// 3. CADASTRAR (Com Galeria de Imagens)
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
        cor,
        status: "ativo",
        categoria: categoria_id ? { connect: { id: Number(categoria_id) } } : undefined,
        estoque: {
          create: variacoes ? variacoes.map(v => ({
            tamanho: Number(v.tamanho),
            quantidade: Number(v.quantidade)
          })) : []
        }
      },
      include: { estoque: true }
    });

    res.status(201).json(novoProduto);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao cadastrar produto", detalhes: error.message });
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

// 5. DELETAR (REMOVER)
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