import React, { useState, useEffect } from "react";
import styles from "./Cadastro.module.css";
import { useAuth } from "../../Context/AuthContext"; 

export default function Cadastro({ aberto, setAberto }) {
  const { login, usuario } = useAuth(); 
  const [modo, setModo] = useState("login"); 
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    telefone: ""
  });

  // --- LÓGICA DO GOOGLE (NATIVA) ---
  useEffect(() => {
    if (aberto && window.google) {
      window.google.accounts.id.initialize({
        client_id: "274377688121-0e2f7ugbt4gbbj7m30norh7s4jj7pri7.apps.googleusercontent.com",
        callback: handleGoogleResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("btnGoogle"),
        { theme: "outline", size: "large", width: "100%", text: "continue_with" }
      );
    }
  }, [aberto, modo]); 

  const handleGoogleResponse = async (response) => {
    try {
      const base64Url = response.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));

      if (modo === "cadastro") {
        setFormData({
          ...formData,
          nome: payload.name,
          email: payload.email,
          senha: "GOOGLE_USER" 
        });
        alert("Dados importados do Google! Confira seu nome e clique em Finalizar.");
      } else {
        const res = await fetch("http://localhost:3000/login-google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            token: response.credential,
            googleId: payload.sub,
            email: payload.email,
            nome: payload.name
          }),
        });
        
        const data = await res.json();
        if (res.ok) {
          login(data.usuario);
          setAberto(false);
        }
      }
    } catch (error) {
      console.error("Erro no login Google:", error);
    }
  };

  // --- LÓGICA DO MODAL ---
  useEffect(() => {
    const jaVisitou = localStorage.getItem("jaVisitou");
    if (!jaVisitou) {
      setModo("cadastro");
      localStorage.setItem("jaVisitou", "true");
    }

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

  const trocarModo = (novoModo) => {
    setModo(novoModo);
    setFormData({ nome: "", email: "", senha: "", telefone: "" });
    setMostrarSenha(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const isGoogleSocial = formData.senha === "GOOGLE_USER";
    const rota = isGoogleSocial ? "login-google" : (modo === "cadastro" ? "usuarios" : "login");

    try {
      const response = await fetch(`http://localhost:3000/${rota}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        login(data.usuario || data); 
        setAberto(false); 
      } else {
        alert(data.erro || "Erro. Verifique os dados inseridos.");
      }
    } catch (error) {
      alert("Erro ao conectar com o servidor.");
    }
  };

  if (!aberto || usuario) return null;

  return (
    <div className={styles.overlay} onClick={fecharModalManual}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        
        <button className={styles.btn_fechar} onClick={fecharModalManual}>&times;</button>
        
        <div className={styles.cabecalho_modal}>
            <h2>{modo === "cadastro" ? "Criar minha Conta" : "Bem-vindo de volta!"}</h2>
            <p className={styles.subtitulo}>
            {modo === "cadastro" 
                ? "Crie sua conta para garantir as melhores sapatilhas." 
                : "Acesse sua conta para ver seus pedidos."}
            </p>
        </div>

        <div className={styles.google_container}>
          <div id="btnGoogle"></div>
        </div>

        <div className={styles.divisor}>
          <span>ou use seu e-mail</span>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {modo === "cadastro" && (
            <input 
              type="text" 
              placeholder="Nome Completo" 
              className={styles.input_padrao}
              value={formData.nome}
              onChange={(e) => setFormData({...formData, nome: e.target.value})} 
              required 
            />
          )}

          <input 
            type="email" 
            placeholder="E-mail" 
            className={styles.input_padrao}
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})} 
            required 
          />

          <div className={styles.senha_wrapper}>
            <input 
              type={mostrarSenha ? "text" : "password"} 
              placeholder="Senha" 
              className={styles.input_padrao}
              value={formData.senha}
              disabled={formData.senha === "GOOGLE_USER"}
              onChange={(e) => setFormData({...formData, senha: e.target.value})} 
              required 
            />
            <button 
              type="button" 
              className={styles.btn_olho} 
              onClick={() => setMostrarSenha(!mostrarSenha)}
            >
              <img 
                src={mostrarSenha ? "/img/aberto.png" : "/img/olhofechado.png"} 
                alt={mostrarSenha ? "Esconder senha" : "Mostrar senha"} 
                className={styles.icone_olho_img}
              />
            </button>
          </div>

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
      </div>
    </div>
  );
}