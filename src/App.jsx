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

  const removerDoCarrinho = (index) => {
    setCarrinho((prev) => prev.filter((_, i) => i !== index));
  };

  const abrirCarrinho = () => setCarrinhoAberto(true);
  const fecharCarrinho = () => setCarrinhoAberto(false);

  return (
    <>
      <Header carrinhoCount={carrinho.length} abrirCarrinho={abrirCarrinho} />
      <Hero />
      <Achadinho adicionarAoCarrinho={adicionarAoCarrinho} />
      <Produtos adicionarAoCarrinho={adicionarAoCarrinho} />
      <MaisProdutos adicionarAoCarrinho={adicionarAoCarrinho} />*/
      
      <Footer />
    </>
  );
}
