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
app.use(express.static(path.join(__dirname, '../público')));

function cleanString(str) {
  return String(str).trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, '');
}

app.post('/create', (req, res) => {
  const { firstName, lastName, whatsapp } = req.body;
  if (!firstName || !lastName || !whatsapp) {
    return res.status(400).json({ error: 'Preencha todos os campos.' });
  }

  const username = `${cleanString(firstName)}.${cleanString(lastName)}`;
  const password = SENHA_FIXA; 

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

2️⃣ *ENVIAR CODIGO:*
Abra o app e use envie o codigo Mac do seu dispositivo.

3️⃣ *ATIVE SUA LISTA:*
Responda esta mensagem para liberar o acesso! 💬

━━━━━━━━━━━━━━━━━━━━`;

  const whatsappLink = `https://wa.me/${MY_WHATSAPP}?text=${encodeURIComponent(messagePlain)}`;
  return res.json({ username, password, whatsappLink });
});

module.exports = app;
