import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// ✅ AJUSTE: ../../ sai de DetalhesProduto e de components para achar a pasta context na src
import { useCart } from "../../Context/CartContext"; 
import styles from "./DetalhesProduto.module.css";

export default function DetalhesProduto() {
  const { id } = useParams();
  const navegar = useNavigate();
  const [produto, setProduto] = useState(null);
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState(null);
  const { adicionarAoCarrinho } = useCart();

  useEffect(() => {
    // Note: No deploy, certifique-se que sua API/JSON está acessível
    fetch(`http://localhost:3000/produtos/${id}`)
      .then((res) => res.json())
      .then((dados) => setProduto(dados))
      .catch((err) => console.error("Erro ao carregar detalhes:", err));
  }, [id]);

  const alternarTamanho = (tam) => {
    if (tamanhoSelecionado === tam) {
      setTamanhoSelecionado(null);
    } else {
      setTamanhoSelecionado(tam);
    }
  };

  const lidarComAdicionar = () => {
    if (!tamanhoSelecionado) {
      alert("Por favor, selecione um tamanho antes de adicionar ao carrinho! 👟");
      return;
    }
    
    adicionarAoCarrinho(produto, tamanhoSelecionado);
    alert(`${produto.nome} (Tam: ${tamanhoSelecionado}) adicionado com sucesso!`);
  };

  if (!produto) return <p className={styles.carregando}>Carregando detalhes...</p>;

  return (
    <main className={styles.container}>
      <button className={styles.botao_fechar} onClick={() => navegar("/")} title="Fechar">
        &times;
      </button>

      <div className={styles.vitrine}>
        <div className={styles.imagem_principal}>
          <img src={produto.imagem} alt={produto.nome} />
        </div>

        <div className={styles.infos}>
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
                <button 
                  key={tam} 
                  className={`${styles.btn_tam} ${tamanhoSelecionado === tam ? styles.ativo : ""}`}
                  onClick={() => alternarTamanho(tam)}
                >
                  {tam}
                </button>
              ))}
            </div>
          </div>

          <button className={styles.botao_comprar} onClick={lidarComAdicionar}>
            Adicionar ao carrinho
          </button>
        </div>
      </div>
    </main>
  );
}