import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import styles from "./Produtos.module.css";

export default function Produtos({ termoBusca = "" }) {
  const scrollRef = useRef(null);
  const [listaProdutos, setListaProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const navegar = useNavigate();

  // URL do seu Backend
  const URL_BACKEND = "http://localhost:3000";

  useEffect(() => {
    setCarregando(true);
    fetch(`${URL_BACKEND}/produtos`)
      .then((res) => res.json())
      .then((dados) => {
        setListaProdutos(dados);
        setCarregando(false);
      })
      .catch((err) => {
        console.error("Erro ao carregar produtos:", err);
        setCarregando(false);
      });
  }, []);

  // Rola para o início ao buscar
  useEffect(() => {
    if (termoBusca.length > 0) {
      scrollRef.current?.scrollTo({ left: 0, behavior: "smooth" });
    }
  }, [termoBusca]);

  // Filtro por nome ou cor
  const produtosFiltrados = listaProdutos.filter((produto) =>
    produto.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
    (produto.cor && produto.cor.toLowerCase().includes(termoBusca.toLowerCase()))
  );

  const scrollLeft = () => scrollRef.current?.scrollBy({ left: -280, behavior: "smooth" });
  const scrollRight = () => scrollRef.current?.scrollBy({ left: 280, behavior: "smooth" });

  const irParaDetalhes = (id) => {
    navegar(`/produto/${id}`);
    window.scrollTo(0, 0); 
  };

  if (carregando) return <p className={styles.carregando}>Carregando sapatilhas...</p>;

  return (
    <section id="tendencias" className={styles.secao_produtos}>
      <h2 className={styles.titulo_secao}>
        {termoBusca ? `Resultados para: "${termoBusca}"` : "Mais vendidos"}
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
              
              //  Lógica de Desconto e Porcentagem
              const precoAtual = Number(produto.preco);
              const precoAntigo = produto.preco_antigo ? Number(produto.preco_antigo) : null;
              const temDesconto = precoAntigo && precoAntigo > precoAtual;
              
              let porcentagemOff = 0;
              if (temDesconto) {
                porcentagemOff = Math.round(((precoAntigo - precoAtual) / precoAntigo) * 100);
              }

              const precoFormatado = precoAtual.toLocaleString("pt-BR", {
                style: "currency", currency: "BRL"
              });

              const precoAntigoFormatado = temDesconto 
                ? precoAntigo.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
                : null;

              const caminhoImagem = produto.imagem.startsWith('/') 
                ? `${URL_BACKEND}${produto.imagem}` 
                : `${URL_BACKEND}/${produto.imagem}`;

              return (
                <div key={produto.id} className={styles.produto}>
                  
                  {/*  Só aparece se houver desconto real */}
                  {temDesconto && (
                    <span className={styles.tag_promo}>{porcentagemOff}% OFF</span>
                  )}
                  
                  <img
                    src={caminhoImagem}
                    alt={produto.nome}
                    className={styles.imagem_produto}
                    onClick={() => irParaDetalhes(produto.id)}
                    loading="lazy"
                    onError={(e) => { e.target.src = "https://via.placeholder.com/200?text=Sem+Foto"; }}
                  />
                  
                  <div className={styles.info_produto}>
                    <h3 className={styles.nome_produto}>{produto.nome}</h3>
                    
                    <div className={styles.area_precos}>
                      {temDesconto && (
                        <span className={styles.preco_antigo}>{precoAntigoFormatado}</span>
                      )}
                      <p className={styles.preco_atual}>{precoFormatado}</p>
                    </div>

                    <button onClick={() => irParaDetalhes(produto.id)} className={styles.botao_comprar}>
                      Comprar
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p className={styles.vazio}>Nenhuma sapatilha encontrada para "{termoBusca}". 😢</p>
          )}
        </div>
      </div>
    </section>
  );
}