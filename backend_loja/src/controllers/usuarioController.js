const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
  // --- CADASTRAR CONTA MANUAL ---
  async cadastrar(req, res) {
    try {
      const { nome, email, senha, telefone, cep, endereco } = req.body;

      const usuarioExistente = await prisma.usuarios.findUnique({
        where: { email }
      });

      if (usuarioExistente) {
        return res.status(400).json({ erro: "Este e-mail já está cadastrado." });
      }

      const novoUsuario = await prisma.usuarios.create({
        data: {
          nome,
          email,
          senha, 
          telefone,
          cep,
          endereco
        }
      });

      const { senha: _, ...usuarioSemSenha } = novoUsuario;
      return res.status(201).json(usuarioSemSenha);
    } catch (error) {
      console.error("Erro no Cadastro:", error);
      return res.status(500).json({ erro: "Erro ao criar conta", detalhes: error.message });
    }
  },

  // --- FAZER LOGIN MANUAL ---
  async login(req, res) {
    try {
      const { email, senha } = req.body;

      const usuario = await prisma.usuarios.findUnique({
        where: { email }
      });

      if (!usuario || usuario.senha !== senha) {
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

      // 1. Tenta achar o usuário pelo e-mail
      let usuario = await prisma.usuarios.findUnique({
        where: { email }
      });

      if (!usuario) {
        usuario = await prisma.usuarios.create({
          data: {
            nome: nome,
            email: email,
            googleId: googleId,
            tipo: "cliente",
          }
        });
      } else {
        if (!usuario.googleId) {
          usuario = await prisma.usuarios.update({
            where: { email },
            data: { googleId }
          });
        }
      }

      const { senha: _, ...dadosUsuario } = usuario;
      return res.json({
        mensagem: "Login com Google realizado!",
        usuario: dadosUsuario
      });

    } catch (error) {
      console.error("Erro no Login Google Controller:", error);
      return res.status(500).json({ erro: "Erro ao processar login social" });
    }
  }
};