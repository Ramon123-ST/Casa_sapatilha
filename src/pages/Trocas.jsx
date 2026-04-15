import React from 'react';

export default function Trocas() {
  return (
    <div style={{ padding: '40px', maxWidth: '1000px' }}>
      <h2 style={{ color: '#800020' }}>Trocas e Devoluções</h2>
      <div style={{ 
        backgroundColor: '#fff4f4', 
        padding: '20px', 
        borderRadius: '8px', 
        borderLeft: '5px solid #800020',
        marginTop: '20px' 
      }}>
        <p><strong>Atenção:</strong> Você tem até 30 dias após o recebimento para solicitar uma troca grátis.</p>
      </div>

      <div style={{ marginTop: '30px' }}>
        <p style={{ color: '#666' }}>Nenhuma solicitação de troca em andamento.</p>
        <button style={{ 
          marginTop: '20px',
          padding: '12px 25px',
          backgroundColor: '#800020',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}>
          Solicitar Nova Troca
        </button>
      </div>
    </div>
  );
}