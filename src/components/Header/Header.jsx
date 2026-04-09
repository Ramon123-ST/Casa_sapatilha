import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { useCart } from "../context/CartContext";
import styles from "./Header.module.css";

export default function Header({ abrirCarrinho, aoBuscar }) {
  const [menuAberto, setMenuAberto] = useState(false);
  const { carrinho } = useCart(); // 2. Pega os dados do carrinho
  const navegar = useNavigate();

  // Calcula a quantidade total de itens no carrinho
  const totalItens = carrinho.reduce((sum, item) => sum + item.quantidade, 0);

  const scrollToSection = (e, id) => {
    if (e) e.preventDefault();
    
    // Se estivermos em outra página (ex: Detalhes), primeiro volta pra Home
    if (window.location.pathname !== "/") {
      navegar("/");
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        const offset = -20; 
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }
    setMenuAberto(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.contenedor_cmc}>
        {/* Logotipo agora é um Link para a Home */}
        <Link to="/" className={styles.logotipo}>Casa da Sapatilha</Link>

        <input
          type="text"
          className={styles.busca}
          placeholder="Estou buscando..."
          aria-label="Buscar produtos"
          onChange={(e) => {
            const valor = e.target.value;
            if (aoBuscar) aoBuscar(valor); 

            if (valor.length >= 2 && window.location.pathname === "/") {
              scrollToSection(null, "tendencias"); 
            }
          }}
        />

        {/* Botão de Carrinho agora usa o totalItens do Contexto */}
        <button
          className={styles.butao_carr}
          onClick={abrirCarrinho}
          title="Abrir carrinho"
        >
          <span className={styles.cart_count}>{totalItens}</span>
        </button>

        <button
          className={styles.menu_mobile}
          onClick={() => setMenuAberto(!menuAberto)}
        >
          ☰
        </button>
      </div>

      <nav className={styles.navegacao}>
        <ul className={menuAberto ? styles.menu_aberto : ""}>
          <li>
            <Link to="/#promocoes" onClick={(e) => scrollToSection(e, "promocoes")}>
              Promoções
            </Link>
          </li>
          <li>
            <Link to="/#mais-vendidos" onClick={(e) => scrollToSection(e, "tendencias")}>
              Mais vendidos
            </Link>
          </li>
          <li>
            <Link to="/#produtos" onClick={(e) => scrollToSection(e, "produtos")}>
              Produtos
            </Link>
          </li>
        </ul>
      </nav>

      <div className={styles.promo_topo}>
        <div className={styles.contenedor}>
          <div className={styles.promo_esquerda}>
            <div className={styles.texto_completo_animado}>
              LEVE UMA BOLSA E PAGUE 3* <br /> —Nas compras a partir de R$299,90 VOCÊ TEM DESCONTO DE ATÉ 30% OFF
            </div>
          </div>

          <Link
            to="/#comprar"
            className={styles.botao}
            onClick={(e) => scrollToSection(e, "tendencias")}
          >
            Comprar agora
          </Link>
        </div>
      </div>
    </header>
  );
}