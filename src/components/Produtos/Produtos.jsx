import React, { useRef, useEffect, useState } from "react";
import styles from "./Produtos.module.css";

// 1. Recebemos o termoBusca do App.jsx
export default function Produtos({ termoBusca = "" }) {
  const scrollRef = useRef(null);
  const [listaProdutos, setListaProdutos] = useState([]);

  // useEffect para carregar os produtos do banco (executa uma vez)
  useEffect(() => {
    fetch("http://localhost:3000/produtos")
      .then((res) => res.json())
      .then((dados) => {
        setListaProdutos(dados);
      })
      .catch((err) => console.error("Erro ao carregar produtos:", err));
  }, []);

  // 🚀 NOVO: Reseta o scroll para o início sempre que o usuário pesquisar algo
  useEffect(() => {
    if (termoBusca.length > 0) {
      scrollRef.current?.scrollTo({ left: 0, behavior: "smooth" });
    }
  }, [termoBusca]);

  // 🔍 Filtramos a lista baseada no nome
  const produtosFiltrados = listaProdutos.filter((produto) =>
    produto.nome.toLowerCase().includes(termoBusca.toLowerCase())
  );

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -260, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 260, behavior: "smooth" });
  };

  const abrirWhatsApp = (produto) => {
    const mensagem = encodeURIComponent(
      `Olá! Gostaria de comprar:\n*${produto.nome}* - ${Number(produto.preco).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`
    );
    window.open(`https://wa.me/5598985101918?text=${mensagem}`, "_blank");
  };

  return (
    <section id="tendencias" aria-labelledby="titulo-mais-vendidos">
      <h2 id="titulo-mais-vendidos" className={styles.titulo_secao}>
        Mais vendidos
      </h2>

      <div className={styles.contenedor_produtos}>
        {/* Só mostra as setas se houver mais de 3 produtos na tela */}
        {produtosFiltrados.length > 3 && (
          <>
            <button onClick={scrollLeft} className={styles.navegacao_esquerda} aria-label="Anterior">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" /></svg>
            </button>

            <button onClick={scrollRight} className={styles.navegacao_direita} aria-label="Próximo">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" /></svg>
            </button>
          </>
        )}

        <div ref={scrollRef} className={styles.rolagem_produtos}>
          {produtosFiltrados.length > 0 ? (
            produtosFiltrados.map((produto) => {
              const precoFormatado = Number(produto.preco).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              });

              return (
                <div key={produto.id} className={styles.produto}>
                  <img
                    src={produto.imagem}
                    alt={produto.nome}
                    loading="lazy"
                  />
                  <div className={styles.info_produto}>
                    <h3>{produto.nome}</h3>
                    <p>{precoFormatado}</p>
                    <button
                      onClick={() => abrirWhatsApp(produto)}
                      aria-label={`Comprar ${produto.nome} via WhatsApp`}
                    >
                      Comprar
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p className={styles.vazio}>Nenhuma sapatilha encontrada. 😢</p>
          )}
        </div>
      </div>
    </section>
  );
}