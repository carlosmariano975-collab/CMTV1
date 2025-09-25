// server.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const MY_WHATSAPP = process.env.MY_WHATSAPP || '5587991394036'; // seu número

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Utils
function shuffle(s) {
  return s.split('').sort(() => 0.5 - Math.random()).join('');
}

function generatePassword(length = 8) {
  // garante pelo menos 1 maiúscula, 1 minúscula e 1 número
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const all = upper + lower + numbers;

  // garantir requisitos mínimos
  let pwd = '';
  pwd += upper[Math.floor(Math.random() * upper.length)];
  pwd += lower[Math.floor(Math.random() * lower.length)];
  pwd += numbers[Math.floor(Math.random() * numbers.length)];

  // completar até length
  while (pwd.length < length) {
    pwd += all[Math.floor(Math.random() * all.length)];
  }

  return shuffle(pwd);
}

function loadLogins() {
  const fp = path.join(__dirname, 'logins.json');
  if (!fs.existsSync(fp)) return [];
  try {
    return JSON.parse(fs.readFileSync(fp));
  } catch (e) {
    return [];
  }
}

function saveLogins(list) {
  const fp = path.join(__dirname, 'logins.json');
  fs.writeFileSync(fp, JSON.stringify(list, null, 2));
}

function makeUniqueUsername(base, existing) {
  // tenta base + 2 dígitos, se já existir tenta outras combinações
  let candidate = base;
  let tries = 0;
  while (existing.find(u => u.username === candidate) && tries < 200) {
    const suffix = Math.floor(Math.random() * 90 + 10); // 10..99
    candidate = `${base}${suffix}`;
    tries++;
  }
  return candidate;
}

// Endpoint
app.post('/create', (req, res) => {
  const { firstName, lastName, whatsapp } = req.body;

  if (!firstName || !lastName || !whatsapp) {
    return res.status(400).json({ error: 'Por favor, preencha Nome, Sobrenome e WhatsApp.' });
  }

  const cleanFirst = String(firstName).trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  const cleanLast = String(lastName).trim().toLowerCase().replace(/[^a-z0-9]/g, '');

  const baseUsername = `${cleanFirst}.${cleanLast}`;
  const logins = loadLogins();

  // garante username único adicionando 2 dígitos se necessário
  const username = makeUniqueUsername(baseUsername, logins);

  // gera senha com pelo menos 6 caracteres (aqui usamos 8 por segurança)
  const password = generatePassword(8);

  // salva
  const record = {
    firstName: String(firstName).trim(),
    lastName: String(lastName).trim(),
    clientWhatsApp: String(whatsapp).trim(),
    username,
    password,
    createdAt: new Date().toISOString()
  };
  logins.push(record);
  saveLogins(logins);

  // mensagem estilizada com emojis e instruções
  const messagePlain = 
`✅ Usuário gerado com sucesso!

👤 Login: ${username}
🔑 Senha: ${password}
📞 WhatsApp do cliente: ${whatsapp}

🚀 Para ativar seu *teste grátis* ou *ativação do plano mensal*, clique no botão abaixo para enviar a mensagem automaticamente pelo WhatsApp.

📱 Apps recomendados:
➡ Android: http://aftv.news/733751
➡ Smart TV: DREAM TV ou XCLOUD
➡ iOS: https://apps.apple.com/br/app/xcloud-mobile/id6471106231`;

  const messageEncoded = encodeURIComponent(messagePlain);
  const whatsappLink = `https://wa.me/${MY_WHATSAPP}?text=${messageEncoded}`;

  // responder frontend
  return res.json({ username, password, whatsappLink });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
