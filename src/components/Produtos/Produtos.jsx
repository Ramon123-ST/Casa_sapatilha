import React, { useRef } from "react";
import styles from "./Produtos.module.css";

// Importação direta das imagens (Vite)
import img1 from "../../assets/img/sapatilha1.webp";
import img2 from "../../assets/img/sapatilha2.png";
import img3 from "../../assets/img/sapatilha3.webp";
import img4 from "../../assets/img/sapatilha4.jpg";
import img5 from "../../assets/img/OIP (1).webp";
import img6 from "../../assets/img/OIP (3).webp";
import img7 from "../../assets/img/OIP (4).webp";

const produtos = [
  { id: "p1", name: "Sapatilha couro preta", price: 129.9, img: img1 },
  { id: "p2", name: "Sapatilha Bege", price: 99.9, img: img2 },
  { id: "p3", name: "Sapatilha Confort", price: 149.9, img: img3 },
  { id: "p4", name: "Birken Casual", price: 139.9, img: img4 },
  { id: "p5", name: "Confort Preto", price: 159.9, img: img5 },
  { id: "p6", name: "Sandália Elegante", price: 179.9, img: img6 },
  { id: "p7", name: "Sapatilha preta", price: 119.9, img: img7 },
];

export default function Produtos() {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -260, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 260, behavior: "smooth" });
  };

  // FUNÇÃO: Abre WhatsApp com mensagem opcional
  const abrirWhatsApp = (produto) => {
    const mensagem = encodeURIComponent(
      `Olá! Gostaria de comprar:\n*${produto.name}* - ${produto.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`
    );
    window.open(`https://wa.me/5598985101918?text=${mensagem}`, "_blank");
  };

  return (
    <section id="tendencias" aria-labelledby="titulo-mais-vendidos">
      <h2 id="titulo-mais-vendidos" className={styles.titulo_secao}>
        Mais vendidos
      </h2>

      <div className={styles.contenedor_produtos}>
        {/* SETA ESQUERDA */}
        <button
          onClick={scrollLeft}
          className={styles.navegacao_esquerda}
          aria-label="Ver produtos anteriores"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
        </button>

        {/* SETA DIREITA */}
        <button
          onClick={scrollRight}
          className={styles.navegacao_direita}
          aria-label="Ver próximos produtos"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
          </svg>
        </button>

        {/* ROLAGEM DOS PRODUTOS */}
        <div ref={scrollRef} className={styles.rolagem_produtos}>
          {produtos.map((produto) => {
            const precoFormatado = produto.price.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            });

            return (
              <div key={produto.id} className={styles.produto}>
                <img
                  src={produto.img}
                  alt={produto.name}
                  loading="lazy"
                />
                <div className={styles.info_produto}>
                  <h3>{produto.name}</h3>
                  <p>{precoFormatado}</p>
                  <button
                    onClick={() => abrirWhatsApp(produto)}
                    aria-label={`Comprar ${produto.name} via WhatsApp`}
                  >
                    Comprar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


