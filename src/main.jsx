import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom"; 
import { CartProvider } from "./Context/CartContext"; 
import { AuthProvider } from "./Context/AuthContext"; 

const baseName = import.meta.env.DEV ? "/" : "/Casa_sapatilha";

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