import React, { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [carrinho, setCarrinho] = useState(() => {
    const salvo = localStorage.getItem("@CasaDaSapatilha:carrinho");
    return salvo ? JSON.parse(salvo) : [];
  });

  useEffect(() => {
    localStorage.setItem("@CasaDaSapatilha:carrinho", JSON.stringify(carrinho));
  }, [carrinho]);

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

  const removerDoCarrinho = (id, tamanho) => {
    setCarrinho((prev) => prev.filter((item) => !(item.id === id && item.tamanho === tamanho)));
  };

  const diminuirQuantidade = (id, tamanho) => {
    setCarrinho((prev) => 
      prev.map((item) => 
        item.id === id && item.tamanho === tamanho && item.quantidade > 1
          ? { ...item, quantidade: item.quantidade - 1 }
          : item
      )
    );
  };

  // ✅ PONTO 6 e 2: Limpar o carrinho após finalizar o pedido no banco
  const limparCarrinho = () => {
    setCarrinho([]);
    localStorage.removeItem("@CasaDaSapatilha:carrinho");
  };

  const valorTotal = carrinho.reduce((acc, item) => acc + (Number(item.preco) * item.quantidade), 0);
  const quantidadeTotal = carrinho.reduce((acc, item) => acc + item.quantidade, 0);

  return (
    <CartContext.Provider value={{ 
      carrinho, 
      adicionarAoCarrinho, 
      removerDoCarrinho, 
      diminuirQuantidade,
      limparCarrinho, // Exportando a nova função
      valorTotal,
      quantidadeTotal 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);