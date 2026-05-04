import React, { useState } from 'react';
import axios from 'axios';

const EsqueciSenha = ({ aoEnviarSucesso }) => {
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);
    try {
      const response = await axios.post('http://localhost:3000/recuperar-senha', { email });
      setMensagem(response.data.mensagem);
      setTimeout(() => aoEnviarSucesso(email), 2000);
    } catch (error) {
      setMensagem(error.response?.data?.erro || "Erro ao solicitar recuperação.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Recuperar Senha</h2>
      <p>Digite seu e-mail para receber um código de verificação.</p>
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          placeholder="Seu e-mail cadastrado" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: '10px', width: '80%', marginBottom: '10px' }}
        />
        <br />
        <button type="submit" disabled={carregando} style={{ padding: '10px 20px', background: '#d63384', color: '#fff', border: 'none', cursor: 'pointer' }}>
          {carregando ? 'Enviando...' : 'Enviar Código'}
        </button>
      </form>
      {mensagem && <p style={{ marginTop: '10px', color: '#d63384' }}>{mensagem}</p>}
    </div>
  );
};

export default EsqueciSenha;