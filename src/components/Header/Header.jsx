import React from "react";
import styles from "./Header.module.css";

export default function Header({ carrinhoCount = 0, abrirCarrinho }) {
  return (
    <header className={styles.header}>

     
      <div className={styles.contenedor_cmc}>
        <div className={styles.logotipo}>Casa da Sapatilha</div>

        <input
          type="text"
          className={styles.busca}
          placeholder="Estou buscando..."
          aria-label="Buscar produtos"
        />

        <button
          className={styles.butao_carr}
          onClick={abrirCarrinho}
          title="Abrir carrinho"
        >
          <span className={styles.cart_count}>{carrinhoCount}</span>
        </button>
      </div>

      
      <nav className={styles.navegacao}>
        <ul>
          <li><a href="#promocoes">Promoções</a></li>
          <li><a href="#mais-vendidos">Mais vendidos</a></li>
          <li><a href="#produtos">Produtos</a></li>
        </ul>
      </nav>

 
      <div className={styles.promo_topo}>
        <div className={styles.contenedor}>
          <div className={styles.promo_esquerda}>
            <div className={styles.texto_completo_animado}>
              LEVE UMA BOLSA E PAGUE 3* <br/> —Nas compras a partir de R$ 299,90 VOCÊ TEM DESCONTO DE ATÉ 30% OFF 
            </div>
          </div>
          <a href="#comprar" className={styles.botao}>
            Comprar agora
          </a>
        </div>
      </div>

    </header>
  );
}



