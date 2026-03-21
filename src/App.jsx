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
import Cadastro from "./components/Cadastro/Cadastro"; 

export default function App() {
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  const [cadastroAberto, setCadastroAberto] = useState(false); // ✅ NOVO: Controle do Modal de Cadastro
  const [termoBusca, setTermoBusca] = useState("");

  const abrirCarrinho = () => setCarrinhoAberto(true);
  const abrirCadastro = () => setCadastroAberto(true); // ✅ NOVO: Função para abrir o Cadastro

  return (
    <>
      {/* O Header agora recebe a função para abrir o Cadastro também */}
      <Header 
        abrirCarrinho={abrirCarrinho} 
        abrirCadastro={abrirCadastro} 
        aoBuscar={setTermoBusca} 
      />

      {/* Modais: Eles ficam aqui fora das rotas para aparecerem por cima de qualquer página */}
      <Carrinho aberto={carrinhoAberto} setAberto={setCarrinhoAberto} />
      <Cadastro aberto={cadastroAberto} setAberto={setCadastroAberto} />

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

          {/* Removi a Rota /cadastro porque agora ele é um Componente Suspenso (Modal) */}
          <Route path="/produto/:id" element={<DetalhesProduto />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}