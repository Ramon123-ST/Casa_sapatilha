import React, { useState, useRef } from "react";
import styles from "./CadastroProduto.module.css";

export default function CadastroProduto() {
  const fileInputRef = useRef(null);
  
  // 1. Estado do Produto 
  const [produto, setProduto] = useState({
    nome: "",
    descricao: "",
    preco: "",
    cor: "", 
    categoria_id: 1 
  });

  // 2. Grade de Estoque 
  const [tamanhos, setTamanhos] = useState([
    { tamanho: "34", quantidade: 0 },
    { tamanho: "35", quantidade: 0 },
    { tamanho: "36", quantidade: 0 },
    { tamanho: "37", quantidade: 0 },
    { tamanho: "38", quantidade: 0 },
    { tamanho: "39", quantidade: 0 }
  ]);

  const [imagemPreview, setImagemPreview] = useState(null);
  const [arquivoFoto, setArquivoFoto] = useState(null);

  // Manipular mudanças na grade
  const handleTamanhoChange = (index, qtd) => {
    const novosTamanhos = [...tamanhos];
    novosTamanhos[index].quantidade = parseInt(qtd) || 0;
    setTamanhos(novosTamanhos);
  };

  // Manipular seleção de foto (Direto para galeria/pastas)
  const handleFoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArquivoFoto(file);
      setImagemPreview(URL.createObjectURL(file)); // Gera o preview visual
    }
  };

  const salvar = async (e) => {
    e.preventDefault();

    if (!arquivoFoto) {
      alert("Por favor, selecione uma foto da sapatilha.");
      return;
    }

    try {
      // Usei FormData para enviar arquivo + texto
      const formData = new FormData();
      formData.append("nome", produto.nome);
      formData.append("descricao", produto.descricao);
      formData.append("preco", produto.preco);
      formData.append("cor", produto.cor);
      formData.append("imagemFile", arquivoFoto); // Envia o arquivo real
      formData.append("grade", JSON.stringify(tamanhos)); // Envia a grade como string JSON

      const resposta = await fetch("http://localhost:3000/produtos/cadastrar", {
        method: "POST",
        body: formData, 
      });

      if (resposta.ok) {
        alert("Sapatilha cadastrada com sucesso! 🎉");
        window.location.reload();
      } else {
        const erro = await resposta.json();
        alert("Erro: " + erro.erro);
      }
    } catch (error) {
      alert("Erro ao conectar com o servidor.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card_cadastro}>
        <h2>👟 Gestão de Estoque: Nova Sapatilha</h2>
        <p className={styles.subtitulo}>Preencha todos os campos seguindo os padrões da loja.</p>

        <form onSubmit={salvar} className={styles.formulario}>
          <div className={styles.colunas}>
            
            {/* Lado Esquerdo: Dados */}
            <div className={styles.lado_dados}>
              <div className={styles.grupo}>
                <label>Nome do Modelo</label>
                <input type="text" placeholder="Ex: Sapatilha Comfort Black" onChange={(e) => setProduto({...produto, nome: e.target.value})} required />
              </div>

              <div className={styles.dupla}>
                <div className={styles.grupo}>
                  <label>Preço Venda</label>
                  <input type="number" step="0.01" placeholder="99.90" onChange={(e) => setProduto({...produto, preco: e.target.value})} required />
                </div>
                <div className={styles.grupo}>
                  <label>Cor (Ponto 24)</label>
                  <input type="text" placeholder="Ex: Nude Verniz" onChange={(e) => setProduto({...produto, cor: e.target.value})} required />
                </div>
              </div>

              <div className={styles.grupo}>
                <label>Descrição Curta</label>
                <textarea rows="3" placeholder="Detalhes do material e conforto..." onChange={(e) => setProduto({...produto, descricao: e.target.value})}></textarea>
              </div>
            </div>

            <div className={styles.lado_foto}>
              <label>Foto do Produto</label>
              <div className={styles.preview_container} onClick={() => fileInputRef.current.click()}>
                {imagemPreview ? (
                  <img src={imagemPreview} alt="Preview" className={styles.foto_preview} />
                ) : (
                  <div className={styles.placeholder_foto}>
                    <span>+ Clique para buscar na galeria</span>
                  </div>
                )}
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFoto} accept="image/*" className={styles.input_escondido} />
            </div>
          </div>

          <hr className={styles.divisor} />

          {/* Grade de Estoque Centralizada */}
          <h3>📦 Grade de Estoque (Ponto 11)</h3>
          <div className={styles.grade}>
            {tamanhos.map((t, index) => (
              <div key={t.tamanho} className={styles.item_grade}>
                <span className={styles.label_tam}>{t.tamanho}</span>
                <input type="number" value={t.quantidade} onChange={(e) => handleTamanhoChange(index, e.target.value)} min="0" />
              </div>
            ))}
          </div>

          <button type="submit" className={styles.btn_salvar}>Finalizar Cadastro no Banco</button>
        </form>
      </div>
    </div>
  );
}