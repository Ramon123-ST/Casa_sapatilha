import React, { useState } from 'react';
import axios from 'axios';
import './RedefinirSenha.css';

const RedefinirSenha = ({ email }) => {
  const [codigo, setCodigo] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleRedefinir = async (e) => {
    e.preventDefault();

    setCarregando(true);
    setMensagem('');

    try {
      const response = await axios.post(
        'http://localhost:3000/redefinir-senha',
        {
          email: email.trim().toLowerCase(),
          codigo: codigo.trim(),
          novaSenha: novaSenha,
        }
      );

      setMensagem(response.data.mensagem);

      setCodigo('');
      setNovaSenha('');

    } catch (error) {
      const erroServidor =
        error.response?.data?.erro ||
        'Erro ao processar solicitação.';

      setMensagem(erroServidor);

      if (erroServidor.toLowerCase().includes('código')) {
        setCodigo('');
      }

    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="redefinir-container">
      <h2 className="redefinir-titulo">
        Criar Nova Senha
      </h2>

      <p className="redefinir-texto">
        Enviamos um código para:
        <strong> {email}</strong>
      </p>

      <form
        onSubmit={handleRedefinir}
        className="redefinir-form"
      >
        <input
          type="text"
          placeholder="Código de 6 dígitos"
          value={codigo}
          onChange={(e) =>
            setCodigo(e.target.value.replace(/\D/g, ''))
          }
          required
          maxLength={6}
          autoComplete="one-time-code"
          inputMode="numeric"
          className="redefinir-codigo"
        />

        <div className="redefinir-senha-box">
          <input
            type={mostrarSenha ? 'text' : 'password'}
            placeholder="Nova Senha"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            required
            autoComplete="new-password"
            className="redefinir-input"
          />

          <button
            type="button"
            onClick={() => setMostrarSenha(!mostrarSenha)}
            className="redefinir-olho"
          >
            <img
              src={
                mostrarSenha
                  ? '/img/aberto.png'
                  : '/img/olhofechado.png'
              }
              alt="Mostrar Senha"
              className="redefinir-img"
            />
          </button>
        </div>

        <button
          type="submit"
          disabled={carregando}
          className="redefinir-btn"
        >
          {carregando
            ? 'Processando...'
            : 'Alterar Senha'}
        </button>
      </form>

      {mensagem && (
        <p
          className={`redefinir-mensagem ${
            mensagem.toLowerCase().includes('sucesso')
              ? 'redefinir-sucesso'
              : 'redefinir-erro'
          }`}
        >
          {mensagem}
        </p>
      )}
    </div>
  );
};

export default RedefinirSenha;