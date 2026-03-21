import React, { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  // Carrega o carrinho do localStorage ao iniciar, ou começa vazio
  const [carrinho, setCarrinho] = useState(() => {
    const salvo = localStorage.getItem("@CasaDaSapatilha:carrinho");
    return salvo ? JSON.parse(salvo) : [];
  });

  // Salva no localStorage toda vez que o carrinho mudar
  useEffect(() => {
    localStorage.setItem("@CasaDaSapatilha:carrinho", JSON.stringify(carrinho));
  }, [carrinho]);

  // Função para adicionar produto
  const adicionarAoCarrinho = (produto, tamanho) => {
    setCarrinho((prev) => {
      const existe = prev.find((item) => item.id === produto.id && item.tamanho === tamanho);
      
      if (existe) {
        return prev.map((item) =>
          item.id === produto.id && item.tamanho === tamanho
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      }
      return [...prev, { ...produto, tamanho, quantidade: 1 }];
    });
  };

  // Função para remover produto completamente
  const removerDoCarrinho = (id, tamanho) => {
    setCarrinho((prev) => prev.filter((item) => !(item.id === id && item.tamanho === tamanho)));
  };

  // ✅ NOVO: Função para diminuir quantidade (sem remover tudo)
  const diminuirQuantidade = (id, tamanho) => {
    setCarrinho((prev) => 
      prev.map((item) => 
        item.id === id && item.tamanho === tamanho && item.quantidade > 1
          ? { ...item, quantidade: item.quantidade - 1 }
          : item
      )
    );
  };

  // ✅ NOVO: Cálculos automáticos
  const valorTotal = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
  const quantidadeTotal = carrinho.reduce((acc, item) => acc + item.quantidade, 0);

  return (
    <CartContext.Provider value={{ 
      carrinho, 
      adicionarAoCarrinho, 
      removerDoCarrinho, 
      diminuirQuantidade,
      valorTotal,
      quantidadeTotal 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);