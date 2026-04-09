import React, { useState, useEffect } from "react";
import styles from "./Hero.module.css";

const dadosSlides = [
  {
    id: 1,
    imagem: "/img/img_sapatilha_pricipal.jpg",
    sobrancelha: "VERÃO'26",
    titulo: "O melhor para você",
    subtitulo: "Coleção Verão — design leve e sofisticado",
    textoBotao: "VER MAIS"
  },
  {
    id: 2,
    imagem: "/img/sapatilha_hero.jpg",
    sobrancelha: "OUTONO'26",
    titulo: "Elegância Confortável",
    subtitulo: "Sapatilhas exclusivas para dias frescos.",
    textoBotao: "EXPLORAR"
  }
];

export default function Hero() {
  const [slideAtivo, setSlideAtivo] = useState(0);
  const [textoExibido, setTextoExibido] = useState({ s: "", t: "", st: "" });

  const proximo = () => setSlideAtivo((p) => (p + 1 === dadosSlides.length ? 0 : p + 1));
  const anterior = () => setSlideAtivo((p) => (p === 0 ? dadosSlides.length - 1 : p - 1));

  useEffect(() => {
    const slide = dadosSlides[slideAtivo];
    setTextoExibido({ s: "", t: "", st: "" });
    let i = 0, j = 0, k = 0;
    const vel = 40;

    const intervalS = setInterval(() => {
      if (i < slide.sobrancelha.length) {
        setTextoExibido(p => ({ ...p, s: slide.sobrancelha.slice(0, i + 1) }));
        i++;
      } else {
        clearInterval(intervalS);
        const intervalT = setInterval(() => {
          if (j < slide.titulo.length) {
            setTextoExibido(p => ({ ...p, t: slide.titulo.slice(0, j + 1) }));
            j++;
          } else {
            clearInterval(intervalT);
            const intervalST = setInterval(() => {
              if (k < slide.subtitulo.length) {
                setTextoExibido(p => ({ ...p, st: slide.subtitulo.slice(0, k + 1) }));
                k++;
              } else clearInterval(intervalST);
            }, vel);
          }
        }, vel);
      }
    }, vel);

    return () => clearInterval(intervalS);
  }, [slideAtivo]);

  useEffect(() => {
    const timer = setInterval(proximo, 8000);
    return () => clearInterval(timer);
  }, [slideAtivo]);

  return (
    <section className={styles.heroi}>
      <div className={styles.carrossel_heroi}>
        <div 
          className={styles.lados} 
          style={{ transform: `translateX(-${slideAtivo * 100}%)` }}
        >
          {dadosSlides.map((slide) => (
            <div
              key={slide.id}
              className={styles.lado}
              style={{ 
                backgroundImage: `url('${slide.imagem}')`,
                backgroundPosition: slide.id === 2 ? "center 15%" : "center center"
              }}
            >
              <div className={styles.conteudo_lado}>
                <div className={styles.sobrancelha}>{textoExibido.s}</div>
                <h1>{textoExibido.t}</h1>
                <p className={styles.silenciado}>{textoExibido.st}</p>
                <a className={styles.botao} href="#produtos">{slide.textoBotao}</a>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.pontos_carrossel}>
          {dadosSlides.map((_, i) => (
            <span 
              key={i} 
              className={i === slideAtivo ? styles.ponto_ativo : styles.ponto} 
              onClick={() => setSlideAtivo(i)} 
            />
          ))}
        </div>

        <button className={styles.seta_esq} onClick={anterior}>❮</button>
        <button className={styles.seta_dir} onClick={proximo}>❯</button>
      </div>
    </section>
  );
}