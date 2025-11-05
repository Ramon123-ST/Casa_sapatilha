import React from "react";
import { Link } from "react-router-dom"; 
import styles from "./Header.module.css";

export default function Header({ carrinhoCount = 0, abrirCarrinho }) {
  
  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 160; 
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

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
          <li>
            <Link
              to="/#promocoes"
              onClick={(e) => scrollToSection(e, "promocoes")}
            >
              Promoções
            </Link>
          </li>
          <li>
            <Link
              to="/#mais-vendidos"
              onClick={(e) => scrollToSection(e, "mais-vendidos")}
            >
              Mais vendidos
            </Link>
          </li>
          <li>
            <Link
              to="/#produtos"
              onClick={(e) => scrollToSection(e, "produtos")}
            >
              Produtos
            </Link>
          </li>
        </ul>
      </nav>

      <div className={styles.promo_topo}>
        <div className={styles.contenedor}>
          <div className={styles.promo_esquerda}>
            <div className={styles.texto_completo_animado}>
              LEVE UMA BOLSA E PAGUE 3* <br /> —Nas compras a partir de R$
              299,90 VOCÊ TEM DESCONTO DE ATÉ 30% OFF
            </div>
          </div>
          <Link
            to="/#comprar"
            className={styles.botao}
            onClick={(e) => scrollToSection(e, "comprar")}
          >
            Comprar agora
          </Link>
        </div>
      </div>
    </header>
  );
}



