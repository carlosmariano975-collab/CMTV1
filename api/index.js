const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const MY_WHATSAPP = '5587991394036'; 
const SENHA_FIXA = 'Padrao975'; 

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

function cleanString(str) {
  return String(str).trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, '');
}

app.post('/create', (req, res) => {
  const { firstName, lastName, whatsapp } = req.body;
  if (!firstName || !lastName || !whatsapp) {
    return res.status(400).json({ error: 'Preencha todos os campos.' });
  }

  const username = `${cleanString(firstName)}.${cleanString(lastName)}`;
  
  const messagePlain = 
`━━━━━━━━━━━━━━━━━━━━
   🚀 *PEDIDO DE ATIVAÇÃO*
━━━━━━━━━━━━━━━━━━━━
Olá! Gere meu teste no site e quero *ATIVAR* agora:

👤 *LOGIN:* ${username}
🔑 *SENHA:* ${SENHA_FIXA}

━━━━━━━━━━━━━━━━━━━━
🎁 *APPS PARA INSTALAR:*
━━━━━━━━━━━━━━━━━━━━

🤖 Android: *IBO REVENDA*
📺 Smart TV: *DREAM TV* ou *XCLOUD TV*
🍎 iOS: *XCLOUD MOBILE*

*Aguardando sua ativação!* ⏳`;

  const whatsappLink = `https://wa.me/${MY_WHATSAPP}?text=${encodeURIComponent(messagePlain)}`;
  return res.json({ username, password: SENHA_FIXA, whatsappLink });
});

module.exports = app;
