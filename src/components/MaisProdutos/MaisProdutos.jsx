import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import styles from "./MaisProdutos.module.css";

export default function MaisProdutos() {
  const [produtosDoBanco, setProdutosDoBanco] = useState([]);
  const [quantidadeExibida, setQuantidadeExibida] = useState(8);
  const [carregando, setCarregando] = useState(true);
  const navegar = useNavigate();

  const URL_BACKEND = "http://localhost:3000";

  useEffect(() => {
    setCarregando(true);
    fetch(`${URL_BACKEND}/produtos`)
      .then((res) => res.json())
      .then((dados) => {
        setProdutosDoBanco(dados);
        setCarregando(false);
      })
      .catch((err) => {
        console.error("Erro ao carregar produtos:", err);
        setCarregando(false);
      });
  }, []);

  const irParaDetalhes = (id) => {
    navegar(`/produto/${id}`);
    window.scrollTo(0, 0); 
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

  if (carregando) return <p className={styles.vazio}>Carregando vitrine...</p>;

  return (
    <section id="lancamentos" aria-labelledby="titulo-mais-produtos" className={styles.secao_mais_produtos}>
      <h2 id="titulo-mais-produtos" className={styles.titulo_secao}>
        Mais Produtos
      </h2>

      <div className={`${styles.grade_produtos} ${styles.animar_lista}`}>
        {produtosDoBanco.slice(0, quantidadeExibida).map((produto) => {
          
          //  Lógica de Desconto e Porcentagem
          const precoAtual = Number(produto.preco);
          const precoAntigo = produto.preco_antigo ? Number(produto.preco_antigo) : null;
          const temDesconto = precoAntigo && precoAntigo > precoAtual;
          
          let porcentagemOff = 0;
          if (temDesconto) {
            porcentagemOff = Math.round(((precoAntigo - precoAtual) / precoAntigo) * 100);
          }

          const precoFormatado = precoAtual.toLocaleString("pt-BR", {
            style: "currency", currency: "BRL"
          });

          const precoAntigoFormatado = temDesconto 
            ? precoAntigo.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
            : null;

          const caminhoImagem = produto.imagem.startsWith('/') 
            ? `${URL_BACKEND}${produto.imagem}` 
            : `${URL_BACKEND}/${produto.imagem}`;

          return (
            <article key={produto.id} className={styles.produto}>
              
              {/* Tag de Porcentagem (Só aparece se houver desconto) */}
              {temDesconto && (
                <span className={styles.tag_promo}>{porcentagemOff}% OFF</span>
              )}

              <img 
                src={caminhoImagem} 
                alt={produto.nome} 
                loading="lazy" 
                onClick={() => irParaDetalhes(produto.id)}
                onError={(e) => { e.target.src = "https://via.placeholder.com/200?text=Sem+Foto"; }}
              />
              
              <div className={styles.info_produto}>
                <h3>{produto.nome}</h3>
                
                <div className={styles.area_precos}>
                  {temDesconto && (
                    <span className={styles.preco_antigo}>{precoAntigoFormatado}</span>
                  )}
                  <p className={styles.preco_atual}>{precoFormatado}</p>
                </div>

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