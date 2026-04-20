import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Perfil.module.css'; 

export default function ListaDesejos() {
  const [favoritos, setFavoritos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // 1. Busca os dados da Wishlist no Backend
  useEffect(() => {
    const carregarFavoritos = async () => {
      try {
        const response = await fetch('http://localhost:3333/wishlist/meus-favoritos');
        const data = await response.json();
        setFavoritos(data);
      } catch (error) {
        console.error("Erro ao carregar lista de desejos:", error);
      } finally {
        setCarregando(false);
      }
    };

    carregarFavoritos();
  }, []);

  // 2. Função para remover item da lista 
  const removerFavorito = async (id) => {
    
    setFavoritos(favoritos.filter(item => item.id !== id));
  };

  if (carregando) {
    return <div className={styles.container}><p>Carregando seus favoritos...</p></div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.titulo} style={{ color: '#800020', marginBottom: '20px' }}>
        Minha Lista de Desejos
      </h2>
      
      {favoritos.length === 0 ? (
        <div className={styles.conteudo_vazio} style={{ textAlign: 'center', marginTop: '50px' }}>
          <p style={{ fontSize: '1.2rem', color: '#666' }}>Sua lista está vazia.</p>
          <p>Salve suas sapatilhas favoritas para vê-las aqui!</p>
          <Link to="/" className={styles.botao_perfil} style={{ display: 'inline-block', marginTop: '20px', textDecoration: 'none' }}>
            Voltar para a loja
          </Link>
        </div>
      ) : (
        <div className={styles.grid_favoritos} style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
          gap: '20px' 
        }}>
          {favoritos.map((fav) => (
            <div key={fav.id} className={styles.card_produto} style={{
              border: '1px solid #eee',
              borderRadius: '8px',
              padding: '15px',
              textAlign: 'center',
              backgroundColor: '#fff',
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
            }}>
              <img 
                src={fav.produto.imagem} 
                alt={fav.produto.nome} 
                style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '5px' }} 
              />
              <h3 style={{ fontSize: '1rem', margin: '10px 0' }}>{fav.produto.nome}</h3>
              <p style={{ fontWeight: 'bold', color: '#800020', fontSize: '1.1rem' }}>
                R$ {parseFloat(fav.produto.preco).toFixed(2)}
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
                <button className={styles.botao_perfil} style={{ width: '100%', padding: '8px' }}>
                  Ver Produto
                </button>
                <button 
                  onClick={() => removerFavorito(fav.id)}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: '#999', 
                    cursor: 'pointer',
                    fontSize: '0.9rem' 
                  }}
                >
                  Remover da lista
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}