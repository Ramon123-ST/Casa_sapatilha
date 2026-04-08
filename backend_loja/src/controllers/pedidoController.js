const prisma = require('../database'); 

const pedidoController = {
  // Criar Pedido e Baixar Estoque
  criar: async (req, res) => {
    try {
      const { usuario_id, itens, valor_frete, total_geral } = req.body;

      if (!prisma) throw new Error("Conexão com o banco falhou.");

      const resultado = await prisma.$transaction(async (tx) => {
        const novoPedido = await tx.pedidos.create({
          data: {
            usuario_id: parseInt(usuario_id),
            valor_frete,
            total_geral,
            status: "Pendente",
            itens_pedido: {
              create: itens.map(item => ({
                produto_id: parseInt(item.produto_id),
                quantidade: parseInt(item.quantidade),
                preco_unitario: item.preco_unitario,
                tamanho_escolhido: String(item.tamanho_escolhido)
              }))
            }
          }
        });

        for (const item of itens) {
          const variacao = await tx.estoque.findFirst({
            where: {
              produto_id: parseInt(item.produto_id),
              tamanho: String(item.tamanho_escolhido)
            }
          });

          if (!variacao || variacao.quantidade < item.quantidade) {
            throw new Error(`Estoque insuficiente para o tamanho ${item.tamanho_escolhido}`);
          }

          await tx.estoque.update({
            where: { id: variacao.id },
            data: { quantidade: { decrement: parseInt(item.quantidade) } }
          });
        }
        return novoPedido;
      });

      res.status(201).json({ mensagem: "Pedido realizado! Estoque reservado.", pedido: resultado });
    } catch (error) {
      console.error("Erro ao criar pedido:", error.message);
      res.status(400).json({ erro: error.message });
    }
  },

  // Listar pedidos para o Admin
  listarTodos: async (req, res) => {
    try {
      const pedidos = await prisma.pedidos.findMany({
        include: {
          usuario: { select: { nome: true, email: true, telefone: true } },
          itens_pedido: {
            include: {
              produto: { 
                select: { 
                  nome: true, 
                  imagem: true, 
                  imagem_2: true, 
                  imagem_3: true, 
                  cor: true 
                } 
              }
            }
          }
        },
        orderBy: { criado_em: 'desc' }
      });
      res.json(pedidos);
    } catch (error) {
      console.error("Erro ao listar pedidos:", error);
      res.status(500).json({ erro: "Erro ao buscar lista de pedidos." });
    }
  },

  // 🤖 Devolver Estoque (Atualizado para evitar erros de tipagem)
  cancelarPedidosExpirados: async () => {
    // Define limite de 30 minutos atrás
    const tempoLimite = new Date(Date.now() - 30 * 60 * 1000); 

    try {
      const pedidosExpirados = await prisma.pedidos.findMany({
        where: {
          status: "Pendente",
          criado_em: { lt: tempoLimite }
        },
        include: { itens_pedido: true }
      });

      if (pedidosExpirados.length === 0) return;

      for (const pedido of pedidosExpirados) {
        await prisma.$transaction(async (tx) => {
          for (const item of pedido.itens_pedido) {
            const variacao = await tx.estoque.findFirst({
              where: { 
                produto_id: item.produto_id, 
                tamanho: String(item.tamanho_escolhido) 
              }
            });

            if (variacao) {
              await tx.estoque.update({
                where: { id: variacao.id },
                data: { quantidade: { increment: item.quantidade } }
              });
            }
          }

          await tx.pedidos.update({
            where: { id: pedido.id },
            data: { status: "Cancelado" }
          });
        });
        console.log(`[ROBÔ] 🗑️ Pedido ${pedido.id} expirado. Estoque devolvido.`);
      }
    } catch (error) {
      console.error("Erro ao processar expiração:", error.message);
    }
  },

  atualizarStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body; 

      const pedidoAtualizado = await prisma.pedidos.update({
        where: { id: parseInt(id) },
        data: { 
          status,
          atualizado_em: new Date() 
        }
      });

      res.json(pedidoAtualizado);
    } catch (error) {
      res.status(500).json({ erro: "Erro ao atualizar status" });
    }
  },

  // Resumo Dashboard
  dashboardResumo: async (req, res) => {
    try {
      const resumoPago = await prisma.pedidos.aggregate({
        where: { status: "Pago" },
        _sum: { total_geral: true },
        _count: { id: true }
      });

      const pendentes = await prisma.pedidos.count({
        where: { status: "Pendente" }
      });

      res.json({
        totalVendas: resumoPago._count.id,
        faturamentoTotal: Number(resumoPago._sum.total_geral) || 0,
        pedidosPendentes: pendentes
      });
    } catch (error) {
      console.error("Erro dashboard:", error);
      res.status(500).json({ erro: "Erro ao gerar dashboard" });
    }
  }
};

module.exports = pedidoController;