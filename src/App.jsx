import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import Achadinho from "./components/Achadinho/Achadinho";
import Produtos from "./components/Produtos/Produtos";
import MaisProdutos from "./components/MaisProdutos/MaisProdutos";
import Footer from "./components/Footer/Footer";
import Admin from "./components/Admin/Admin"; 
import DetalhesProduto from "./components/DetalhesProduto/DetalhesProduto"; 
import Carrinho from "./components/Carrinho/Carrinho"; 

export default function App() {
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  const [termoBusca, setTermoBusca] = useState("");

  const abrirCarrinho = () => setCarrinhoAberto(true);

  return (
    <>
      {/* O Header recebe a função para abrir o modal do carrinho visual */}
      <Header 
        abrirCarrinho={abrirCarrinho} 
        aoBuscar={setTermoBusca} 
      />

      {/* O componente visual do Carrinho (Modal/Sidebar) */}
      <Carrinho aberto={carrinhoAberto} setAberto={setCarrinhoAberto} />

      <main>
        <Routes>
          <Route path="/" element={
            <>
              <section id="hero">
                <Hero />
              </section>

              <section id="promocoes">
                <Achadinho termoBusca={termoBusca} />
              </section>

              <section id="mais-vendidos">
                <Produtos termoBusca={termoBusca} />
              </section>

              <section id="produtos">
                <MaisProdutos termoBusca={termoBusca} />
              </section>
            </>
          } />

          <Route path="/produto/:id" element={<DetalhesProduto />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}