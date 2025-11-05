import React, { useState } from "react";
import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import Achadinho from "./components/Achadinho/Achadinho";
import Produtos from "./components/Produtos/Produtos";
import MaisProdutos from "./components/MaisProdutos/MaisProdutos";
import Footer from "./components/Footer/Footer";

export default function App() {
  const [carrinho, setCarrinho] = useState([]);
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);

  const adicionarAoCarrinho = (produto) => {
    setCarrinho((prev) => [...prev, produto]);
    setCarrinhoAberto(true);
  };

  const abrirCarrinho = () => setCarrinhoAberto(true);

  return (
    <>
      <Header carrinhoCount={carrinho.length} abrirCarrinho={abrirCarrinho} />

      <main>
        {/* HERO */}
        <section id="hero">
          <Hero />
        </section>

        {/* PROMOÇÕES (usando Achadinho como destaque) */}
        <section id="promocoes">
          <Achadinho adicionarAoCarrinho={adicionarAoCarrinho} />
        </section>

        {/* MAIS VENDIDOS */}
        <section id="mais-vendidos">
          <Produtos adicionarAoCarrinho={adicionarAoCarrinho} />
        </section>

        {/* TODOS OS PRODUTOS */}
        <section id="produtos">
          <MaisProdutos adicionarAoCarrinho={adicionarAoCarrinho} />
        </section>
      </main>

      <Footer />
    </>
  );
}