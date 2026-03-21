import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { useCart } from "../../Context/CartContext"; 
import { useAuth } from "../../Context/AuthContext"; // ✅ NOVO: Importando autenticação
import styles from "./Header.module.css";

export default function Header({ abrirCarrinho, abrirCadastro, aoBuscar }) {
  const [menuAberto, setMenuAberto] = useState(false);
  const { quantidadeTotal } = useCart(); // ✅ Usando a soma total que criamos no Context
  const { usuario, logado, logout } = useAuth(); // ✅ Pegando dados do usuário
  const navegar = useNavigate();

  const scrollToSection = (e, id) => {
    if (e) e.preventDefault();
    
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
              scrollToSection(null, "promocoes"); 
            }
          }}
        />

        <div className={styles.acoes_usuario}>
          {/* ✅ ÁREA DE LOGIN DINÂMICA */}
          {logado ? (
            <div className={styles.perfil_logado}>
              <span className={styles.saudacao}>Olá, {usuario.nome.split(' ')[0]}</span>
              <button onClick={logout} className={styles.btn_sair}>Sair</button>
            </div>
          ) : (
            <button 
              className={styles.btn_login} 
              onClick={abrirCadastro}
              title="Entrar ou Cadastrar"
            >
              Entrar
            </button>
          )}

          <button
            className={styles.butao_carr}
            onClick={abrirCarrinho}
            title="Abrir carrinho"
          >
            <span className={styles.cart_count}>{quantidadeTotal}</span>
          </button>
        </div>

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