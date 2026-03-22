import React, { useState } from "react";
import styles from "./Admin.module.css";

export default function Admin() {
  const [form, setForm] = useState({
    nome: "",
    preco: "",
    cor: "",
    status: "ativo", // Ponto 3 e 5 (Status/Soft Delete)
    imagem: ""
  });

  // Estado para gerenciar as variações de tamanho (Ponto 1: Estoque Crítico)
  const [estoqueVariado, setEstoqueVariado] = useState([
    { tamanho: 34, quantidade: 0 },
    { tamanho: 35, quantidade: 0 },
    { tamanho: 36, quantidade: 0 },
    { tamanho: 37, quantidade: 0 },
    { tamanho: 38, quantidade: 0 },
    { tamanho: 39, quantidade: 0 },
    { tamanho: 40, quantidade: 0 }
  ]);

  // Atualiza a quantidade de um tamanho específico
  const handleEstoqueChange = (tamanho, valor) => {
    setEstoqueVariado(prev => 
      prev.map(item => item.tamanho === tamanho ? { ...item, quantidade: parseInt(valor) || 0 } : item)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Montando o objeto final para o Backend (Ponto 1 e 3)
    const produtoCompleto = {
      ...form,
      preco: parseFloat(form.preco),
      imagem: `/img/${form.imagem}`,
      variacoes: estoqueVariado // Enviamos o array de tamanhos e quantidades
    };

    try {
      const resposta = await fetch("http://localhost:3000/produtos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(produtoCompleto)
      });

      if (resposta.ok) {
        alert("✅ Produto e Estoque configurados com sucesso!");
        // Em vez de window.location, podemos resetar o form para cadastrar outro
        setForm({ nome: "", preco: "", cor: "", status: "ativo", imagem: "" });
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  };

  return (
    <div className={styles.admin_container}>
      <header className={styles.admin_header}>
        <h2>Gestão Casa da Sapatilha</h2>
        <span className={styles.badge_adm}>Painel Master</span>
      </header>

      <form onSubmit={handleSubmit} className={styles.formulario}>
        <section className={styles.secao_principal}>
          <h3>1. Dados Básicos</h3>
          <div className={styles.grid_inputs}>
            <input type="text" placeholder="Nome do Modelo" required 
              value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} />
            
            <input type="number" step="0.01" placeholder="Preço de Venda" required 
              value={form.preco} onChange={e => setForm({...form, preco: e.target.value})} />
            
            <input type="text" placeholder="Cor Principal" 
              value={form.cor} onChange={e => setForm({...form, cor: e.target.value})} />

            <input type="text" placeholder="Nome da Imagem (ex: nike-air.webp)" 
              value={form.imagem} onChange={e => setForm({...form, imagem: e.target.value})} />
          </div>
        </section>

        <section className={styles.secao_estoque}>
          <h3>2. Controle de Estoque por Tamanho (Crítico)</h3>
          <div className={styles.grid_estoque}>
            {estoqueVariado.map((item) => (
              <div key={item.tamanho} className={styles.item_estoque}>
                <label>Tam. {item.tamanho}</label>
                <input 
                  type="number" 
                  min="0" 
                  value={item.quantidade} 
                  onChange={(e) => handleEstoqueChange(item.tamanho, e.target.value)}
                />
              </div>
            ))}
          </div>
        </section>

        <button type="submit" className={styles.botao_salvar}>
          FINALIZAR CADASTRO E GERAR ESTOQUE
        </button>
      </form>
    </div>
  );
}