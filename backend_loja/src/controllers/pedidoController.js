const prisma = require('../database'); 

const pedidoController = {
  //  Criar Pedido e Baixar Estoque (Mantido com melhoria de segurança)
  criar: async (req, res) => {
    try {
      const { usuario_id, itens, valor_frete, total_geral } = req.body;

      if (!prisma) throw new Error("Conexão com o banco falhou.");

      const resultado = await prisma.$transaction(async (tx) => {
        const novoPedido = await tx.pedidos.create({
          data: {
            usuario_id,
            valor_frete,
            total_geral,
            status: "Pendente",
            itens_pedido: {
              create: itens.map(item => ({
                produto_id: item.produto_id,
                quantidade: item.quantidade,
                preco_unitario: item.preco_unitario,
                tamanho_escolhido: item.tamanho_escolhido
              }))
            }
          }
        });

        for (const item of itens) {
          const variacao = await tx.estoque.findFirst({
            where: {
              produto_id: item.produto_id,
              tamanho: item.tamanho_escolhido
            }
          });

          if (!variacao || variacao.quantidade < item.quantidade) {
            throw new Error(`Estoque insuficiente para o tamanho ${item.tamanho_escolhido}`);
          }

          await tx.estoque.update({
            where: { id: variacao.id },
            data: { quantidade: { decrement: item.quantidade } }
          });
        }
        return novoPedido;
      });

      res.status(201).json({ mensagem: "Pedido realizado! Estoque reservado.", pedido: resultado });
    } catch (error) {
      res.status(400).json({ erro: error.message });
    }
  },

  //  Listar pedidos para o Admin (ATUALIZADO: Traz todas as imagens)
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
                  imagem_2: true, //  Adicionado para consistência
                  imagem_3: true,  //  Adicionado para consistência
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

  //  ROBÔ: Devolver Estoque (Mantido)
  cancelarPedidosExpirados: async () => {
    const tempoLimite = new Date(Date.now() - 30 * 60 * 1000); // 30 minutos

    try {
      const pedidosExpirados = await prisma.pedidos.findMany({
        where: {
          status: "Pendente",
          criado_em: { lt: tempoLimite }
        },
        include: { itens_pedido: true }
      });

      for (const pedido of pedidosExpirados) {
        await prisma.$transaction(async (tx) => {
          for (const item of pedido.itens_pedido) {
            const variacao = await tx.estoque.findFirst({
              where: { 
                produto_id: item.produto_id, 
                tamanho: item.tamanho_escolhido 
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
      console.error("Erro ao processar expiração:", error);
    }
  },

  //  Atualizar Status (Admin)
  atualizarStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body; 

      const pedidoAtualizado = await prisma.pedidos.update({
        where: { id: parseInt(id) },
        data: { 
          status,
          atualizado_em: new Date() //  Atualiza a data de modificação
        }
      });

      res.json(pedidoAtualizado);
    } catch (error) {
      res.status(500).json({ erro: "Erro ao atualizar status" });
    }
  },

  //  Resumo Dashboard (ATUALIZADO: Soma total dos pedidos Pagos)
  dashboardResumo: async (req, res) => {
    try {
      //  Faturamento Total (Apenas o que foi pago)
      const resumoPago = await prisma.pedidos.aggregate({
        where: { status: "Pago" },
        _sum: { total_geral: true },
        _count: { id: true }
      });

      //  Pedidos Pendentes (Para o Admin saber o que tem pra faturar)
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