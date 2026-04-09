import React from "react";
// ✅ Caminho corrigido para quem está dentro de components/Carrinho
import { useCart } from "../context/CartContext"; 
import styles from "./Carrinho.module.css";

export default function Carrinho({ aberto, setAberto }) {
  const { carrinho, removerDoCarrinho } = useCart();

  // Calcula o valor total do carrinho
  const total = carrinho.reduce((acc, item) => acc + (Number(item.preco) * item.quantidade), 0);

  if (!aberto) return null;

  return (
    <div className={styles.overlay} onClick={() => setAberto(false)}>
      <aside className={styles.carrinho_container} onClick={(e) => e.stopPropagation()}>
        <div className={styles.topo}>
          <h2>Minha Sacola</h2>
          <button className={styles.btn_fechar} onClick={() => setAberto(false)}>&times;</button>
        </div>

        <div className={styles.itens}>
          {carrinho.length === 0 ? (
            <p className={styles.vazio}>Sua sacola está vazia :(</p>
          ) : (
            carrinho.map((item) => (
              <div key={`${item.id}-${item.tamanho}`} className={styles.item_card}>
                <img src={item.imagem} alt={item.nome} />
                <div className={styles.item_info}>
                  <h3>{item.nome}</h3>
                  <p>Tam: {item.tamanho} | Qtd: {item.quantidade}</p>
                  <span className={styles.preco}>
                    {Number(item.preco).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </span>
                </div>
                <button 
                  className={styles.btn_remover} 
                  onClick={() => removerDoCarrinho(item.id, item.tamanho)}
                >
                  Remover
                </button>
              </div>
            ))
          )}
        </div>

        {carrinho.length > 0 && (
          <div className={styles.rodape}>
            <div className={styles.total_container}>
              <span>Total:</span>
              <span className={styles.total_valor}>
                {total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </span>
            </div>
            <button className={styles.btn_finalizar}>Finalizar no WhatsApp</button>
          </div>
        )}
      </aside>
    </div>
  );
}