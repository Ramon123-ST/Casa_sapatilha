import React, { useState } from "react";
import styles from "./CadastroProduto.module.css";

export default function CadastroProduto() {
  const [produto, setProduto] = useState({
    nome: "",
    descricao: "",
    preco: "",
    categoria: "Sapatilha",
    imagem: ""
  });

  const [tamanhos, setTamanhos] = useState([
    { tamanho: 34, quantidade: 0 },
    { tamanho: 35, quantidade: 0 },
    { tamanho: 36, quantidade: 0 },
    { tamanho: 37, quantidade: 0 },
    { tamanho: 38, quantidade: 0 },
    { tamanho: 39, quantidade: 0 }
  ]);

  const handleTamanhoChange = (index, qtd) => {
    const novosTamanhos = [...tamanhos];
    novosTamanhos[index].quantidade = parseInt(qtd) || 0;
    setTamanhos(novosTamanhos);
  };

  const salvar = async (e) => {
    e.preventDefault();
    try {
      const resposta = await fetch("http://localhost:3000/produtos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...produto, estoques: tamanhos })
      });

      if (resposta.ok) {
        alert("Sapatilha cadastrada com sucesso! 🎉");
        window.location.reload(); // Recarrega para limpar
      }
    } catch (error) {
      alert("Erro ao cadastrar produto.");
    }
  };

  return (
    <div className={styles.container}>
      <h2>👟 Cadastrar Nova Sapatilha</h2>
      <form onSubmit={salvar}>
        <input type="text" placeholder="Nome do Modelo" onChange={(e) => setProduto({...produto, nome: e.target.value})} required />
        <input type="number" step="0.01" placeholder="Preço (ex: 99.90)" onChange={(e) => setProduto({...produto, preco: parseFloat(e.target.value)})} required />
        <input type="text" placeholder="URL da Imagem" onChange={(e) => setProduto({...produto, imagem: e.target.value})} />
        
        <div className={styles.grade}>
          <h3>Grade de Estoque (Ponto 11)</h3>
          {tamanhos.map((t, index) => (
            <div key={t.tamanho} className={styles.item_grade}>
              <label>Tam {t.tamanho}:</label>
              <input type="number" value={t.quantidade} onChange={(e) => handleTamanhoChange(index, e.target.value)} />
            </div>
          ))}
        </div>
        
        <button type="submit" className={styles.btn_salvar}>Salvar Produto</button>
      </form>
    </div>
  );
}