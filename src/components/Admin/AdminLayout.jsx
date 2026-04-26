import React from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import styles from "./AdminLayout.module.css";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  // Função atualizada para lidar com rotas dinâmicas (como /editar/1)
  const isActive = (path) => location.pathname.startsWith(path) ? styles.active : "";

  return (
    <div id="admin-root" className={styles.admin_container}>
      
      <aside className={styles.sidebar}>
        <div className={styles.logo_section}>
          <div className={styles.logo_icon}>👟</div>
          <div className={styles.logo_text}>
            <h2>Casa da Sapatilha</h2>
            <span>Painel Administrativo</span>
          </div>
        </div>

        <nav className={styles.nav_links}>
          <small className={styles.menu_label}>Principal</small>
          
          <Link to="/admin/dashboard" className={`${styles.link} ${isActive("/admin/dashboard")}`}>
            <span className={styles.icon}>📊</span> Dashboard
          </Link>
          
          <Link to="/admin/pedidos" className={`${styles.link} ${isActive("/admin/pedidos")}`}>
            <span className={styles.icon}>📋</span> Gestão de Pedidos
          </Link>

          {/* NOVO LINK: Gerenciar Estoque (onde fica a sua tabela de produtos) */}
          <Link to="/admin/produtos" className={`${styles.link} ${isActive("/admin/produtos")}`}>
            <span className={styles.icon}>📦</span> Edição/Estoque
          </Link>
          
          <Link to="/admin/cadastrar" className={`${styles.link} ${isActive("/admin/cadastrar")}`}>
            <span className={styles.icon}>✨</span> Cadastrar Produto
          </Link>
          
          <div className={styles.divider}></div>
          <small className={styles.menu_label}>Sistema</small>

          <button 
            className={styles.btn_loja} 
            onClick={() => navigate("/")}
          >
            <span className={styles.icon}>🏠</span> Ir para a Loja
          </button>
        </nav>

        <div className={styles.admin_profile}>
          <div className={styles.avatar}>R</div>
          <div className={styles.profile_info}>
            <p>Ramon</p>
            <span>Administrador</span>
          </div>
        </div>
      </aside>

      <main className={styles.conteudo_principal}>
        <header className={styles.top_bar}>
          <div className={styles.breadcrumb}>
            Admin / <strong>{location.pathname.split("/").pop()}</strong>
          </div>
          <div className={styles.top_actions}>
             <button className={styles.notificacao}>🔔</button>
          </div>
        </header>
        
        <section className={styles.fade_in_content}>
          <Outlet /> 
        </section>
      </main>
    </div>
  );
}