import React, { useState } from 'react';
import axios from 'axios';

const RedefinirSenha = ({ email }) => {
  const [codigo, setCodigo] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleRedefinir = async (e) => {
    e.preventDefault();
    setCarregando(true);
    try {
      const response = await axios.post('http://localhost:3000/redefinir-senha', {
        email,
        codigo,
        novaSenha
      });
      setMensagem(response.data.mensagem);
    } catch (error) {
      setMensagem(error.response?.data?.erro || "Código inválido ou expirado.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Criar Nova Senha</h2>
      <p>Enviamos um código para: <strong>{email}</strong></p>
      <form onSubmit={handleRedefinir}>
        <input 
          type="text" 
          placeholder="Código de 6 dígitos" 
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          required
          style={{ padding: '10px', width: '80%', marginBottom: '10px', textAlign: 'center', letterSpacing: '5px' }}
        />
        <input 
          type="password" 
          placeholder="Nova Senha" 
          value={novaSenha}
          onChange={(e) => setNovaSenha(e.target.value)}
          required
          style={{ padding: '10px', width: '80%', marginBottom: '10px' }}
        />
        <br />
        <button type="submit" disabled={carregando} style={{ padding: '10px 20px', background: '#28a745', color: '#fff', border: 'none', cursor: 'pointer' }}>
          {carregando ? 'Processando...' : 'Alterar Senha'}
        </button>
      </form>
      {mensagem && <p style={{ marginTop: '10px', color: '#28a745' }}>{mensagem}</p>}
    </div>
  );
};

export default RedefinirSenha;