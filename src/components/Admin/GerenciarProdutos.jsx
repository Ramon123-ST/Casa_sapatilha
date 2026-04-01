import React, { useState, useEffect } from "react";
import styles from "./GerenciarProdutos.module.css";

export default function GerenciarProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [novoProduto, setNovoProduto] = useState({
    nome: "", preco: "", categoria: "Sapatilha", imagem: "", descricao: ""
  });

  const carregarProdutos = async () => {
    try {
      const res = await fetch("http://localhost:3000/produtos");
      const dados = await res.json();
      setProdutos(dados);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    }
  };

  useEffect(() => { carregarProdutos(); }, []);

  const handleSalvar = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/produtos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoProduto)
      });

      if (res.ok) {
        alert("✅ Produto salvo com sucesso!");
        // Limpa os campos após salvar
        setNovoProduto({ nome: "", preco: "", categoria: "Sapatilha", imagem: "", descricao: "" });
        carregarProdutos();
      }
    } catch (error) {
      alert("❌ Erro ao salvar produto");
    }
  };

  const handleDesativar = async (id) => {
    if (window.confirm("Deseja realmente desativar este produto da vitrine?")) {
      try {
        await fetch(`http://localhost:3000/produtos/${id}`, { method: "DELETE" });
        carregarProdutos(); // Atualiza a lista
      } catch (error) {
        console.error("Erro ao desativar:", error);
      }
    }
  };

  return (
    <div className={styles.container}>
      <h2>🚀 Cadastrar Nova Sapatilha</h2>
      <form onSubmit={handleSalvar} className={styles.formulario}>
        <input 
          type="text" 
          placeholder="Nome do Modelo" 
          value={novoProduto.nome}
          onChange={e => setNovoProduto({...novoProduto, nome: e.target.value})} 
          required 
        />
        <input 
          type="number" 
          placeholder="Preço (Ex: 159.90)" 
          value={novoProduto.preco}
          onChange={e => setNovoProduto({...novoProduto, preco: e.target.value})} 
          required 
        />
        <input 
          type="text" 
          placeholder="URL da Foto" 
          value={novoProduto.imagem}
          onChange={e => setNovoProduto({...novoProduto, imagem: e.target.value})} 
          required 
        />
        <button type="submit" className={styles.btnSalvar}>Salvar Produto</button>
      </form>

      <hr />

      <h2>📦 Seus Produtos em Linha</h2>
      <div className={styles.tabelaContainer}>
        <table className={styles.tabela}>
          <thead>
            <tr>
              <th>Foto</th>
              <th>Nome</th>
              <th>Preço</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map(p => (
              <tr key={p.id}>
                <td><img src={p.imagem} className={styles.fotoProduto} alt={p.nome} /></td>
                <td>{p.nome}</td>
                <td>
                  {Number(p.preco).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </td>
                <td>
                  <div className={styles.acoes}>
                    <button className={styles.btnEditar}>Editar</button>
                    <button 
                      className={styles.btnDesativar} 
                      onClick={() => handleDesativar(p.id)}
                    >
                      Desativar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}