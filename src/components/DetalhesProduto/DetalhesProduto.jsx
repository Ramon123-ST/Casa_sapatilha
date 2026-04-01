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

  //  FUNÇÃO DE URL BLINDADA: Não duplica /img e resolve o erro das fotos sumirem
  const formatarUrl = (caminho) => {
    if (!caminho || typeof caminho !== 'string') return null;
    if (caminho.startsWith('http')) return caminho;

    // Remove qualquer "img/" ou "/" que já venha do banco para não duplicar
    const nomeLimpo = caminho.replace(/^(\/)?(img\/)?/, "");
    
    return `${URL_BACKEND}/img/${nomeLimpo}`;
  };

  useEffect(() => {
    fetch(`${URL_BACKEND}/produtos/${id}`)
      .then((res) => res.json())
      .then((dados) => {
        console.log("Dados do Produto:", dados); // Para você ver no console se os tamanhos vieram
        setProduto(dados);
        if (dados && dados.imagem) {
          setFotoPrincipal(formatarUrl(dados.imagem));
        }
      })
      .catch((err) => console.error("Erro ao carregar detalhes:", err));
  }, [id]);

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

  //  GALERIA: Pega imagem, imagem_2 e imagem_3
  const galeria = [
    formatarUrl(produto.imagem),
    formatarUrl(produto.imagem_2),
    formatarUrl(produto.imagem_3),
  ].filter(Boolean);

  return (
    <main className={styles.container}>
      <button className={styles.botao_fechar} onClick={() => navegar("/")}>&times;</button>

      <div className={styles.vitrine}>
        {/* LADO ESQUERDO: FOTOS */}
        <div className={styles.area_fotos}>
          <div className={styles.imagem_principal}>
            {fotoPrincipal ? (
               <img key={fotoPrincipal} src={fotoPrincipal} alt={produto.nome} />
            ) : (
               <div className={styles.sem_foto}>Sem imagem</div>
            )}
          </div>
          
          <div className={styles.miniaturas}>
            {/* Só mostra miniaturas se houver mais de uma foto cadastrada */}
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

        {/* LADO DIREITO: TEXTOS */}
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
              {/*  EXIBIÇÃO DE TAMANHOS: Se vier do estoque, mostra todos sem repetir */}
              {produto.estoque && produto.estoque.length > 0 ? (
                Array.from(new Set(produto.estoque.map(item => Number(item.tamanho))))
                  .sort((a, b) => a - b)
                  .map((t) => (
                    <button 
                      key={t} 
                      type="button"
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
            <button className={styles.botao_finalizar} onClick={lidarComFinalizar}>
              Comprar agora
            </button>
            <button className={styles.botao_comprar} onClick={lidarComAdicionar}>
              Adicionar ao carrinho
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}