const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'christianramonquadros@gmail.com', 
    pass: 'ndrvwcbmkwujxwqc'
  }
});

// Verifica se ta tudo certo com a configuração do e-mail
transporter.verify((error) => {
  if (error) {
    console.log("Erro na configuração do e-mail:", error);
  } else {
    console.log("Tudo certo! O sistema já pode enviar e-mails.");
  }
});

module.exports = transporter;