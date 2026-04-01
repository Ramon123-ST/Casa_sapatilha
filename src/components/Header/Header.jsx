import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { useCart } from "../../Context/CartContext"; 
import { useAuth } from "../../Context/AuthContext"; 
import styles from "./Header.module.css";

export default function Header({ abrirCarrinho, abrirCadastro, aoBuscar }) {
  const [menuAberto, setMenuAberto] = useState(false);
  const [termoBusca, setTermoBusca] = useState(""); 
  const { quantidadeTotal } = useCart(); 
  const { usuario, logado, logout } = useAuth(); 
  const navegar = useNavigate();

  const dispararBusca = () => {
    if (aoBuscar) aoBuscar(termoBusca);
    if (termoBusca.length >= 2 && window.location.pathname === "/") {
      scrollToSection(null, "promocoes");
    }
  };

  const gerenciarTecla = (e) => {
    if (e.key === "Enter") {
      dispararBusca();
    }
  };

  const scrollToSection = (e, id) => {
    if (e) e.preventDefault();
    
    setMenuAberto(false);

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
  };

  return (
    <header className={styles.header}>
      <div className={styles.contenedor_cmc}>
        <Link to="/" className={styles.logotipo}>Casa da Sapatilha</Link>

        {/* Barra de Busca */}
        <div className={styles.busca_container}>
          <input
            type="text"
            className={styles.busca}
            placeholder="Estou buscando..."
            aria-label="Buscar produtos"
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            onKeyDown={gerenciarTecla} 
          />
          <img 
            src="/img/loupe.png" 
            alt="Lupa" 
            className={styles.icone_lupa_clicavel} 
            onClick={dispararBusca} 
          />
        </div>

        <div className={styles.acoes_usuario}>
          {logado ? (
            <div className={styles.perfil_logado}>
              <img 
                src="/img/user.png" 
                alt="Perfil" 
                className={styles.user_icon_logado} 
                onClick={logout} 
                title={`Logado como: ${usuario?.nome}. Clique para sair.`} 
              />
            </div>
          ) : (
            <button 
              className={styles.btn_login} 
              onClick={abrirCadastro}
            >
              Entrar
            </button>
          )}

          <button
            className={styles.butao_carr}
            onClick={abrirCarrinho}
          >
            <div className={styles.cart_wrapper}>
              <img src="/img/cart.png" alt="Carrinho" className={styles.cart_icon} />
              {quantidadeTotal > 0 && (
                <span className={styles.cart_count}>{quantidadeTotal}</span>
              )}
            </div>
          </button>

          {/* Botão Hambúrguer Atualizado com a sua imagem */}
          <button
            className={styles.menu_mobile_btn}
            onClick={() => setMenuAberto(!menuAberto)}
            aria-label="Menu"
          >
            {menuAberto ? (
              <span className={styles.icone_fechar}>✕</span>
            ) : (
              <img 
                src="/img/menu-burger.png" 
                alt="Menu" 
                className={styles.hamburguer_img}
              />
            )}
          </button>
        </div>
      </div>

      <nav className={`${styles.navegacao} ${menuAberto ? styles.menu_aberto : ""}`}>
        <ul>
          <li>
            <Link to="/#promocoes" onClick={(e) => scrollToSection(e, "promocoes")}>
              Promoções
            </Link>
          </li>
          <li>
            <Link to="/#mais-vendidos" onClick={(e) => scrollToSection(e, "mais-vendidos")}>
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
            onClick={(e) => scrollToSection(e, "promocoes")}
          >
            Comprar agora
          </Link>
        </div>
      </div>
    </header>
  );
}