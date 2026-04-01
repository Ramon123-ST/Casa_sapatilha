import React, { useEffect, useState } from "react";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const [resumo, setResumo] = useState({ totalVendas: 0, faturamentoTotal: 0 });
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const buscarDados = async () => {
      try {
        const resposta = await fetch("http://localhost:3000/admin/dashboard");
        const dados = await resposta.json();
        setResumo(dados);
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
      } finally {
        setCarregando(false);
      }
    };

    buscarDados();
  }, []);

  if (carregando) return <p className={styles.loading}>Carregando métricas...</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.titulo}>Resumo de Vendas 📈</h1>
      
      <div className={styles.grid}>
        {/* Card de Faturamento */}
        <div className={`${styles.card} ${styles.faturamento}`}>
          <h3>Faturamento Total</h3>
          <p className={styles.valor}>
            {Number(resumo.faturamentoTotal).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>
          <span>Apenas pedidos com status "Pago"</span>
        </div>

        {/* Card de Volume de Vendas */}
        <div className={`${styles.card} ${styles.vendas}`}>
          <h3>Total de Pedidos</h3>
          <p className={styles.valor}>{resumo.totalVendas}</p>
          <span>Conversões realizadas</span>
        </div>

        {/* Card de Ticket Médio (Cálculo em tempo real) */}
        <div className={`${styles.card} ${styles.ticket}`}>
          <h3>Ticket Médio</h3>
          <p className={styles.valor}>
            {resumo.totalVendas > 0 
              ? (resumo.faturamentoTotal / resumo.totalVendas).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })
              : "R$ 0,00"}
          </p>
          <span>Média por cliente</span>
        </div>
      </div>

      <div className={styles.info_extra}>
        <p>💡 Dica: Verifique a <strong>Gestão de Pedidos</strong> para confirmar pagamentos pendentes e atualizar esses números.</p>
      </div>
    </div>
  );
}