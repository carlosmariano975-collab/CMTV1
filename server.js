const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/create', (req, res) => {
  const { firstName, lastName, whatsapp } = req.body;

  if (!firstName || !lastName || !whatsapp) {
    return res.status(400).json({ error: 'Preencha todos os campos!' });
  }

  // Gerar login e senha
  const username = firstName.toLowerCase() + '.' + lastName.toLowerCase();
  const password = Math.random().toString(36).slice(-8);

  // Salvar no logins.json
  let logins = [];
  if (fs.existsSync('logins.json')) {
    logins = JSON.parse(fs.readFileSync('logins.json'));
  }
  logins.push({ firstName, lastName, whatsapp, username, password, date: new Date() });
  fs.writeFileSync('logins.json', JSON.stringify(logins, null, 2));

  // Criar link WhatsApp para enviar a mensagem para você
  const messageText = encodeURIComponent(
    `📌 Novo usuário gerado!\n\n` +
    `👤 Nome: ${firstName} ${lastName}\n` +
    `🔑 Login: ${username}\n` +
    `🛡 Senha: ${password}\n` +
    `📞 WhatsApp do cliente: ${whatsapp}\n\n` +
    `📱 Apps recomendados:\n` +
    `➡ Android: http://aftv.news/733751\n` +
    `➡ Smart TV: DREAM TV ou XCLOUD\n` +
    `➡ iOS: https://apps.apple.com/br/app/xcloud-mobile/id6471106231`
  );

  // Seu número de WhatsApp: 5587991394036
  const myWhatsAppNumber = '5587991394036';
  const whatsappLink = `https://wa.me/${myWhatsAppNumber}?text=${messageText}`;

  // Retornar dados para frontend
  res.json({ username, password, whatsappLink });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
