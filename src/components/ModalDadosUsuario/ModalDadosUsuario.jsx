import React from "react";
import styles from "./ModalDadosUsuario.module.css";

export default function ModalDadosUsuario({ usuario, onClose, onLogout }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.btn_fechar} onClick={onClose}>✕</button>
        
        <div className={styles.cabecalho}>
          <div className={styles.user_info_topo}>
            <div className={styles.avatar_placeholder}>
              <img src="/img/user.png" alt="User" />
            </div>
            <div>
              <h3>Olá, {usuario?.nome}</h3>
              <p>{usuario?.email}</p>
            </div>
          </div>
          <button className={styles.btn_logout} onClick={onLogout}>Sair da conta</button>
        </div>

        <nav className={styles.abas}>
          <button className={styles.aba_ativa}>Dados e preferências</button>
        </nav>

        <form className={styles.formulario}>
          <div className={styles.grid}>
            <div className={styles.campo}>
              <label>Nome*</label>
              <input type="text" defaultValue={usuario?.nome?.split(' ')[0]} />
            </div>
            <div className={styles.campo}>
              <label>Sobrenome*</label>
              <input type="text" defaultValue={usuario?.nome?.split(' ').slice(1).join(' ')} />
            </div>
            
            <div className={styles.campo}>
              <label>Celular*</label>
              <input type="text" defaultValue={usuario?.telefone} placeholder="(00) 00000-0000" />
            </div>
            <div className={styles.campo}>
              <label>E-mail</label>
              <input type="email" defaultValue={usuario?.email} disabled />
            </div>
          </div>
          
          <button type="button" className={styles.btn_salvar}>Salvar alterações</button>
        </form>
      </div>
    </div>
  );
}