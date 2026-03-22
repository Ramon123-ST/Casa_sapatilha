const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const pedidoController = {
  // 🚀 PONTO 6 e 2: Criar Pedido e Baixar Estoque (Reserva)
  criar: async (req, res) => {
    try {
      const { usuario_id, itens, valor_frete, total_geral } = req.body;

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

      res.status(201).json({ mensagem: "Pedido realizado! Estoque reservado por 30 min.", pedido: resultado });
    } catch (error) {
      res.status(400).json({ erro: error.message });
    }
  },

  // 📝 NOVO: Listar todos os pedidos (Para o GestaoPedidos.jsx)
  listarTodos: async (req, res) => {
    try {
      const pedidos = await prisma.pedidos.findMany({
        include: {
          usuario: {
            select: { nome: true, email: true } // Pega só o necessário do cliente
          },
          itens_pedido: {
            include: {
              produto: {
                select: { nome: true, imagem: true } // Traz nome e foto da sapatilha
              }
            }
          }
        },
        orderBy: { criado_em: 'desc' } // Os mais recentes no topo
      });
      res.json(pedidos);
    } catch (error) {
      res.status(500).json({ erro: "Erro ao buscar lista de pedidos." });
    }
  },

  // 🤖 FUNÇÃO DO ROBÔ: PONTO 2 e 11 (Devolver Estoque Expirado)
  cancelarPedidosExpirados: async () => {
    const tempoLimite = new Date(Date.now() - 30 * 60 * 1000);

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
            await tx.estoque.updateMany({
              where: {
                produto_id: item.produto_id,
                tamanho: item.tamanho_escolhido
              },
              data: {
                quantidade: { increment: item.quantidade }
              }
            });
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

  // 🥈 PONTO 18: Mudar Status (Admin)
  atualizarStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { novoStatus } = req.body;

      const pedidoAtualizado = await prisma.pedidos.update({
        where: { id: parseInt(id) },
        data: { status: novoStatus }
      });

      res.json(pedidoAtualizado);
    } catch (error) {
      res.status(500).json({ erro: "Erro ao atualizar status" });
    }
  },

  // 🥉 PONTO 8: Resumo Dashboard
  dashboardResumo: async (req, res) => {
    try {
      const faturamento = await prisma.pedidos.aggregate({
        where: { status: "Pago" },
        _sum: { total_geral: true },
        _count: { id: true }
      });

      res.json({
        totalVendas: faturamento._count.id,
        faturamentoTotal: faturamento._sum.total_geral || 0
      });
    } catch (error) {
      res.status(500).json({ erro: "Erro ao gerar dashboard" });
    }
  }
};

module.exports = pedidoController;