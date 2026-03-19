import React, { useState, useEffect } from "react";
import styles from "./MaisProdutos.module.css";

export default function MaisProdutos() {
  const [produtosDoBanco, setProdutosDoBanco] = useState([]);
  const [quantidadeExibida, setQuantidadeExibida] = useState(8);

  // BUSCA OS DADOS NO BANCO (NODE + MYSQL)
  useEffect(() => {
    fetch("http://localhost:3000/produtos")
      .then((res) => res.json())
      .then((dados) => {
        setProdutosDoBanco(dados);
      })
      .catch((err) => console.error("Erro ao carregar produtos do banco:", err));
  }, []);

  const abrirWhatsApp = (produto = null) => {
    let mensagem = "Olá! Gostaria de mais informações sobre seus produtos.";

    if (produto) {
      mensagem = `Olá! Gostaria de comprar:\n*${produto.nome}* - ${Number(produto.preco).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })}`;
    }

    const textoCodificado = encodeURIComponent(mensagem);
    window.open(`https://wa.me/5598985101918?text=${textoCodificado}`, "_blank");
  };

  const mostrarOuEsconder = () => {
    if (quantidadeExibida >= produtosDoBanco.length) {
      setQuantidadeExibida(8); // VOLTA PARA 8
    } else {
      setQuantidadeExibida((prev) => prev + 8); // MOSTRA +8
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
          // Garante que o preço seja tratado como número
          const precoFormatado = Number(produto.preco).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          });

          return (
            <article key={produto.id} className={styles.produto}>
              {/* Agora usamos produto.imagem que vem do banco */}
              <img src={produto.imagem} alt={produto.nome} loading="lazy" />
              <div className={styles.info_produto}>
                <h3>{produto.nome}</h3>
                <p>{precoFormatado}</p>
                <button onClick={() => abrirWhatsApp(produto)}>Comprar</button>
              </div>
            </article>
          );
        })}
      </div>

      {/* Só mostra o botão se houver mais de 8 produtos no banco */}
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