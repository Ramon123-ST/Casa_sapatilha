import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom"; 

// ✅ Agora o caminho é direto, pois a pasta 'context' está na raiz da 'src'
import { CartProvider } from "../context/CartContext"; 

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* O Provider envolve o App para o carrinho ser global */}
      <CartProvider>
        <App />
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>
);