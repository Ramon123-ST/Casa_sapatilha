import React, { useState } from "react";
import styles from "./Admin.module.css";

export default function Admin() {
  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    preco: "",
    estoque: 10,
    imagem: "", // Aqui você vai digitar apenas o nome da foto, ex: r10.webp
    categoria_id: 1
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ajustamos o caminho da imagem automaticamente
    const dadosComCaminho = {
      ...form,
      imagem: `/img/${form.imagem}`
    };

    try {
      const resposta = await fetch("http://localhost:3000/produtos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosComCaminho)
      });

      if (resposta.ok) {
        alert("✅ Sapatilha cadastrada com sucesso!");
        window.location.href = "/"; // Volta para a home para ver o produto novo
      }
    } catch (error) {
      console.error("Erro na conexão:", error);
    }
  };

  return (
    <div className={styles.admin_container}>
      <h2 className={styles.titulo}>Painel do Administrador</h2>
      <form onSubmit={handleSubmit} className={styles.formulario}>
        <input type="text" placeholder="Nome da Sapatilha" required onChange={e => setForm({...form, nome: e.target.value})} />
        <input type="text" placeholder="Descrição" onChange={e => setForm({...form, descricao: e.target.value})} />
        <input type="number" step="0.01" placeholder="Preço (Ex: 99.90)" required onChange={e => setForm({...form, preco: e.target.value})} />
        <input type="text" placeholder="Nome da imagem (Ex: sapatilha9.jpg)" required onChange={e => setForm({...form, imagem: e.target.value})} />
        <button type="submit" className={styles.botao_salvar}>CADASTRAR PRODUTO</button>
      </form>
    </div>
  );
}