import React, { useState, useEffect } from "react";
import styles from "./GerenciarProdutos.module.css";

export default function GerenciarProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [novoProduto, setNovoProduto] = useState({
    nome: "", 
    preco: "", 
    categoria: "Sapatilha", 
    cor: "", 
    descricao: "", 
    imagem: ""
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

  const handleImagemLocal = (e) => {
    const arquivo = e.target.files[0];
    if (arquivo) {
      const leitor = new FileReader();
      leitor.onloadend = () => {
        setNovoProduto({ ...novoProduto, imagem: leitor.result });
      };
      leitor.readAsDataURL(arquivo);
    }
  };

  const prepararEdicao = (produto) => {
    setEditandoId(produto.id);
    setNovoProduto({
      nome: produto.nome,
      preco: produto.preco,
      categoria: produto.categoria || "Sapatilha",
      cor: produto.cor || "",
      descricao: produto.descricao || "",
      imagem: produto.imagem
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const limparFormulario = () => {
    setEditandoId(null);
    setNovoProduto({ nome: "", preco: "", categoria: "Sapatilha", cor: "", descricao: "", imagem: "" });
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    const url = editandoId 
      ? `http://localhost:3000/produtos/${editandoId}` 
      : "http://localhost:3000/produtos";
    
    const metodo = editandoId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoProduto)
      });

      if (res.ok) {
        alert(editandoId ? "✅ Produto atualizado!" : "✅ Produto salvo!");
        limparFormulario();
        carregarProdutos();
      }
    } catch (error) {
      alert("❌ Erro ao processar operação");
    }
  };

  return (
    <div className={styles.container}>
      <h2>{editandoId ? "🔄 Editar Sapatilha" : "🚀 Cadastrar Nova Sapatilha"}</h2>
      
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
          placeholder="Preço (Ex: 129.90)" 
          value={novoProduto.preco}
          onChange={e => setNovoProduto({...novoProduto, preco: e.target.value})} 
          required 
        />
        <input 
          type="text" 
          placeholder="Cor (Ex: Rosé, Preto, Verniz)" 
          value={novoProduto.cor}
          onChange={e => setNovoProduto({...novoProduto, cor: e.target.value})} 
          required 
        />
        
        {/* Campo de Descrição ocupando mais espaço se necessário no CSS */}
        <textarea 
          placeholder="Descrição detalhada do produto..." 
          value={novoProduto.descricao}
          className={styles.campoDescricao}
          onChange={e => setNovoProduto({...novoProduto, descricao: e.target.value})} 
        />

        <div className={styles.uploadContainer}>
          <label htmlFor="input-foto">📸 Selecionar Foto do Aparelho</label>
          <input 
            id="input-foto"
            type="file" 
            accept="image/*"
            onChange={handleImagemLocal} 
          />
          {novoProduto.imagem && (
            <div className={styles.previewContainer}>
              <img src={novoProduto.imagem} alt="Preview" className={styles.fotoPreview} />
              <p>Imagem selecionada!</p>
            </div>
          )}
        </div>
        
        <div className={styles.grupoBotoes}>
          <button type="submit" className={styles.btnSalvar}>
            {editandoId ? "Atualizar Produto" : "Salvar Produto"}
          </button>
          {editandoId && (
            <button type="button" onClick={limparFormulario} className={styles.btnCancelar}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      <hr />

      <h2>📦 Gestão de Estoque</h2>
      <div className={styles.tabelaContainer}>
        <table className={styles.tabela}>
          <thead>
            <tr>
              <th>Foto</th>
              <th>Nome</th>
              <th>Cor</th>
              <th>Preço</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map(p => (
              <tr key={p.id}>
                <td><img src={p.imagem} className={styles.fotoProduto} alt={p.nome} /></td>
                <td>
                  <strong>{p.nome}</strong>
                  <p style={{fontSize: '12px', color: '#666'}}>{p.descricao?.substring(0, 30)}...</p>
                </td>
                <td>{p.cor}</td>
                <td>R$ {p.preco}</td>
                <td>
                  <div className={styles.acoes}>
                    <button className={styles.btnEditar} onClick={() => prepararEdicao(p)}>Editar</button>
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