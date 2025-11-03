import React from "react";
import styles from "./Produtos.module.css";

// Caminho relativo: ../../assets/img/ (2 níveis acima)
import img1 from "../../assets/img/sapatilha1.webp";
import img2 from "../../assets/img/sapatilha2.png";
import img3 from "../../assets/img/sapatilha3.webp";
import img4 from "../../assets/img/sapatilha4.jpg";
import img5 from "../../assets/img/OIP (1).webp";
import img6 from "../../assets/img/OIP (3).webp";
import img7 from "../../assets/img/OIP (4).webp";

const produtos = [
  { name: "Sapatilha couro preta", price: 129.9, img: img1 },
  { name: "Sapatilha Bege", price: 99.9, img: img2 },
  { name: "Sapatilha Confort", price: 149.9, img: img3 },
  { name: "Birken Casual", price: 139.9, img: img4 },
  { name: "Confort Preto", price: 159.9, img: img5 },
  { name: "Sandália Elegante", price: 179.9, img: img6 },
  { name: "Sapatilha preta", price: 119.9, img: img7 },
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


