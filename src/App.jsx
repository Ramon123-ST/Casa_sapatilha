import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

// COMPONENTES BASE
import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import Achadinho from "./components/Achadinho/Achadinho";
import Produtos from "./components/Produtos/Produtos";
import MaisProdutos from "./components/MaisProdutos/MaisProdutos";
import Footer from "./components/Footer/Footer";
import DetalhesProduto from "./components/DetalhesProduto/DetalhesProduto"; 
import Carrinho from "./components/Carrinho/Carrinho"; 
import Cadastro from "./components/Cadastro/Cadastro"; 

// IMPORTS DE ADMINISTRAÇÃO
import AdminLayout from "./components/Admin/AdminLayout"; 
import Dashboard from "./components/Admin/Dashboard"; 
import GestaoPedidos from "./components/Admin/GestaoPedidos";
import CadastroProduto from "./components/Admin/CadastroProduto"; 
import GerenciarProdutos from "./components/Admin/GerenciarProdutos"; // Onde fica a tabela de todos os produtos

// --- NOVOS IMPORTS DE PERFIL DO CLIENTE ---
import Pedidos from "./pages/Pedidos";
import Trocas from "./pages/Trocas";
import Enderecos from "./pages/Enderecos";
import Pagamentos from "./pages/Pagamentos";
import ListaDesejos from "./pages/ListaDesejos";

// Função para resetar o scroll ao mudar de página
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

      {/* Interface do Cliente: Só aparece se NÃO estiver no admin */}
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

      <main style={{ 
        minHeight: '100vh', 
        backgroundColor: isAdminPath ? '#0b1437' : 'transparent', 
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

          {/* --- ROTAS DE PERFIL --- */}
          <Route path="/meus-pedidos" element={<Pedidos />} />
          <Route path="/trocas" element={<Trocas />} />
          <Route path="/meus-enderecos" element={<Enderecos />} />
          <Route path="/formas-de-pagamento" element={<Pagamentos />} />
          <Route path="/lista-de-desejos" element={<ListaDesejos />} />
          
          {/* --- ROTAS PRIVADAS (ADMINISTRAÇÃO) --- */}
          <Route path="/admin" element={<AdminLayout />}>
            {/* Redireciona /admin direto para o dashboard */}
            <Route index element={<Navigate to="dashboard" replace />} />
            
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="pedidos" element={<GestaoPedidos />} />
            
            {/* LISTAGEM: Onde você vê a tabela com todos os produtos */}
            <Route path="produtos" element={<GerenciarProdutos />} /> 
            
            {/* FORMULÁRIO: Novo cadastro */}
            <Route path="cadastrar" element={<CadastroProduto />} /> 
            
            {/* EDIÇÃO: Usa o mesmo formulário, mas carrega os dados pelo ID */}
            <Route path="editar/:id" element={<CadastroProduto />} /> 
          </Route>

          {/* Fallback: Se a rota não existir, volta para a home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!isAdminPath && <Footer />}
    </>
  );
}