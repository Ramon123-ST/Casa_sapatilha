import React, { useState, useEffect } from "react";
import styles from "./Achadinho.module.css";

export default function Achadinho() {
  const [oferta, setOferta] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/produtos")
      .then((res) => res.json())
      .then((dados) => {
        // Aqui pegamos o produto que tem o 'preco_antigo' preenchido
        const produtoEmOferta = dados.find(p => p.preco_antigo > 0) || dados[3]; 
        setOferta(produtoEmOferta);
      })
      .catch((err) => console.error("Erro ao carregar oferta:", err));
  }, []);

  if (!oferta) return null; // Não mostra nada enquanto carrega

  // Cálculo automático da porcentagem de desconto
  const porcentagem = oferta.preco_antigo 
    ? Math.round(((oferta.preco_antigo - oferta.preco) / oferta.preco_antigo) * 100)
    : 40;

  const abrirWhatsApp = () => {
    const mensagem = encodeURIComponent(`Olá! Vi a oferta do dia: *${oferta.nome}* por R$ ${oferta.preco}. Ainda tem estoque?`);
    window.open(`https://wa.me/5598985101918?text=${mensagem}`, "_blank");
  };

  return (
    <section id="achadinho" className={styles.secao_achadinho} aria-labelledby="titulo-promocao">
      <div className={styles.container}>
        
        <div className={styles.texto_container}>
          <h1 id="titulo-promocao" className={styles.titulo}>
            PROMOÇÃO DO DIA <br />
            COM ATÉ 60% OFF
          </h1>
          <p className={styles.subtitulo}>
            Ofertas relâmpago até acabar o estoque!
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
            src={oferta.imagem}
            alt={oferta.nome}
            className={styles.imagem}
            loading="lazy"
          />

          <div className={styles.info}>
            <h2 className={styles.nome}>{oferta.nome}</h2>
            
            {oferta.preco_antigo && (
              <p className={styles.preco_antigo}>
                R$ {Number(oferta.preco_antigo).toFixed(2).replace('.', ',')}
              </p>
            )}
            
            <p className={styles.preco_novo}>
              R$ {Number(oferta.preco).toFixed(2).replace('.', ',')}
            </p>
            
            <button onClick={abrirWhatsApp} className={styles.botao_comprar}>
              Comprar Agora
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}