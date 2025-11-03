import React from "react";
import styles from "./Achadinho.module.css";
import achado from "/src/assets/img/achado.jpg"; 

export default function Achadinho() {
  return (
    <section id="achadinho" className={styles.secao_achadinho}>
      <div className={styles.container}>
        
        <div className={styles.texto_container}>
          <h1 className={styles.titulo}>
            PROMOÇÃO DO DIA <br />
            COM ATÉ 60% OFF
          </h1>
          <p className={styles.subtitulo}>
            Ofertas relâmpago até acabar o estoque!
          </p>
          <a href="#ofertas" className={styles.botao_ver}>
            Ver Oferta
          </a>
        </div>

        
        <div className={styles.cartao}>
          <div className={styles.desconto}>-40%</div>
          <img
            src={achado} 
            alt="Sapatilha Feminino"
            className={styles.imagem}
          />
          <div className={styles.info}>
            <p className={styles.nome}>Sapatilha Feminino</p>
            <p className={styles.preco_antigo}>R$ 199,90</p>
            <p className={styles.preco_novo}>R$ 119,90</p>
            <a href="#comprar" className={styles.botao_comprar}>
              Comprar
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
