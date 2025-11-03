import React from "react";
import styles from "./Produtos.module.css";

const produtos = [
  { name: "Sapatilha couro preta", price: 129.9, img: "img/sapatilha1.webp" },
  { name: "Sapatilha Bege", price: 99.9, img: "img/sapatilha2.png" },
  { name: "Sapatilha Confort", price: 149.9, img: "img/sapatilha3.webp" },
  { name: "Birken Casual", price: 139.9, img: "img/sapatilha4.jpg" },
  { name: "Confort Preto", price: 159.9, img: "img/OIP (1).webp" },
  { name: "Sandália Elegante", price: 179.9, img: "img/OIP (3).webp" },
  { name: "Sapatilha preta", price: 119.9, img: "img/OIP (4).webp" },
];

export default function Produtos({ adicionarAoCarrinho }) {
  return (
    <section id="tendencias">
      <h2 className={styles.titulo_secao}>Mais vendidos</h2>
      <div className={styles.contenedor_produtos}>
        <div className={styles.rolagem_produtos}>
          {produtos.map((produto, i) => (
            <div className={styles.produto} key={i}>
              <img src={produto.img} alt={produto.name} />
              <div className={styles.info_produto}>
                <h3>{produto.name}</h3>
                <p>R$ {produto.price.toFixed(2)}</p>
                <button onClick={() => adicionarAoCarrinho(produto)}>Comprar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


