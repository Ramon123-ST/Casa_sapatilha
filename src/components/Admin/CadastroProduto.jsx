import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import styles from "./CadastroProduto.module.css";

export default function CadastroProduto() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [produto, setProduto] = useState({
    nome: "",
    descricao: "",
    preco: "",
    cor: "", 
    categoria_id: 1 
  });

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
  const [carregando, setCarregando] = useState(false);

  // --- LÓGICA DE EDIÇÃO: BUSCAR DADOS ---
  useEffect(() => {
    if (id) {
      const buscarProduto = async () => {
        try {
          const res = await fetch(`http://localhost:3000/produtos/${id}`);
          if (res.ok) {
            const dados = await res.json();
            setProduto({
              nome: dados.nome,
              descricao: dados.descricao,
              preco: dados.preco,
              cor: dados.cor,
              categoria_id: dados.categoria_id
            });
            if (dados.grade) setTamanhos(JSON.parse(dados.grade));
            if (dados.imagem) setImagemPreview(`http://localhost:3000/uploads/${dados.imagem}`);
          }
        } catch (error) {
          console.error("Erro ao carregar produto para edição", error);
        }
      };
      buscarProduto();
    }
  }, [id]);

  const handleTamanhoChange = (index, qtd) => {
    const novosTamanhos = [...tamanhos];
    novosTamanhos[index].quantidade = parseInt(qtd) || 0;
    setTamanhos(novosTamanhos);
  };

  const handleFoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArquivoFoto(file);
      setImagemPreview(URL.createObjectURL(file));
    }
  };

  const salvar = async (e) => {
    e.preventDefault();
    setCarregando(true);

    try {
      const formData = new FormData();
      formData.append("nome", produto.nome);
      formData.append("descricao", produto.descricao);
      formData.append("preco", produto.preco);
      formData.append("cor", produto.cor);
      formData.append("grade", JSON.stringify(tamanhos));
      
      if (arquivoFoto) {
        formData.append("imagemFile", arquivoFoto);
      }

      const url = id 
        ? `http://localhost:3000/produtos/editar/${id}` 
        : "http://localhost:3000/produtos/cadastrar";
      
      const metodo = id ? "PUT" : "POST";

      const resposta = await fetch(url, {
        method: metodo,
        body: formData, 
      });

      if (resposta.ok) {
        alert(id ? "Sapatilha atualizada! ✨" : "Sapatilha cadastrada! 🎉");
        navigate("/admin/pedidos"); // Redireciona para a lista após salvar
      } else {
        const erro = await resposta.json();
        alert("Erro: " + erro.erro);
      }
    } catch (error) {
      alert("Erro ao conectar com o servidor.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card_cadastro}>
        <h2>{id ? "🔄 Editar Sapatilha" : "👟 Nova Sapatilha"}</h2>
        <p className={styles.subtitulo}>
            {id ? `Editando o produto ID: ${id}` : "Preencha todos os campos seguindo os padrões da loja."}
        </p>

        <form onSubmit={salvar} className={styles.formulario}>
          <div className={styles.colunas}>
            
            <div className={styles.lado_dados}>
              <div className={styles.grupo}>
                <label>Nome do Modelo</label>
                <input 
                    type="text" 
                    value={produto.nome} 
                    placeholder="Ex: Sapatilha Comfort Black" 
                    onChange={(e) => setProduto({...produto, nome: e.target.value})} 
                    required 
                />
              </div>

              <div className={styles.dupla}>
                <div className={styles.grupo}>
                  <label>Preço Venda</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    value={produto.preco} 
                    placeholder="99.90" 
                    onChange={(e) => setProduto({...produto, preco: e.target.value})} 
                    required 
                  />
                </div>
                <div className={styles.grupo}>
                  <label>Cor</label>
                  <input 
                    type="text" 
                    value={produto.cor} 
                    placeholder="Ex: Nude Verniz" 
                    onChange={(e) => setProduto({...produto, cor: e.target.value})} 
                    required 
                  />
                </div>
              </div>

              <div className={styles.grupo}>
                <label>Descrição Curta</label>
                <textarea 
                    rows="3" 
                    value={produto.descricao} 
                    placeholder="Detalhes do material..." 
                    onChange={(e) => setProduto({...produto, descricao: e.target.value})}
                ></textarea>
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

          <h3>📦 Grade de Estoque</h3>
          <div className={styles.grade}>
            {tamanhos.map((t, index) => (
              <div key={t.tamanho} className={styles.item_grade}>
                <span className={styles.label_tam}>{t.tamanho}</span>
                <input 
                    type="number" 
                    value={t.quantidade} 
                    onChange={(e) => handleTamanhoChange(index, e.target.value)} 
                    min="0" 
                />
              </div>
            ))}
          </div>

          <button type="submit" className={styles.btn_salvar} disabled={carregando}>
            {carregando ? "Salvando..." : id ? "Salvar Alterações" : "Finalizar Cadastro"}
          </button>
        </form>
      </div>
    </div>
  );
}