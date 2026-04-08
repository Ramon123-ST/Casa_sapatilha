import React from "react";
import styles from "./Admin.module.css";

export default function Admin() {
  return (
    <div className={styles.dashboard_container}>
      <h2>📊 Bem-vindo ao Painel, Ramon!</h2>
      
      <div className={styles.cards_resumo}>
        <div className={styles.card}>
          <h3>Produtos</h3>
          <p>24 sapatilhas cadastradas</p>
        </div>
        <div className={styles.card}>
          <h3>Pedidos de Hoje</h3>
          <p>12 novos pedidos</p>
        </div>
        <div className={styles.card}>
          <h3>Estoque Baixo</h3>
          <p>3 itens precisam de reposição</p>
        </div>
      </div>
    </div>
  );
}