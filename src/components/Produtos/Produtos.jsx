import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // 1. Importamos o hook de navegação
import styles from "./Produtos.module.css";

export default function Produtos({ termoBusca = "" }) {
  const scrollRef = useRef(null);
  const [listaProdutos, setListaProdutos] = useState([]);
  const navegar = useNavigate(); // 2. Inicializamos a função de navegar

  useEffect(() => {
    fetch("http://localhost:3000/produtos")
      .then((res) => res.json())
      .then((dados) => {
        setListaProdutos(dados);
      })
      .catch((err) => console.error("Erro ao carregar produtos:", err));
  }, []);

  useEffect(() => {
    if (termoBusca.length > 0) {
      scrollRef.current?.scrollTo({ left: 0, behavior: "smooth" });
    }
  }, [termoBusca]);

  const produtosFiltrados = listaProdutos.filter((produto) =>
    produto.nome.toLowerCase().includes(termoBusca.toLowerCase())
  );

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -260, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 260, behavior: "smooth" });
  };

  // 3. Função atualizada para levar à página de detalhes
  const irParaDetalhes = (id) => {
    navegar(`/produto/${id}`);
    window.scrollTo(0, 0); // Garante que a nova página comece no topo
  };

  return (
    <section id="tendencias" aria-labelledby="titulo-mais-vendidos">
      <h2 id="titulo-mais-vendidos" className={styles.titulo_secao}>
        Mais vendidos
      </h2>

      <div className={styles.contenedor_produtos}>
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
                    onClick={() => irParaDetalhes(produto.id)} // Clique na imagem também navega
                    style={{ cursor: 'pointer' }}
                  />
                  <div className={styles.info_produto}>
                    <h3>{produto.nome}</h3>
                    <p>{precoFormatado}</p>
                    {/* 4. Botão agora chama a função de navegação */}
                    <button
                      onClick={() => irParaDetalhes(produto.id)}
                      aria-label={`Ver detalhes de ${produto.nome}`}
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