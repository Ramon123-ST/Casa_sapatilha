import React from "react";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.gradeRodape}>
        <div>
          <h3>Casa das Sapatilhas</h3>
          <p>O melhor em estilo e conforto para seus pés.</p>
        </div>
        <div>
          <h3>Links</h3>
          <ul>
            <li><a href="#achadinho">Promoções</a></li>
            <li><a href="#tendencias">Mais vendidos</a></li>
            <li><a href="#lancamentos">Produtos</a></li>
          </ul>
        </div>
        <div>
          <h3>Contato</h3>
          <ul>
            <li>Email: Casadasapatilhas@gmail.com</li>
            <li>Telefone: (11) 1234-5678</li>
            <li>Endereço: Rua Exemplo, 123</li>
          </ul>
        </div>
      </div>
      <p>&copy; 2025 Casa das Sapatilhas. Todos os direitos reservados.</p>
    </footer>
  );
}



