import React, { useState } from "react";
import styles from "./Cadastro.module.css";
// ✅ IMPORTAR O HOOK DE AUTENTICAÇÃO
import { useAuth } from "../../Context/AuthContext"; 

export default function Cadastro({ aberto, setAberto }) {
  const { login } = useAuth(); // ✅ PEGAR A FUNÇÃO LOGIN DO CONTEXTO
  const [modo, setModo] = useState("cadastro"); 
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    telefone: ""
  });

  if (!aberto) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Ajustei para bater com o usuarioController que criamos: /usuarios ou /login
    const rota = modo === "cadastro" ? "usuarios" : "login";

    try {
      const response = await fetch(`http://localhost:3000/${rota}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json(); // ✅ PEGAR A RESPOSTA DO BACKEND

      if (response.ok) {
        // ✅ AVISAR O SITE QUE O USUÁRIO ESTÁ LOGADO
        // O backend retorna { usuario: {...} } no login e o objeto direto no cadastro
        const usuarioLogado = data.usuario || data;
        login(usuarioLogado); 

        alert(modo === "cadastro" ? "Conta criada! 👟" : `Bem-vindo, ${usuarioLogado.nome}! 👋`);
        setAberto(false); 
      } else {
        alert(data.erro || "Erro. Verifique os dados inseridos.");
      }
    } catch (error) {
      alert("Erro ao conectar com o servidor.");
    }
  };

  // Função para limpar os campos ao trocar de modo
  const trocarModo = (novoModo) => {
    setModo(novoModo);
    setFormData({ nome: "", email: "", senha: "", telefone: "" });
  };

  return (
    <div className={styles.overlay} onClick={() => setAberto(false)}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.btn_fechar} onClick={() => setAberto(false)}>&times;</button>
        
        <h2>{modo === "cadastro" ? "Criar Conta" : "Fazer Login"}</h2>
        <p>
          {modo === "cadastro" 
            ? "Cadastre-se para aproveitar as ofertas." 
            : "Entre com seus dados para continuar."}
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
            {modo === "cadastro" ? "Finalizar Cadastro" : "Entrar"}
          </button>
        </form>

        <div className={styles.switch}>
          {modo === "cadastro" ? (
            <p>Já tem uma conta? <button onClick={() => trocarModo("login")}>Fazer Login</button></p>
          ) : (
            <p>Novo por aqui? <button onClick={() => trocarModo("cadastro")}>Criar uma conta</button></p>
          )}
        </div>
      </div>
    </div>
  );
}