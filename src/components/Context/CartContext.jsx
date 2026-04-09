import React, { createContext, useState, useContext } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [carrinho, setCarrinho] = useState([]);

  // Função para adicionar produto
  const adicionarAoCarrinho = (produto, tamanho) => {
    setCarrinho((prev) => {
      // Verifica se o mesmo produto com o mesmo tamanho já está no carrinho
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

  // Função para remover produto
  const removerDoCarrinho = (id, tamanho) => {
    setCarrinho((prev) => prev.filter((item) => !(item.id === id && item.tamanho === tamanho)));
  };

  return (
    <CartContext.Provider value={{ carrinho, adicionarAoCarrinho, removerDoCarrinho }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);