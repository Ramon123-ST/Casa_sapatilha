import React, { useEffect, useRef } from "react";
import styles from "./Hero.module.css";
import imgSapatilha from '../../assets/img/img_sapatilha_pricipal.jpg'
``

export default function Hero() {
  const typingRefs = useRef([]);

  useEffect(() => {
    typingRefs.current.forEach((el) => {
      if (!el) return;
      const texto = el.dataset.text;
      let i = 0;
      el.innerHTML = ""; 

      const digitar = () => {
        if (i < texto.length) {
          el.innerHTML += texto.charAt(i);
          i++;
          setTimeout(digitar, 80);
        }
      };
      digitar();
    });
  }, []);

  return (
    <section className={styles.heroi}>
      <div className={styles.carrossel_heroi}>
        
        <div className={styles.lados}>
          
          <div
            className={`${styles.lado} ${styles.active}`}
            style={{ backgroundImage: `url(${imgSapatilha})` }}
          >
            <div className={styles.conteudo_lado}>
              <div
                className={`${styles.sobrancelha} ${styles.typing}`}
                data-text="VERÃO'26"
                ref={(el) => (typingRefs.current[0] = el)}
              />
              <h1
                className={styles.typing}
                data-text="O melhor para você"
                ref={(el) => (typingRefs.current[1] = el)}
              />
              <p
                className={`${styles.silenciado} ${styles.typing}`}
                data-text="Coleção Verão — design leve e sofisticado"
                ref={(el) => (typingRefs.current[2] = el)}
              />
              <a className={styles.botao} href="#colecao">
                VER MAIS
              </a>
            </div>
          </div>

          
          <div
            className={styles.lado}
            style={{ backgroundImage: "url('/img/slide2.jpg')" }}
          >
            <div className={styles.conteudo_lado}>
              <div className={styles.sobrancelha}>OUTONO'26</div>
              <h1>Nova coleção</h1>
              <p>Elegância em cada passo</p>
              <a className={styles.botao} href="#outono">EXPLORAR</a>
            </div>
          </div>
        </div>

        
        <div className={styles.pontos_carrossel}>
          <span className={styles.ponto_ativo}></span>
          <span className={styles.ponto}></span>
        </div>

        
        <button className={styles.seta_esq}>←</button>
        <button className={styles.seta_dir}>→</button>
      </div>
    </section>
  );
}