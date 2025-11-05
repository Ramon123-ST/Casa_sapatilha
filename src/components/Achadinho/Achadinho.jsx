import React from "react";
import styles from "./Achadinho.module.css";


import achado from "/src/assets/img/achado.jpg";

export default function Achadinho() {
  return (
    <section
      id="achadinho"
      className={styles.secao_achadinho}
      aria-labelledby="titulo-promocao"
    >
      <div className={styles.container}>
        
        <div className={styles.texto_container}>
          <h1 id="titulo-promocao" className={styles.titulo}>
            PROMOÇÃO DO DIA <br />
            COM ATÉ 60% OFF
          </h1>
          <p className={styles.subtitulo}>
            Ofertas relâmpago até acabar o estoque!
          </p>
          <a
            href="#ofertas"
            className={styles.botao_ver}
            aria-label="Ver todas as ofertas promocionais"
          >
            Ver Oferta
          </a>
        </div>

       
        <article className={styles.cartao} role="region" aria-labelledby="nome-produto">
          <div className={styles.desconto} aria-label="Desconto de 40%">
            -40%
          </div>

          <img
            src={achado}
            alt="Sapatilha Feminino em promoção"
            className={styles.imagem}
            loading="lazy"
          />

          <div className={styles.info}>
            <h2 id="nome-produto" className={styles.nome}>
              Sapatilha Feminino
            </h2>
            <p className={styles.preco_antigo} aria-label="Preço antigo">
              R$ 199,90
            </p>
            <p className={styles.preco_novo} aria-label="Preço promocional">
              R$ 119,90
            </p>
            <a
              href="#comprar"
              className={styles.botao_comprar}
              aria-label="Comprar Sapatilha Feminino por R$ 119,90"
            >
              Comprar
            </a>
          </div>
        </article>
      </div>
    </section>
  );
}