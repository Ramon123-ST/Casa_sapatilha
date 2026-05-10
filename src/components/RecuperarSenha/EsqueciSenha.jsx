import React, { useState } from 'react';
import axios from 'axios';
import './EsqueciSenha.css';

const EsqueciSenha = ({ aoEnviarSucesso }) => {
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setCarregando(true);
    setMensagem('');

    try {
      const response = await axios.post(
        'http://localhost:3000/recuperar-senha',
        {
          email: email.trim().toLowerCase(),
        }
      );

      setMensagem(
        response.data.mensagem || 'Código enviado com sucesso!'
      );

      setTimeout(() => {
        if (aoEnviarSucesso) {
          aoEnviarSucesso(email.trim().toLowerCase());
        }
      }, 2000);

    } catch (error) {
      const erroMsg =
        error.response?.data?.erro ||
        'Erro ao solicitar recuperação.';

      setMensagem(erroMsg);

    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="esqueci-container">
      <h2 className="esqueci-titulo">Recuperar Senha</h2>

      <p className="esqueci-texto">
        Digite seu e-mail para receber um código de verificação.
      </p>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Seu e-mail cadastrado"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="esqueci-input"
        />

        <button
          type="submit"
          disabled={carregando}
          className="esqueci-btn"
        >
          {carregando ? 'Enviando...' : 'Enviar Código'}
        </button>
      </form>

      {mensagem && (
        <p
          className={`esqueci-mensagem ${
            mensagem.toLowerCase().includes('erro')
              ? 'esqueci-erro'
              : 'esqueci-sucesso'
          }`}
        >
          {mensagem}
        </p>
      )}
    </div>
  );
};

export default EsqueciSenha;