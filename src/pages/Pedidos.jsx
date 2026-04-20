import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Perfil.module.css';

export default function Pedidos() {
  const navigate = useNavigate();
  const [abaAtiva, setAbaAtiva] = useState('todos');
  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const API_URL = 'http://localhost:3000';

  useEffect(() => {
    const buscarPedidos = async () => {
      try {
        setErro(null);
        const response = await fetch(`${API_URL}/pedidos/meus-pedidos`);
        
        if (!response.ok) throw new Error('Não foi possível carregar seus pedidos.');
        
        const data = await response.json();
        setPedidos(data);
      } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
        setErro("Não conseguimos conectar ao servidor. Verifique se o seu backend está rodando na porta 3000.");
      } finally {
        setCarregando(false);
      }
    };

    buscarPedidos();
  }, []);

  const abas = [
    { id: 'todos', label: 'Todos' },
    { id: 'caminho', label: 'A Caminho' },
    { id: 'finalizado', label: 'Finalizados' },
    { id: 'cancelado', label: 'Cancelados' }
  ];

  const pedidosFiltrados = pedidos.filter(p => {
    const status = p.status?.toLowerCase();
    if (abaAtiva === 'todos') return true;
    if (abaAtiva === 'caminho') return status === 'enviado';
    if (abaAtiva === 'finalizado') return status === 'pago' || status === 'entregue' || status === 'finalizado';
    if (abaAtiva === 'cancelado') return status === 'cancelado';
    return true;
  });

  if (carregando) {
    return (
      <div className={styles.container}>
        <div className={styles.loader}>Carregando seus pedidos...</div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className={styles.container} style={{ textAlign: 'center' }}>
        <p className={styles.erro_mensagem} style={{ color: '#800020', fontWeight: 'bold' }}>{erro}</p>
        <button onClick={() => window.location.reload()} className={styles.botao_perfil}>
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.titulo}>Meus Pedidos</h1>
      
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
            {pedidosFiltrados.map(pedido => (
              <div key={pedido.id} className={styles.card_pedido}>
                <div className={styles.pedido_header}>
                  <span>Pedido <strong>#{pedido.id}</strong></span>
                  <span className={`${styles.status_badge} ${styles[`status_${pedido.status?.toLowerCase()}`]}`}>
                    {pedido.status}
                  </span>
                </div>
                
                <div className={styles.itens_container}>
                  {pedido.itens_pedido?.map(item => (
                    <div key={item.id} className={styles.item_produto}>
                      <img 
                        // Ajustado para buscar na pasta /img do seu servidor v2.0
                        src={item.produto?.imagem ? `${API_URL}/img/${item.produto.imagem}` : '/placeholder.png'} 
                        alt={item.produto?.nome} 
                        className={styles.foto_sapatilha_mini} 
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/80?text=Sapatilha'; }}
                      />
                      <div className={styles.item_info}>
                        <p className={styles.produto_nome}>{item.produto?.nome || 'Produto Indisponível'}</p>
                        <p className={styles.produto_meta}>Tam: {item.tamanho_escolhido} | Qtd: {item.quantidade}</p>
                      </div>
                      <span className={styles.item_preco}>
                        R$ {Number(item.preco_unitario || 0).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className={styles.pedido_footer}>
                  <div className={styles.total_container}>
                    <span>Total do Pedido</span>
                    <strong className={styles.total_valor}>R$ {Number(pedido.total_geral || 0).toFixed(2)}</strong>
                  </div>
                  <button 
                    className={styles.botao_detalhes}
                    onClick={() => navigate(`/pedido/${pedido.id}`)}
                  >
                    Ver Detalhes
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.conteudo_vazio}>
            <div className={styles.icone_vazio}></div>
            <p>Nenhum pedido encontrado em <strong>{abas.find(a => a.id === abaAtiva).label}</strong>.</p>
            <button className={styles.botao_perfil} onClick={() => navigate('/')}>
              Explorar Loja
            </button>
          </div>
        )}
      </div>
    </div>
  );
}