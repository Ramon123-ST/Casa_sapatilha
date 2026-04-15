import React, { useState } from 'react';
import styles from './Perfil.module.css';

export default function Pedidos() {
  const [abaAtiva, setAbaAtiva] = useState('todos');

  const pedidos = [
  ];

  const pedidosFiltrados = pedidos.filter(p => 
    abaAtiva === 'todos' ? true : p.status === abaAtiva
  );

  const abas = [
    { id: 'todos', label: 'Todos' },
    { id: 'caminho', label: 'A Caminho' },
    { id: 'finalizado', label: 'Finalizados' },
    { id: 'cancelado', label: 'Cancelados' }
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.titulo}>Meus Pedidos</h1>
      
      {/* Menu de Abas */}
      <div className={styles.menu_abas}>
        {abas.map(aba => (
          <button
            key={aba.id}
            className={abaAtiva === aba.id ? styles.aba_item_ativo : styles.aba_item}
            onClick={() => setAbaAtiva(aba.id)}
          >
            {aba.label}
          </button>
        ))}
      </div>

      <div className={styles.corpo_pedidos}>
        {pedidosFiltrados.length > 0 ? (
          <div className={styles.lista_pedidos}>
          </div>
        ) : (
          <div className={styles.conteudo_vazio}>
            <p>Nenhum pedido encontrado em <strong>{abas.find(a => a.id === abaAtiva).label}</strong>.</p>
            <button className={styles.botao_perfil}>Explorar Loja</button>
          </div>
        )}
      </div>
    </div>
  );
}