import React, { useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom"; // Adicionei Navigate
import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import Achadinho from "./components/Achadinho/Achadinho";
import Produtos from "./components/Produtos/Produtos";
import MaisProdutos from "./components/MaisProdutos/MaisProdutos";
import Footer from "./components/Footer/Footer";
import DetalhesProduto from "./components/DetalhesProduto/DetalhesProduto"; 
import Carrinho from "./components/Carrinho/Carrinho"; 
import Cadastro from "./components/Cadastro/Cadastro"; 

//  IMPORTS DE ADMINISTRAÇÃO
import AdminLayout from "./components/Admin/AdminLayout"; 
import Dashboard from "./components/Admin/Dashboard";
import GestaoPedidos from "./components/Admin/GestaoPedidos";
import CadastroProduto from "./components/Admin/CadastroProduto";

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
      {/*  Elementos de Loja (Só aparecem fora do Admin) */}
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

      {/*  Ajuste no Main para remover espaços no Admin */}
      <main style={{ 
        minHeight: isAdminPath ? '100vh' : '60vh',
        marginTop: isAdminPath ? '0' : 'inherit' // Garante que não herde margens do header da loja
      }}> 
        <Routes>
          {/*  ROTAS DA LOJA CLIENTE */}
          <Route path="/" element={
            <>
              <section id="hero"><Hero /></section>
              <section id="promocoes"><Achadinho termoBusca={termoBusca} /></section>
              <section id="mais-vendidos"><Produtos termoBusca={termoBusca} /></section>
              <section id="produtos"><MaisProdutos termoBusca={termoBusca} /></section>
            </>
          } />
          <Route path="/produto/:id" element={<DetalhesProduto />} />
          
          {/*  PAINEL ADMINISTRATIVO */}
          <Route path="/admin" element={<AdminLayout />}>
            {/*  Redireciona /admin direto para /admin/dashboard */}
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="pedidos" element={<GestaoPedidos />} />
            <Route path="cadastrar" element={<CadastroProduto />} />
          </Route>
        </Routes>
      </main>

      {!isAdminPath && <Footer />}
    </>
  );
}