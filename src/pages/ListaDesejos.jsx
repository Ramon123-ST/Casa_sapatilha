import React from 'react';

export default function ListaDesejos() {
  const favoritos = []; 

  return (
    <div style={{ padding: '40px', maxWidth: '1000px' }}>
      <h2 style={{ color: '#800020' }}>Minha Lista de Desejos</h2>
      
      {favoritos.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <p style={{ fontSize: '1.2rem', color: '#666' }}>Sua lista está vazia.</p>
          <p>Salve suas sapatilhas favoritas para vê-las aqui!</p>
          <a href="/" style={{ color: '#800020', fontWeight: 'bold' }}>Voltar para a loja</a>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {/* Mapeamento dos produtos favoritados aqui */}
        </div>
      )}
    </div>
  );
}