const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
  // RF01: Cadastrar conta
  async cadastrar(req, res) {
    try {
      const { nome, email, senha, telefone, cep, endereco } = req.body;

      // 1. Verifica se o e-mail já existe (Boa prática!)
      const usuarioExistente = await prisma.usuarios.findUnique({
        where: { email }
      });

      if (usuarioExistente) {
        return res.status(400).json({ erro: "Este e-mail já está cadastrado." });
      }

      // 2. Cria o novo usuário com os campos de endereço
      const novoUsuario = await prisma.usuarios.create({
        data: {
          nome,
          email,
          senha, // Lembre-se do bcrypt no futuro, Ramon! 🛡️
          telefone,
          cep,
          endereco
        }
      });

      // 3. Remove a senha por segurança
      const { senha: _, ...usuarioSemSenha } = novoUsuario;
      
      return res.status(201).json(usuarioSemSenha);
    } catch (error) {
      console.error("Erro no Cadastro:", error);
      return res.status(500).json({ erro: "Erro ao criar conta", detalhes: error.message });
    }
  },

  // RF02: Fazer login
  async login(req, res) {
    try {
      const { email, senha } = req.body;

      // 1. Busca o usuário pelo e-mail
      const usuario = await prisma.usuarios.findUnique({
        where: { email }
      });

      // 2. Validação: Usuário existe e a senha bate?
      if (!usuario || usuario.senha !== senha) {
        return res.status(401).json({ erro: "E-mail ou senha incorretos." });
      }

      // 3. Retorna os dados do usuário logado (sem a senha)
      const { senha: _, ...dadosUsuario } = usuario;
      return res.json({ 
        mensagem: "Login realizado com sucesso!", 
        usuario: dadosUsuario 
      });
    } catch (error) {
      console.error("Erro no Login:", error);
      return res.status(500).json({ erro: "Erro ao processar login" });
    }
  }
};