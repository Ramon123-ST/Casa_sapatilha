import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 1. Importamos o hook de navegação
import styles from "./MaisProdutos.module.css";

export default function MaisProdutos() {
  const [produtosDoBanco, setProdutosDoBanco] = useState([]);
  const [quantidadeExibida, setQuantidadeExibida] = useState(8);
  const navegar = useNavigate(); // 2. Inicializamos o navegador

  // BUSCA OS DADOS NO BANCO
  useEffect(() => {
    fetch("http://localhost:3000/produtos")
      .then((res) => res.json())
      .then((dados) => {
        setProdutosDoBanco(dados);
      })
      .catch((err) => console.error("Erro ao carregar produtos do banco:", err));
  }, []);

  // 3. Função para navegar até a página de detalhes
  const irParaDetalhes = (id) => {
    navegar(`/produto/${id}`);
    window.scrollTo(0, 0); // Garante que a página abra no topo
  };

  const mostrarOuEsconder = () => {
    if (quantidadeExibida >= produtosDoBanco.length) {
      setQuantidadeExibida(8); 
    } else {
      setQuantidadeExibida((prev) => prev + 8); 
    }
  };

  const textoBotao =
    quantidadeExibida >= produtosDoBanco.length ? "Ver menos" : "Ver mais";

  return (
    <section id="lancamentos" aria-labelledby="titulo-mais-produtos">
      <h2 id="titulo-mais-produtos" className={styles.titulo_secao}>
        Mais Produtos
      </h2>

      <div className={`${styles.grade_produtos} ${styles.animar_lista}`}>
        {produtosDoBanco.slice(0, quantidadeExibida).map((produto) => {
          const precoFormatado = Number(produto.preco).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          });

          return (
            <article key={produto.id} className={styles.produto}>
              {/* Clique na imagem também leva aos detalhes */}
              <img 
                src={produto.imagem} 
                alt={produto.nome} 
                loading="lazy" 
                onClick={() => irParaDetalhes(produto.id)}
                style={{ cursor: "pointer" }}
              />
              <div className={styles.info_produto}>
                <h3>{produto.nome}</h3>
                <p>{precoFormatado}</p>
                {/* 4. Botão atualizado para irParaDetalhes */}
                <button onClick={() => irParaDetalhes(produto.id)}>
                  Comprar
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {produtosDoBanco.length > 8 && (
        <div className={styles.ver_mais_container}>
          <button onClick={mostrarOuEsconder} className={styles.botao_ver_mais}>
            {textoBotao}
          </button>
        </div>
      )}
    </section>
  );
}