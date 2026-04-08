import React, { useEffect, useState } from "react";
import styles from "./GestaoPedidos.module.css";

export default function GestaoPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [filtro, setFiltro] = useState("Pago");
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);

  // 1. CARREGAR PEDIDOS DO BACK-END
  const carregarPedidos = async () => {
    try {
      const resposta = await fetch("http://localhost:3000/pedidos");
      const dados = await resposta.json();
      setPedidos(Array.isArray(dados) ? dados : []);
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
    }
  };

  useEffect(() => {
    carregarPedidos();
  }, []);

  // 2. ATUALIZAR STATUS (PAGO -> ENVIADO)
  const mudarStatus = async (id, novoStatus) => {
    try {
      const resposta = await fetch(`http://localhost:3000/pedidos/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ novoStatus })
      });

      if (resposta.ok) {
        setPedidoSelecionado(null);
        carregarPedidos(); 
      }
    } catch (error) {
      alert("Erro ao atualizar status.");
    }
  };

  // 3. GERAR RELATÓRIO PDF
  const gerarPDF = () => {
    if (!window.jspdf) {
      return alert("Biblioteca de PDF não encontrada no index.html");
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text(`Relatorio de Envios - ${filtro} - Casa da Sapatilha`, 14, 15);
    doc.save(`envios_${filtro.toLowerCase()}.pdf`);
  };

  return (
    <div className={styles.container}>
      {/* CABEÇALHO */}
      <header className={styles.header_gestao}>
        <div className={styles.titulo_pdf}>
           <h1>📦 Fluxo de Expedição</h1>
           <button onClick={gerarPDF} className={styles.btn_pdf}>📄 Baixar PDF</button>
        </div>
        <p>Gerencie a separação e o envio dos produtos vendidos.</p>
      </header>
      
      {/* BOTÕES DE FILTRO */}
      <div className={styles.filtros}>
        <button className={filtro === "Pago" ? styles.active : ""} onClick={() => setFiltro("Pago")}>
          <span className={styles.badge}>{pedidos.filter(p => p.status === "Pago").length}</span>
          💰 Pagos
        </button>
        <button className={filtro === "Enviado" ? styles.active : ""} onClick={() => setFiltro("Enviado")}>
           <span className={styles.badge}>{pedidos.filter(p => p.status === "Enviado").length}</span>
           🚚 Enviados
        </button>
      </div>

      {/* TABELA PRINCIPAL */}
      <div className={styles.tabela_wrapper}>
        <table className={styles.tabela}>
          <thead>
            <tr>
              <th>PEDIDO / CLIENTE</th>
              <th>ENDEREÇO DE ENTREGA</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.filter(p => p.status === filtro).map((pedido) => (
              <tr key={pedido.id} onClick={() => setPedidoSelecionado(pedido)} className={styles.linha_clicavel}>
                <td className={styles.col_pedido_nome}>
                  <strong>#{pedido.id}</strong>
                  <span>{pedido.usuario?.nome || "Cliente não identificado"}</span>
                </td>
                <td className={styles.col_endereco_simples}>
                  <p>{pedido.rua}, {pedido.numero}</p>
                  <span>{pedido.bairro}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* GAVETA LATERAL (DRAWER) */}
      {pedidoSelecionado && (
        <div className={styles.modal_overlay} onClick={() => setPedidoSelecionado(null)}>
          <div className={styles.detalhes_drawer} onClick={(e) => e.stopPropagation()}>
            
            <div className={styles.drawer_header}>
              <button onClick={() => setPedidoSelecionado(null)}>✕ Fechar</button>
              <h2>Pedido #{pedidoSelecionado.id}</h2>
              
              {pedidoSelecionado.status === "Pago" && (
                <button className={styles.btn_enviar_topo} onClick={() => mudarStatus(pedidoSelecionado.id, "Enviado")}>
                  🚀 MARCAR COMO ENVIADO
                </button>
              )}
            </div>

            <div className={styles.drawer_corpo}>
              {/* TABELA CLIENTE COM TELEFONE */}
              <section className={styles.info_sessao}>
                <h3>👤 Informações do Cliente</h3>
                <table className={styles.tabela_detalhes}>
                  <tbody>
                    <tr>
                      <td><strong>Nome:</strong></td>
                      <td>{pedidoSelecionado.usuario?.nome || "N/A"}</td>
                    </tr>
                    <tr>
                      <td><strong>Gmail:</strong></td>
                      <td>{pedidoSelecionado.usuario?.email || "N/A"}</td>
                    </tr>
                    <tr>
                      <td><strong>Telefone:</strong></td>
                      <td>{pedidoSelecionado.usuario?.telefone || "Não cadastrado"}</td>
                    </tr>
                  </tbody>
                </table>
              </section>

              {/* TABELA ENDEREÇO */}
              <section className={styles.info_sessao}>
                <h3>📍 Endereço de Entrega</h3>
                <table className={styles.tabela_detalhes}>
                  <tbody>
                    <tr>
                      <td><strong>Rua/Nº:</strong></td>
                      <td>{pedidoSelecionado.rua}, {pedidoSelecionado.numero}</td>
                    </tr>
                    <tr>
                      <td><strong>Bairro:</strong></td>
                      <td>{pedidoSelecionado.bairro}</td>
                    </tr>
                    <tr>
                      <td><strong>CEP:</strong></td>
                      <td>{pedidoSelecionado.cep}</td>
                    </tr>
                  </tbody>
                </table>
              </section>

              {/* TABELA PRODUTOS */}
              <section className={styles.info_sessao}>
                <h3>👟 Itens no Pedido</h3>
                <table className={styles.tabela_produtos_detalhe}>
                  <thead>
                    <tr>
                      <th>Modelo</th>
                      <th>Cor</th>
                      <th>Tam</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedidoSelecionado.itens_pedido?.map((item) => (
                      <tr key={item.id}>
                        <td>{item.produto?.nome}</td>
                        <td>{item.produto?.cor}</td>
                        <td><strong>{item.tamanho_escolhido}</strong></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
              
              <div className={styles.total_drawer}>
                Total Pago: <strong>R$ {pedidoSelecionado.total_geral}</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}