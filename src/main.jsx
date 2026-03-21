import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom"; 

// Importando os dois Providers
import { CartProvider } from "./Context/CartContext"; 
import { AuthProvider } from "./Context/AuthContext"; // ✅ NOVO

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* Dica de IT: O AuthProvider geralmente fica por fora, 
          pois no futuro você pode querer carregar o carrinho do banco 
          de dados baseado no usuário logado! 
      */}
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);