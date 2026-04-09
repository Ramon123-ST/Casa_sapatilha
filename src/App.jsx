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
// 1. Importar o componente visual do Carrinho que criamos
import Carrinho from "./components/Carrinho/Carrinho"; 

export default function App() {
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  const [termoBusca, setTermoBusca] = useState("");

  const abrirCarrinho = () => setCarrinhoAberto(true);

  return (
    <>
      {/* 2. O Header agora só precisa da função de abrir e a busca */}
      <Header 
        abrirCarrinho={abrirCarrinho} 
        aoBuscar={setTermoBusca} 
      />

      {/* 3. O componente visual do Carrinho fica aqui, "escutando" o estado aberto/fechado */}
      <Carrinho aberto={carrinhoAberto} setAberto={setCarrinhoAberto} />

      <main>
        <Routes>
          <Route path="/" element={
            <>
              <section id="hero">
                <Hero />
              </section>

              <section id="promocoes">
                {/* Removido props de adicionarAoCarrinho pois os componentes usarão o Context */}
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