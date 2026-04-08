import React, { useState, useEffect } from "react";
import styles from "./Cadastro.module.css";
import { useAuth } from "../../Context/AuthContext"; 

export default function Cadastro({ aberto, setAberto }) {
  const { login, usuario } = useAuth(); 
  
  // --- LÓGICA DE MEMÓRIA DE VISITA ---
  // Verifica se o navegador já tem a marca de que o usuário já visitou o site antes
  const jaVisitou = localStorage.getItem("jaVisitou");
  
  // Se já visitou, começa no Login. Se é a 1ª vez, começa no Cadastro.
  const [modo, setModo] = useState(jaVisitou ? "login" : "cadastro"); 

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    telefone: ""
  });

  useEffect(() => {
    // 1. Marca que o usuário já visitou o site para a próxima vez
    localStorage.setItem("jaVisitou", "true");

    // 2. Lógica de abertura automática para quem não está logado
    const jaFechouAgora = sessionStorage.getItem("modalFechado");

    if (!usuario && !jaFechouAgora) {
      const timer = setTimeout(() => {
        setAberto(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [usuario, setAberto]);

  const fecharModalManual = () => {
    setAberto(false);
    sessionStorage.setItem("modalFechado", "true");
  };

  if (!aberto || usuario) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const rota = modo === "cadastro" ? "usuarios" : "login";

    try {
      const response = await fetch(`http://localhost:3000/${rota}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        const usuarioLogado = data.usuario || data;
        login(usuarioLogado); 
        setAberto(false); 
      } else {
        alert(data.erro || "Erro. Verifique os dados inseridos.");
      }
    } catch (error) {
      alert("Erro ao conectar com o servidor.");
    }
  };

  const trocarModo = (novoModo) => {
    setModo(novoModo);
    setFormData({ nome: "", email: "", senha: "", telefone: "" });
  };

  return (
    <div className={styles.overlay} onClick={fecharModalManual}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        
        <button className={styles.btn_fechar} onClick={fecharModalManual}>&times;</button>
        
        <h2>{modo === "cadastro" ? "Criar minha Conta" : "Bem-vindo de volta!"}</h2>
        <p className={styles.subtitulo}>
          {modo === "cadastro" 
            ? "Crie sua conta para garantir as melhores sapatilhas." 
            : "Acesse sua conta para ver seus pedidos."}
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {modo === "cadastro" && (
            <input 
              type="text" 
              placeholder="Nome Completo" 
              value={formData.nome}
              onChange={(e) => setFormData({...formData, nome: e.target.value})} 
              required 
            />
          )}

          <input 
            type="email" 
            placeholder="E-mail" 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})} 
            required 
          />

          <input 
            type="password" 
            placeholder="Senha" 
            value={formData.senha}
            onChange={(e) => setFormData({...formData, senha: e.target.value})} 
            required 
          />

          {modo === "cadastro" && (
            <input 
              type="text" 
              placeholder="Telefone" 
              value={formData.telefone}
              onChange={(e) => setFormData({...formData, telefone: e.target.value})} 
            />
          )}
          
          <button type="submit" className={styles.btn_enviar}>
            {modo === "cadastro" ? "Finalizar Cadastro 👟" : "Entrar na Conta"}
          </button>
        </form>

        <div className={styles.switch}>
          {modo === "cadastro" ? (
            <p>Já tem uma conta? <button type="button" onClick={() => trocarModo("login")}>Fazer Login</button></p>
          ) : (
            <p>Novo por aqui? <button type="button" onClick={() => trocarModo("cadastro")}>Criar uma conta</button></p>
          )}
        </div>
        
        <button className={styles.btn_continuar_navegando} onClick={fecharModalManual}>
          Continuar navegando sem logar
        </button>
      </div>
    </div>
  );
}