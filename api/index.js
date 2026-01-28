// api/index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const MY_WHATSAPP = '5587991394036'; 
const SENHA_FIXA = 'Padrao975'; 

app.use(cors());
app.use(bodyParser.json());

// Ajustado para o nome da pasta no seu print
app.use(express.static(path.join(__dirname, '../público')));

function cleanString(str) {
  return String(str).trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, '');
}

app.post('/create', (req, res) => {
  const { firstName, lastName, whatsapp } = req.body;

  if (!firstName || !lastName || !whatsapp) {
    return res.status(400).json({ error: 'Por favor, preencha todos os campos.' });
  }

  const cleanFirst = cleanString(firstName);
  const cleanLast = cleanString(lastName);
  const username = `${cleanFirst}.${cleanLast}`;
  const password = SENHA_FIXA; 

  // MENSAGEM REFORMULADA E OTIMIZADA
  const messagePlain = 
`━━━━━━━━━━━━━━━━━━━━
   ✨ *CONTA GERADA!* ✨
━━━━━━━━━━━━━━━━━━━━

👤 *LOGIN:* ${username}
🔑 *SENHA:* ${password}

━━━━━━━━━━━━━━━━━━━━
🚀 *COMO COMEÇAR AGORA:*
━━━━━━━━━━━━━━━━━━━━

1️⃣ *BAIXE O APP:*
🤖 Android: *IBO REVENDA*
📺 Smart TV: *DREAM TV* ou *XCLOUD TV*
🍎 iOS: *XCLOUD MOBILE*

2️⃣ *ME ENVIAR CODIGO:*
Abra o app escolhido e me envie o códigolocalizadona tela inicial.

3️⃣ *ATIVE SUA LISTA:*
Responda esta mensagem para liberar o acesso completo agora mesmo! 💬

━━━━━━━━━━━━━━━━━━━━`;

  const messageEncoded = encodeURIComponent(messagePlain);
  const whatsappLink = `https://wa.me/${MY_WHATSAPP}?text=${messageEncoded}`;

  return res.json({ username, password, whatsappLink });
});

module.exports = app;
