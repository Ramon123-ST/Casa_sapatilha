import React, { useState } from "react";
import { useCart } from "../../Context/CartContext"; 
import { useAuth } from "../../Context/AuthContext"; // Importante para pegar o usuario_id
import styles from "./Carrinho.module.css";

export default function Carrinho({ aberto, setAberto }) {
  const { carrinho, removerDoCarrinho, limparCarrinho } = useCart();
  const { usuario } = useAuth(); // Ponto 6: Precisamos saber quem está comprando
  const [carregando, setCarregando] = useState(false);

  const total = carrinho.reduce((acc, item) => {
    const preco = Number(item.preco) || 0;
    return acc + (preco * item.quantidade);
  }, 0);

  // 🚀 FUNÇÃO PARA FINALIZAR NO SISTEMA (PONTO 2 E 6)
  const finalizarPedidoNoSistema = async () => {
    if (!usuario) {
      alert("Por favor, faça login para finalizar a compra!");
      return;
    }

    setCarregando(true);

    const dadosPedido = {
      usuario_id: usuario.id,
      valor_frete: 0, // Ponto 13: Pode ser calculado futuramente
      total_geral: total,
      itens: carrinho.map(item => ({
        produto_id: item.id,
        quantidade: item.quantidade,
        preco_unitario: item.preco,
        tamanho_escolhido: item.tamanho // CRÍTICO: Para o Back-end saber qual estoque baixar
      }))
    };

    try {
      const resposta = await fetch("http://localhost:3000/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosPedido)
      });

      const resultado = await resposta.json();

      if (resposta.ok) {
        alert("✅ Pedido confirmado e estoque atualizado!");
        limparCarrinho(); // Você precisa criar essa função no CartContext
        setAberto(false);
      } else {
        alert(`❌ Erro: ${resultado.erro}`);
      }
    } catch (error) {
      console.error("Erro ao finalizar:", error);
      alert("Erro na conexão com o servidor.");
    } finally {
      setCarregando(false);
    }
  };

  if (!aberto) return null;

  return (
    <div className={styles.overlay} onClick={() => setAberto(false)}>
      <aside className={styles.carrinho_container} onClick={(e) => e.stopPropagation()}>
        <div className={styles.topo}>
          <h2>Minha Sacola</h2>
          <button className={styles.btn_fechar} onClick={() => setAberto(false)}>&times;</button>
        </div>

        <div className={styles.itens}>
          {carrinho.length === 0 ? (
            <p className={styles.vazio}>Sua sacola está vazia :(</p>
          ) : (
            carrinho.map((item) => (
              <div key={`${item.id}-${item.tamanho}`} className={styles.item_card}>
                <img src={item.imagem} alt={item.nome} />
                <div className={styles.item_info}>
                  <h3>{item.nome}</h3>
                  <p>Tam: {item.tamanho} | Qtd: {item.quantidade}</p>
                  <span className={styles.preco}>
                    {Number(item.preco).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </span>
                </div>
                <button 
                  className={styles.btn_remover} 
                  onClick={() => removerDoCarrinho(item.id, item.tamanho)}
                >
                  Remover
                </button>
              </div>
            ))
          )}
        </div>

        {carrinho.length > 0 && (
          <div className={styles.rodape}>
            <div className={styles.total_container}>
              <span>Total:</span>
              <span className={styles.total_valor}>
                {total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </span>
            </div>
            {/* PONTO 6: Botão agora finaliza no seu Banco de Dados */}
            <button 
              className={styles.btn_finalizar} 
              onClick={finalizarPedidoNoSistema}
              disabled={carregando}
            >
              {carregando ? "PROCESSANDO..." : "FINALIZAR PEDIDO"}
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}