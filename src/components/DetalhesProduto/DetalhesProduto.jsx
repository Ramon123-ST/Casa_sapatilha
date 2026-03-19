import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Importamos o useNavigate
import styles from "./DetalhesProduto.module.css";

export default function DetalhesProduto() {
  const { id } = useParams();
  const navegar = useNavigate(); // Função para voltar de página
  const [produto, setProduto] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/produtos/${id}`)
      .then((res) => res.json())
      .then((dados) => setProduto(dados))
      .catch((err) => console.error("Erro ao carregar detalhes:", err));
  }, [id]);

  if (!produto) return <p className={styles.carregando}>Carregando detalhes...</p>;

  return (
    <main className={styles.container}>
      {/* Botão X para voltar para a Home */}
      <button className={styles.botao_fechar} onClick={() => navegar("/")} title="Fechar">
        &times;
      </button>

      <div className={styles.vitrine}>
        {/* Lado Esquerdo: Imagem Grande */}
        <div className={styles.imagem_principal}>
          <img src={produto.imagem} alt={produto.nome} />
        </div>

        {/* Lado Direito: Informações */}
        <div className={styles.infos}>
          {/* Nome do Produto em destaque */}
          <h1 className={styles.nome_produto}>{produto.nome}</h1>
          
          <p className={styles.marca}>Marca: Casa da Sapatilha</p>
          
          <div className={styles.precos}>
            <span className={styles.preco_antigo}>De R$ 249,90 por</span>
            <span className={styles.preco_atual}>
              {Number(produto.preco).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </span>
          </div>

          <div className={styles.tamanhos}>
            <p>Tamanho:</p>
            <div className={styles.grade}>
              {[34, 35, 36, 37, 38, 39, 40].map(tam => (
                <button key={tam} className={styles.btn_tam}>{tam}</button>
              ))}
            </div>
          </div>

          <button className={styles.botao_comprar}>Adicionar ao carrinho</button>
        </div>
      </div>
    </main>
  );
}