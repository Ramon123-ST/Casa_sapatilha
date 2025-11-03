import React from "react";
import r1 from "/src/assets/img/sapatilha4.jpg";
import r2 from "/src/assets/img/OIP (5).webp";
import r3 from "/src/assets/img/r2.webp";
import r4 from "/src/assets/img/r3.jpg";
import r5 from "/src/assets/img/r4.webp";
import r6 from "/src/assets/img/r5.jpg";
import r7 from "/src/assets/img/r6.webp";
import r8 from "/src/assets/img/OIP (7).webp";
import styles from "./MaisProdutos.module.css";

const maisProdutos = [
  { name: "Sapatilha strass", price: 189.9, img: r1},
  { name: "Sapatilha hele", price: 129.9, img: r2 },
  { name: "Sapatilha Casual couro", price: 149.9, img: r3 },
  { name: "Sapatilha bico fino", price: 199.9, img: r4 },
  { name: "Sapatolha couro sthey", price: 189.9, img: r5 },
  { name: "Sapatilha bege", price: 129.9, img: r6 },
  { name: "Sapatilha shoes", price: 149.9, img: r7 },
  { name: "Sapatilha botter", price: 199.9, img: r8 },
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


