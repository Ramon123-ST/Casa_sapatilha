import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import styles from "./Achadinho.module.css";

export default function Achadinho() {
  const [oferta, setOferta] = useState(null);
  const navegar = useNavigate();

  //  URL do seu Backend
  const URL_BACKEND = "http://localhost:3000";

  useEffect(() => {
    fetch(`${URL_BACKEND}/produtos`)
      .then((res) => res.json())
      .then((dados) => {
        // Busca um produto que tenha preco_antigo maior que o preco atual
        // Se não achar nenhum em promoção, pega o quarto item da lista como destaque
        const produtoEmOferta = dados.find(p => Number(p.preco_antigo) > Number(p.preco)) || dados[3]; 
        setOferta(produtoEmOferta);
      })
      .catch((err) => console.error("Erro ao carregar oferta:", err));
  }, []);

  const irParaDetalhes = (id) => {
    navegar(`/produto/${id}`);
    window.scrollTo(0, 0);
  };

  if (!oferta) return null;

  // Cálculo da porcentagem dinâmica para o balão de desconto
  const temDesconto = oferta.preco_antigo && Number(oferta.preco_antigo) > Number(oferta.preco);
  const porcentagem = temDesconto 
    ? Math.round(((oferta.preco_antigo - oferta.preco) / oferta.preco_antigo) * 100)
    : 40; // Fallback caso o produto não tenha desconto cadastrado

  // Ajuste do caminho da imagem vinda do backend
  const caminhoImagem = oferta.imagem.startsWith('/') 
    ? `${URL_BACKEND}${oferta.imagem}` 
    : `${URL_BACKEND}/${oferta.imagem}`;

  return (
    <section id="achadinho" className={styles.secao_achadinho} aria-labelledby="titulo-promocao">
      <div className={styles.container}>
        
        {/* Lado Esquerdo: Textos e Chamada */}
        <div className={styles.texto_container}>
          <h1 id="titulo-promocao" className={styles.titulo}>
            PROMOÇÃO DO DIA <br />
            COM ATÉ {porcentagem}% OFF
          </h1>
          <p className={styles.subtitulo}>
            Ofertas relâmpago exclusivas com o conforto que seus pés merecem. Aproveite antes que o estoque acabe!
          </p>
          <a href="#lancamentos" className={styles.botao_ver}>
            Ver Outras Ofertas
          </a>
        </div>

        <article className={styles.cartao}>
          <div className={styles.desconto}>
            -{porcentagem}%
          </div>

          <img
            src={caminhoImagem}
            alt={oferta.nome}
            className={styles.imagem}
            loading="eager"
            onClick={() => irParaDetalhes(oferta.id)} 
            style={{ cursor: "pointer" }}
            onError={(e) => { e.target.src = "https://via.placeholder.com/400?text=Oferta+Especial"; }}
          />

          <div className={styles.info}>
            <h2 className={styles.nome}>{oferta.nome}</h2>
            
            {temDesconto && (
              <p className={styles.preco_antigo}>
                R$ {Number(oferta.preco_antigo).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            )}
            
            <p className={styles.preco_novo}>
              R$ {Number(oferta.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            
            <button 
              onClick={() => irParaDetalhes(oferta.id)} 
              className={styles.botao_comprar}
            >
              Comprar Agora
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}