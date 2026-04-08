import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../../Context/CartContext"; 
import styles from "./DetalhesProduto.module.css";

export default function DetalhesProduto() {
  const { id } = useParams();
  const navegar = useNavigate();
  const [produto, setProduto] = useState(null);
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState(null);
  const { adicionarAoCarrinho } = useCart();
  const [fotoPrincipal, setFotoPrincipal] = useState("");

  const URL_BACKEND = "http://localhost:3000";

  //  FORMATAÇÃO PARA PASTA PUBLIC
  const formatarUrl = (caminho) => {
    if (!caminho || typeof caminho !== 'string') return null;

    // 1. Extrai apenas o nome do arquivo, ignorando caminhos do banco
    let nomeArquivo = caminho.split(/[\\/]/).pop().trim();

    // 2. Garante que a extensão seja .webp (baseado na sua foto de propriedades)
    if (!nomeArquivo.toLowerCase().endsWith(".webp")) {
      nomeArquivo = nomeArquivo.replace(/\.[^/.]+$/, "") + ".webp";
    }

    return `/img/${encodeURIComponent(nomeArquivo)}`;
  };

  useEffect(() => {
    fetch(`${URL_BACKEND}/produtos/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Produto não encontrado");
        return res.json();
      })
      .then((dados) => {
        setProduto(dados);
        if (dados && dados.imagem) {
          setFotoPrincipal(formatarUrl(dados.imagem));
        }
      })
      .catch((err) => console.error("Erro ao carregar:", err));
  }, [id]);

  // Sincroniza a foto quando mudar de produto
  useEffect(() => {
    if (produto?.imagem) {
      setFotoPrincipal(formatarUrl(produto.imagem));
    }
  }, [produto]);

  const alternarTamanho = (tam) => setTamanhoSelecionado(tamanhoSelecionado === tam ? null : tam);

  const lidarComAdicionar = () => {
    if (!tamanhoSelecionado) {
      alert("Por favor, selecione o tamanho! 👟");
      return;
    }
    adicionarAoCarrinho(produto, tamanhoSelecionado);
    alert(`${produto.nome} adicionado ao carrinho!`);
  };

  const lidarComFinalizar = () => {
    if (!tamanhoSelecionado) {
      alert("Selecione o tamanho antes de finalizar! 🛍️");
      return;
    }
    adicionarAoCarrinho(produto, tamanhoSelecionado);
    navegar("/carrinho"); 
  };

  if (!produto) return <p className={styles.carregando}>Carregando...</p>;

  const galeria = [
    formatarUrl(produto.imagem),
    formatarUrl(produto.imagem_2),
    formatarUrl(produto.imagem_3),
  ].filter(Boolean);

  return (
    <main className={styles.container}>
      <button className={styles.botao_fechar} onClick={() => navegar("/")}>&times;</button>

      <div className={styles.vitrine}>
        <div className={styles.area_fotos}>
          <div className={styles.imagem_principal}>
            {fotoPrincipal ? (
               <img 
                 key={fotoPrincipal} 
                 src={fotoPrincipal} 
                 alt={produto.nome} 
                 onError={(e) => {
                   e.target.onerror = null; 
                   e.target.src = "https://via.placeholder.com/400?text=Foto+Nao+Encontrada";
                 }}
               />
            ) : (
               <div className={styles.sem_foto}>Sem imagem</div>
            )}
          </div>
          
          <div className={styles.miniaturas}>
            {galeria.length > 1 && galeria.map((url, index) => (
              <div 
                key={index} 
                className={`${styles.miniatura} ${fotoPrincipal === url ? styles.miniatura_ativa : ""}`}
                onClick={() => setFotoPrincipal(url)}
              >
                <img src={url} alt={`Ângulo ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>

        <div className={styles.infos}>
          <p className={styles.marca}>CASA DA SAPATILHA</p>
          <h1 className={styles.nome_produto}>{produto.nome}</h1>
          
          <div className={styles.precos}>
            <span className={styles.preco_atual}>
              {Number(produto.preco).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </span>
          </div>

          <div className={styles.secao_tamanhos}>
            <p className={styles.titulo_tamanho}>Tamanhos disponíveis:</p>
            <div className={styles.grade}>
              {produto.estoque && produto.estoque.length > 0 ? (
                Array.from(new Set(produto.estoque.map(item => Number(item.tamanho))))
                  .sort((a, b) => a - b)
                  .map((t) => (
                    <button 
                      key={t} 
                      className={`${styles.btn_tam} ${tamanhoSelecionado === t ? styles.ativo : ""}`}
                      onClick={() => alternarTamanho(t)}
                    >
                      {t}
                    </button>
                  ))
              ) : (
                <p className={styles.esgotado}>Produto esgotado</p>
              )}
            </div>
          </div>

          <div className={styles.acoes}>
            <button className={styles.botao_finalizar} onClick={lidarComFinalizar}>Comprar agora</button>
            <button className={styles.botao_comprar} onClick={lidarComAdicionar}>Adicionar ao carrinho</button>
          </div>
        </div>
      </div>
    </main>
  );
}