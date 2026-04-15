import React from 'react';

export default function Enderecos() {
  return (
    <div style={{ padding: '40px', maxWidth: '1000px' }}>
      <h2 style={{ color: '#800020' }}>Meus Endereços</h2>
      <p style={{ color: '#666', marginBottom: '30px' }}>Cadastre seus endereços de entrega para facilitar suas compras.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '10px', position: 'relative' }}>
          <span style={{ fontSize: '0.7rem', backgroundColor: '#eee', padding: '3px 8px', borderRadius: '10px' }}>PRINCIPAL</span>
          <p style={{ marginTop: '10px' }}><strong>Casa</strong></p>
          <p style={{ fontSize: '0.9rem', color: '#444' }}>Rua Exemplo, 123 - Centro</p>
          <p style={{ fontSize: '0.9rem', color: '#444' }}>CEP: 00000-000 | São Paulo - SP</p>
          <div style={{ marginTop: '15px' }}>
            <button style={{ marginRight: '15px', background: 'none', border: 'none', color: '#800020', cursor: 'pointer' }}>Editar</button>
            <button style={{ background: 'none', border: 'none', color: '#cc0000', cursor: 'pointer' }}>Excluir</button>
          </div>
        </div>

        {/* Botão para Novo Endereço */}
        <div style={{ 
          border: '2px dashed #ddd', 
          borderRadius: '10px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          minHeight: '150px',
          cursor: 'pointer'
        }}>
          <p style={{ color: '#800020', fontWeight: 'bold' }}>+ Adicionar Endereço</p>
        </div>
      </div>
    </div>
  );
}