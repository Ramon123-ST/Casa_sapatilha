import React from "react";
import styles from "./MaisProdutos.module.css";

// Importação com caminhos absolutos (funciona no Vite)
import r1 from "/src/assets/img/sapatilha4.jpg";
import r2 from "/src/assets/img/OIP (5).webp";
import r3 from "/src/assets/img/r2.webp";
import r4 from "/src/assets/img/r3.jpg";
import r5 from "/src/assets/img/r4.webp";
import r6 from "/src/assets/img/r5.jpg";
import r7 from "/src/assets/img/r6.webp";
import r8 from "/src/assets/img/OIP (7).webp";

const maisProdutos = [
  { id: "m1", name: "Sapatilha strass", price: 189.9, img: r1 },
  { id: "m2", name: "Sapatilha hele", price: 129.9, img: r2 },
  { id: "m3", name: "Sapatilha Casual couro", price: 149.9, img: r3 },
  { id: "m4", name: "Sapatilha bico fino", price: 199.9, img: r4 },
  { id: "m5", name: "Sapatilha couro sthey", price: 189.9, img: r5 },
  { id: "m6", name: "Sapatilha bege", price: 129.9, img: r6 },
  { id: "m7", name: "Sapatilha shoes", price: 149.9, img: r7 },
  { id: "m8", name: "Sapatilha botter", price: 199.9, img: r8 },
];

export default function MaisProdutos() {
  // FUNÇÃO: Abre WhatsApp com mensagem personalizada
  const abrirWhatsApp = (produto = null) => {
    let mensagem = "Olá! Gostaria de mais informações sobre seus produtos.";

    if (produto) {
      mensagem = `Olá! Gostaria de comprar:\n*${produto.name}* - ${produto.price.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })}`;
    }

    const textoCodificado = encodeURIComponent(mensagem);
    window.open(`https://wa.me/5598985101918?text=${textoCodificado}`, "_blank");
  };

  return (
    <section id="lancamentos" aria-labelledby="titulo-mais-produtos">
      <h2 id="titulo-mais-produtos" className={styles.titulo_secao}>
        Mais Produtos
      </h2>

      <div className={styles.grade_produtos}>
        {maisProdutos.map((produto) => {
          const precoFormatado = produto.price.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          });

          return (
            <article key={produto.id} className={styles.produto}>
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
            </article>
          );
        })}
      </div>

      {/* BOTÃO VER MAIS */}
      <div className={styles.ver_mais_container}>
        <button
          onClick={() => abrirWhatsApp()} // Sem produto = mensagem genérica
          className={styles.botao_ver_mais}
          aria-label="Ver mais produtos no WhatsApp"
        >
          Ver mais
        </button>
      </div>
    </section>
  );
}