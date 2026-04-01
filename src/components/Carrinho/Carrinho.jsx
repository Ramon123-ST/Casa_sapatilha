import React, { useState } from "react";
import { useCart } from "../../Context/CartContext"; 
import { useAuth } from "../../Context/AuthContext"; 
import styles from "./Carrinho.module.css";

export default function Carrinho({ aberto, setAberto }) {
  const { carrinho, removerDoCarrinho, limparCarrinho } = useCart();
  const { usuario } = useAuth();
  const [carregando, setCarregando] = useState(false);

  //  URL do seu Backend (Express/Node)
  const URL_BACKEND = "http://localhost:3000";

  const total = carrinho.reduce((acc, item) => {
    const preco = Number(item.preco) || 0;
    return acc + (preco * item.quantidade);
  }, 0);

  //  FUNÇÃO PARA FINALIZAR NO SISTEMA
  const finalizarPedidoNoSistema = async () => {
    //  Segurança: Verifica se tem usuário logado
    if (!usuario || !usuario.id) {
      alert("Por favor, faça login para finalizar a compra!");
      // Opcional: navegar("/login");
      return;
    }

    //  Segurança: Verifica se o carrinho não está vazio (pode acontecer com lag)
    if (carrinho.length === 0) {
      alert("Sua sacola está vazia!");
      return;
    }

    setCarregando(true);

    //  Formatação dos dados para o Back-end
    const dadosPedido = {
      usuario_id: usuario.id,
      valor_frete: 0, 
      total_geral: total,
      // Mapeamos os itens para garantir que o Back-end receba apenas o necessário
      itens: carrinho.map(item => ({
        //  IMPORTANTE: Se o id do produto no contexto for 'id', use 'id'. 
        // Se o contexto salvar o id do banco em 'produto_id', troque aqui.
        produto_id: item.id, 
        quantidade: item.quantidade,
        preco_unitario: Number(item.preco),
        //  CRÍTICO: Essencial para o Back-end dar baixa no estoque do tamanho certo!
        tamanho_escolhido: item.tamanho 
      }))
    };

    console.log("Enviando pedido:", dadosPedido);

    try {
      const resposta = await fetch(`${URL_BACKEND}/pedidos`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          // Se tiver Token de autenticação, adicione aqui:
          // "Authorization": `Bearer ${seuToken}`
        },
        body: JSON.stringify(dadosPedido)
      });

      const resultado = await resposta.json();

      if (resposta.ok) {
        //  SUCESSO!
        alert("✅ Pedido confirmado com sucesso! Verifique seu e-mail.");
        limparCarrinho(); // Zera o carrinho no Contexto
        setAberto(false);  // Fecha a barra lateral
      } else {
        //  Erro de Negócio (ex: Sem estoque para um tamanho)
        alert(`❌ Erro: ${resultado.erro || "Falha ao processar pedido."}`);
        console.error("Erro do servidor:", resultado);
      }
    } catch (error) {
      //  Erro de Conexão
      console.error("Erro ao finalizar:", error);
      alert("Erro na conexão com o servidor. Verifique se o Backend está rodando.");
    } finally {
      setCarregando(false);
    }
  };

  if (!aberto) return null;

  return (
    <div className={styles.overlay} onClick={() => setAberto(false)}>
      <aside className={styles.carrinho_container} onClick={(e) => e.stopPropagation()}>
        <div className={styles.topo}>
          <h2>Minha Sacola ({carrinho.length})</h2>
          <button className={styles.btn_fechar} onClick={() => setAberto(false)}>&times;</button>
        </div>

        <div className={styles.itens}>
          {carrinho.length === 0 ? (
            <p className={styles.vazio}>Sua sacola está vazia :(</p>
          ) : (
            carrinho.map((item) => (
              //  Chave única para React usando ID e Tamanho
              <div key={`${item.id}-${item.tamanho}`} className={styles.item_card}>
                <img src={`${URL_BACKEND}${item.imagem}`} alt={item.nome} />
                <div className={styles.item_info}>
                  <h3>{item.nome}</h3>
                  <p>Tam: <strong>{item.tamanho}</strong> | Qtd: <strong>{item.quantidade}</strong></p>
                  <span className={styles.preco}>
                    {(Number(item.preco) * item.quantidade).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </span>
                </div>
                <button 
                  className={styles.btn_remover} 
                  title="Remover item"
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