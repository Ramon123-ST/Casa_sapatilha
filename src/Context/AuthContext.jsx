import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  // Verifica se existe um usuário salvo no navegador ao abrir o site
  useEffect(() => {
    const usuarioSalvo = localStorage.getItem("@CasaDaSapatilha:user");
    if (usuarioSalvo) {
      setUsuario(JSON.parse(usuarioSalvo));
    }
    setCarregando(false);
  }, []);

  // Função para Logar
  const login = (dadosUsuario) => {
    setUsuario(dadosUsuario);
    localStorage.setItem("@CasaDaSapatilha:user", JSON.stringify(dadosUsuario));
  };

  // Função para Sair (Logout)
  const logout = () => {
    setUsuario(null);
    localStorage.removeItem("@CasaDaSapatilha:user");
  };

  return (
    <AuthContext.Provider value={{ 
      usuario, 
      logado: !!usuario, 
      login, 
      logout, 
      carregando 
    }}>
      {!carregando && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);