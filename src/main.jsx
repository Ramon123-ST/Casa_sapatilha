import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom"; 
import { CartProvider } from "./Context/CartContext"; 
import { AuthProvider } from "./Context/AuthContext"; 

// Lógica inteligente:
// Se a URL contiver "github.io", usa "/Casa_sapatilha"
// Se for Vercel ou Localhost, usa "/"
const getBasename = () => {
  const hostname = window.location.hostname;
  if (hostname.includes("github.io")) {
    return "/Casa_sapatilha";
  }
  return "/";
};

const baseName = getBasename();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter basename={baseName}>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);