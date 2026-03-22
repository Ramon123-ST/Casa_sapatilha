import React, { useEffect, useState } from "react";
import styles from "./GestaoPedidos.module.css";

export default function GestaoPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [filtro, setFiltro] = useState("Pendente");

  // Busca os pedidos do Back-end
  const carregarPedidos = async () => {
    try {
      const resposta = await fetch("http://localhost:3000/pedidos"); // Você precisará criar essa rota GET no backend
      const dados = await resposta.json();
      setPedidos(dados);
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
    }
  };

  useEffect(() => {
    carregarPedidos();
  }, []);

  // 🚀 FUNÇÃO PARA MUDAR STATUS (PONTO 18)
  const mudarStatus = async (id, novoStatus) => {
    try {
      const resposta = await fetch(`http://localhost:3000/pedidos/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ novoStatus })
      });

      if (resposta.ok) {
        alert(`Pedido atualizado para: ${novoStatus}`);
        carregarPedidos(); // Recarrega a lista
      }
    } catch (error) {
      alert("Erro ao atualizar status.");
    }
  };

  return (
    <div className={styles.container}>
      <h1>📦 Gestão de Pedidos</h1>
      
      <div className={styles.filtros}>
        <button onClick={() => setFiltro("Pendente")}>Pendentes</button>
        <button onClick={() => setFiltro("Pago")}>Pagos</button>
        <button onClick={() => setFiltro("Enviado")}>Enviados</button>
      </div>

      <table className={styles.tabela}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Itens (Tam)</th>
            <th>Total</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.filter(p => p.status === filtro).map((pedido) => (
            <tr key={pedido.id}>
              <td>#{pedido.id}</td>
              <td>{pedido.usuario?.nome || "Cliente Local"}</td>
              <td>
                {pedido.itens_pedido.map(item => (
                  <div key={item.id}>
                    {item.produto?.nome} (Tam: {item.tamanho_escolhido})
                  </div>
                ))}
              </td>
              <td>R$ {pedido.total_geral}</td>
              <td className={styles[pedido.status.toLowerCase()]}>{pedido.status}</td>
              <td>
                {pedido.status === "Pendente" && (
                  <button className={styles.btn_pago} onClick={() => mudarStatus(pedido.id, "Pago")}>
                    Confirmar Pagamento
                  </button>
                )}
                {pedido.status === "Pago" && (
                  <button className={styles.btn_enviar} onClick={() => mudarStatus(pedido.id, "Enviado")}>
                    Marcar como Enviado
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}