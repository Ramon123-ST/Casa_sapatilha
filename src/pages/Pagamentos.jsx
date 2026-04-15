import React from 'react';
import styles from './Perfil.module.css';

export default function Pagamentos() {
  return (
    <div style={{ padding: '40px', maxWidth: '1000px' }}>
      <h2 style={{ color: '#800020' }}>Formas de Pagamento</h2>
      <p className={styles.silenciado}>Gerencie seus cartões e opções de faturamento.</p>
      
      <div style={{ display: 'grid', gap: '20px', marginTop: '30px' }}>
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p><strong>Visa</strong> final 4242</p>
            <p style={{ fontSize: '0.8rem', color: '#666' }}>Expira em 12/28</p>
          </div>
          <button style={{ color: '#800020', background: 'none', border: 'none', cursor: 'pointer' }}>Remover</button>
        </div>

        <button style={{ 
          border: '2px dashed #800020', 
          padding: '20px', 
          borderRadius: '12px', 
          background: 'none', 
          color: '#800020', 
          fontWeight: 'bold',
          cursor: 'pointer' 
        }}>
          + Adicionar Novo Cartão
        </button>
      </div>
    </div>
  );
}