import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom"; 

// 1. O caminho agora entra na pasta 'components' antes de chegar em 'context'
import { CartProvider } from "./components/context/CartContext"; 

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* 2. O Provider envolve o App para o carrinho ser global */}
      <CartProvider>
        <App />
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>
);