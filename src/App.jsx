import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import Achadinho from "./components/Achadinho/Achadinho";
import Produtos from "./components/Produtos/Produtos";
import MaisProdutos from "./components/MaisProdutos/MaisProdutos";
import Footer from "./components/Footer/Footer";
import Admin from "./components/Admin/Admin"; 

export default function App() {
  const [carrinho, setCarrinho] = useState([]);
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  
  // 🔍 NOVO: Estado para armazenar o que o usuário digita
  const [termoBusca, setTermoBusca] = useState("");

  const adicionarAoCarrinho = (produto) => {
    setCarrinho((prev) => [...prev, produto]);
    setCarrinhoAberto(true);
  };

  const abrirCarrinho = () => setCarrinhoAberto(true);

  return (
    <>
      {/* Passamos a função setTermoBusca para o Header */}
      <Header 
        carrinhoCount={carrinho.length} 
        abrirCarrinho={abrirCarrinho} 
        aoBuscar={setTermoBusca} 
      />

      <main>
        <Routes>
          <Route path="/" element={
            <>
              <section id="hero">
                <Hero />
              </section>

              <section id="promocoes">
                {/* Opcional: filtrar promoções também */}
                <Achadinho adicionarAoCarrinho={adicionarAoCarrinho} termoBusca={termoBusca} />
              </section>

              <section id="mais-vendidos">
                {/* Passamos o termo de busca para filtrar os produtos */}
                <Produtos adicionarAoCarrinho={adicionarAoCarrinho} termoBusca={termoBusca} />
              </section>

              <section id="produtos">
                <MaisProdutos adicionarAoCarrinho={adicionarAoCarrinho} termoBusca={termoBusca} />
              </section>
            </>
          } />

          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}