import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import styles from "./AdminLayout.module.css";

export default function AdminLayout() {
  const navigate = useNavigate();

  return (
    /* ADICIONEI A ID AQUI PARA CONTROLAR O INDEX.CSS */
    <div id="admin-root" className={styles.admin_container}>
      
      {/*  MENU LATERAL (SIDEBAR) */}
      <aside className={styles.sidebar}>
        <div className={styles.logo_admin}>
          <h2>Casa da Sapatilha</h2>
          <span>Painel de Controle</span>
        </div>

        <nav className={styles.nav_links}>
          <Link to="/admin/dashboard" className={styles.link}>
            📊 Dashboard
          </Link>
          <Link to="/admin/pedidos" className={styles.link}>
            📦 Gestão de Pedidos
          </Link>
          <Link to="/admin/cadastrar" className={styles.link}>
            ➕ Cadastrar Produto
          </Link>
          
          {/* Botão para voltar à loja */}
          <button 
            className={styles.btn_loja} 
            onClick={() => navigate("/")}
          >
            🏠 Voltar para a Loja
          </button>
        </nav>

        <div className={styles.admin_footer}>
          <p>Logado como: <strong>Ramon</strong></p>
        </div>
      </aside>

      {/*  ÁREA DE CONTEÚDO (Onde aparece o Dashboard/Pedidos) */}
      <main className={styles.conteudo_principal}>
        <Outlet /> 
      </main>
    </div>
  );
}