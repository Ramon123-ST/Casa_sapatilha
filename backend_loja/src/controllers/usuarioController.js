const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const crypto = require('crypto');
const bcrypt = require('bcrypt'); 
const transporter = require('../config/mail');

module.exports = {
  // --- CADASTRAR CONTA  ---
  async cadastrar(req, res) {
    try {
      const { nome, email, senha, telefone } = req.body;
      if (!nome || !email || !senha) return res.status(400).json({ erro: "Dados obrigatórios ausentes." });

      const emailTratado = email.trim().toLowerCase();

      const usuarioExistente = await prisma.usuarios.findUnique({
        where: { email: emailTratado }
      });

      if (usuarioExistente) {
        return res.status(400).json({ erro: "Este e-mail já está cadastrado." });
      }

      const salt = await bcrypt.genSalt(10);
      const senhaCriptografada = await bcrypt.hash(senha, salt);

      const novoUsuario = await prisma.usuarios.create({
        data: {
          nome,
          email: emailTratado,
          senha: senhaCriptografada, 
          telefone,
          tipo: "cliente"
        }
      });

      const { senha: _, ...usuarioSemSenha } = novoUsuario;
      return res.status(201).json(usuarioSemSenha);
    } catch (error) {
      console.error("Erro no Cadastro:", error);
      return res.status(500).json({ erro: "Erro ao criar conta" });
    }
  },

  // --- FAZER LOGIN  ---
  async login(req, res) {
    try {
      const { email, senha } = req.body;
      const emailTratado = email.trim().toLowerCase();

      const usuario = await prisma.usuarios.findUnique({
        where: { email: emailTratado }
      });

      if (!usuario) {
        return res.status(401).json({ erro: "E-mail ou senha incorretos." });
      }

      const senhaValida = await bcrypt.compare(senha, usuario.senha);
      if (!senhaValida) {
        return res.status(401).json({ erro: "E-mail ou senha incorretos." });
      }

      const { senha: _, ...dadosUsuario } = usuario;
      return res.json({ 
        mensagem: "Login realizado com sucesso!", 
        usuario: dadosUsuario 
      });
    } catch (error) {
      console.error("Erro no Login:", error);
      return res.status(500).json({ erro: "Erro ao processar login" });
    }
  },

  // --- LOGIN/CADASTRO VIA GOOGLE ---
  async loginGoogle(req, res) {
    try {
      const { email, nome, googleId } = req.body;
      const emailTratado = email.trim().toLowerCase();

      let usuario = await prisma.usuarios.findUnique({
        where: { email: emailTratado }
      });

      if (!usuario) {
        usuario = await prisma.usuarios.create({
          data: {
            nome: nome,
            email: emailTratado,
            googleId: googleId,
            senha: "GOOGLE_AUTH_USER", 
            tipo: "cliente",
          }
        });
      } else if (!usuario.googleId) {
        usuario = await prisma.usuarios.update({
          where: { email: emailTratado },
          data: { googleId }
        });
      }

      const { senha: _, ...dadosUsuario } = usuario;
      return res.json({
        mensagem: "Login com Google realizado!",
        usuario: dadosUsuario
      });

    } catch (error) {
      console.error("Erro no Login Google:", error);
      return res.status(500).json({ erro: "Erro ao processar login social" });
    }
  },

  // --- RECUPERAÇÃO DE SENHA ---
  async solicitarRecuperacao(req, res) {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ erro: "O e-mail é necessário." });

      const emailTratado = email.trim().toLowerCase();
      const usuario = await prisma.usuarios.findUnique({ 
        where: { email: emailTratado } 
      });

      if (!usuario) {
        return res.status(404).json({ erro: "Usuário não encontrado." });
      }

      // Código de 6 dígitos 
      const codigo = crypto.randomInt(100000, 999999).toString();
    
      const expiracao = new Date();
      expiracao.setHours(expiracao.getHours() + 1);

      await prisma.usuarios.update({
        where: { email: emailTratado },
        data: {
          reset_token: codigo,
          reset_token_exp: expiracao
        }
      });

      console.log(`[RECUPERAÇÃO] Código gerado para ${emailTratado}: ${codigo}`);

      await transporter.sendMail({
        from: '"Casa da Sapatilha" <christianramonquadros@gmail.com>',
        to: emailTratado,
        subject: "Código de Recuperação - Casa da Sapatilha",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
            <h2 style="color: #333;">Olá, ${usuario.nome}!</h2>
            <p>Você solicitou a recuperação de senha. Use o código abaixo:</p>
            <div style="background: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; color: #d63384; letter-spacing: 4px;">
              ${codigo}
            </div>
            <p>Este código expira em 1 hora.</p>
          </div>
        `
      });

      return res.json({ mensagem: "Código enviado com sucesso!" });

    } catch (error) {
      console.error("Erro na Solicitação de Senha:", error);
      return res.status(500).json({ erro: "Erro ao processar solicitação." });
    }
  },

  // --- REDEFINIR SENHA  ---
  async redefinirSenha(req, res) {
    try {
      const { email, codigo, novaSenha } = req.body;
      
      if (!email || !codigo || !novaSenha) {
        return res.status(400).json({ erro: "Preencha todos os campos." });
      }

      const emailTratado = email.trim().toLowerCase();
      const codigoEnviado = String(codigo).trim();

      const usuario = await prisma.usuarios.findUnique({
        where: { email: emailTratado }
      });

      // --- ÁREA DE LOGS PARA DEBUG NO TERMINAL ---
      console.log("--- INÍCIO DA VALIDAÇÃO ---");
      console.log("Email:", emailTratado);
      console.log("Código que veio do React:", `"${codigoEnviado}"`);
      
      if (!usuario) {
        console.log("ERRO: Usuário não existe no banco.");
        return res.status(400).json({ erro: "E-mail não encontrado." });
      }

      const codigoNoBanco = String(usuario.reset_token).trim();
      console.log("Código salvo no Banco:", `"${codigoNoBanco}"`);

      // Validação do Código
      if (codigoEnviado !== codigoNoBanco) {
        console.log("ERRO: Os códigos são diferentes.");
        return res.status(400).json({ erro: "Código inválido." });
      }

      //  Validação da Expiração
      const agora = new Date().getTime();
      const tempoExpiracao = new Date(usuario.reset_token_exp).getTime();

      if (agora > tempoExpiracao) {
        console.log("ERRO: O código já expirou.");
        return res.status(400).json({ erro: "Este código expirou." });
      }

      //  Criptografar nova senha 
      const salt = await bcrypt.genSalt(10);
      const senhaCriptografada = await bcrypt.hash(novaSenha, salt);

      await prisma.usuarios.update({
        where: { id: usuario.id },
        data: {
          senha: senhaCriptografada,
          reset_token: null, 
          reset_token_exp: null
        }
      });

      console.log("SUCESSO: Senha alterada para o usuário", emailTratado);
      return res.json({ mensagem: "Senha alterada com sucesso! Faça login novamente." });

    } catch (error) {
      console.error("Erro crítico ao Redefinir Senha:", error);
      return res.status(500).json({ erro: "Erro interno ao salvar nova senha." });
    }
  }
};