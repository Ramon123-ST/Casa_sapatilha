import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import Achadinho from "./components/Achadinho/Achadinho";
import Produtos from "./components/Produtos/Produtos";
import MaisProdutos from "./components/MaisProdutos/MaisProdutos";
import Footer from "./components/Footer/Footer";
import DetalhesProduto from "./components/DetalhesProduto/DetalhesProduto"; 
import Carrinho from "./components/Carrinho/Carrinho"; 
import Cadastro from "./components/Cadastro/Cadastro"; 

// IMPORTS DE ADMINISTRAÇÃO (PASTA ADMIN)
import AdminLayout from "./components/Admin/AdminLayout"; 
import Dashboard from "./components/Admin/Dashboard"; // Agora é sua página principal de métricas
import GestaoPedidos from "./components/Admin/GestaoPedidos";
import CadastroProduto from "./components/Admin/CadastroProduto";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  const [cadastroAberto, setCadastroAberto] = useState(false); 
  const [termoBusca, setTermoBusca] = useState("");
  
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith("/admin");

  const abrirCarrinho = () => setCarrinhoAberto(true);
  const abrirCadastro = () => setCadastroAberto(true); 

  return (
    <>
      <ScrollToTop /> 

      {!isAdminPath && (
        <>
          <Header 
            abrirCarrinho={abrirCarrinho} 
            abrirCadastro={abrirCadastro} 
            aoBusca={setTermoBusca} 
          />
          <Carrinho aberto={carrinhoAberto} setAberto={setCarrinhoAberto} />
          <Cadastro aberto={cadastroAberto} setAberto={setCadastroAberto} />
        </>
      )}

      {/* 2. Container Principal */}
      <main style={{ 
        minHeight: '100vh', 
        backgroundColor: isAdminPath ? '#f4f7fe' : 'transparent', // Cor de fundo profissional do Dashboard
        display: 'flex',
        flexDirection: 'column'
      }}> 
        <Routes>
          {/* --- ROTAS PÚBLICAS (CLIENTE) --- */}
          <Route path="/" element={
            <div className="home-container">
              <section id="hero"><Hero /></section>
              <section id="promocoes"><Achadinho termoBusca={termoBusca} /></section>
              <section id="mais-vendidos"><Produtos termoBusca={termoBusca} /></section>
              <section id="produtos"><MaisProdutos termoBusca={termoBusca} /></section>
            </div>
          } />
          
          <Route path="/produto/:id" element={<DetalhesProduto />} />
          
          {/* --- ROTAS PRIVADAS (ADMINISTRAÇÃO) --- */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            
            <Route path="dashboard" element={<Dashboard />} />
            
            <Route path="pedidos" element={<GestaoPedidos />} />
            
            <Route path="cadastrar" element={<CadastroProduto />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!isAdminPath && <Footer />}
    </>
  );
}