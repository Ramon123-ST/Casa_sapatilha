import React from "react";
import styles from "./MaisProdutos.module.css";

const maisProdutos = [
  { name: "Sapatilha strass", price: 189.9, img: "img/OIP (6).webp" },
  { name: "Sapatilha hele", price: 129.9, img: "img/OIP (5).webp" },
  { name: "Sapatilha Casual couro", price: 149.9, img: "img/r2.webp" },
  { name: "Sapatilha bico fino", price: 199.9, img: "img/r3.jpg" },
  { name: "Sapatolha couro sthey", price: 189.9, img: "img/r4.webp" },
  { name: "Sapatilha bege", price: 129.9, img: "img/r5.jpg" },
  { name: "Sapatilha shoes", price: 149.9, img: "img/r6.webp" },
  { name: "Sapatilha botter", price: 199.9, img: "img/OIP (7).webp" },
];

export default function MaisProdutos({ adicionarAoCarrinho }) {
  return (
    <section id="lancamentos">
      <h2 className={styles.titulo_secao}>Mais Produtos</h2>
      <div className={styles.grade_produtos}>
        {maisProdutos.map((produto, i) => (
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
    </section>
  );
}


