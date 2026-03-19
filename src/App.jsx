import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import Achadinho from "./components/Achadinho/Achadinho";
import Produtos from "./components/Produtos/Produtos";
import MaisProdutos from "./components/MaisProdutos/MaisProdutos";
import Footer from "./components/Footer/Footer";
import Admin from "./components/Admin/Admin"; 

// ✅ CAMINHO CORRIGIDO: Agora o Vite vai encontrar o arquivo na pasta certa
import DetalhesProduto from "./components/DetalhesProduto/DetalhesProduto"; 

export default function App() {
  const [carrinho, setCarrinho] = useState([]);
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  const [termoBusca, setTermoBusca] = useState("");

  const adicionarAoCarrinho = (produto) => {
    setCarrinho((prev) => [...prev, produto]);
    setCarrinhoAberto(true);
  };

  const abrirCarrinho = () => setCarrinhoAberto(true);

  return (
    <>
      <Header 
        carrinhoCount={carrinho.length} 
        abrirCarrinho={abrirCarrinho} 
        aoBuscar={setTermoBusca} 
      />

      <main>
        <Routes>
          {/* ROTA DA HOME */}
          <Route path="/" element={
            <>
              <section id="hero">
                <Hero />
              </section>

              <section id="promocoes">
                <Achadinho adicionarAoCarrinho={adicionarAoCarrinho} termoBusca={termoBusca} />
              </section>

              <section id="mais-vendidos">
                <Produtos adicionarAoCarrinho={adicionarAoCarrinho} termoBusca={termoBusca} />
              </section>

              <section id="produtos">
                <MaisProdutos adicionarAoCarrinho={adicionarAoCarrinho} termoBusca={termoBusca} />
              </section>
            </>
          } />

          {/* ROTA DE DETALHES */}
          <Route path="/produto/:id" element={<DetalhesProduto />} />

          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}