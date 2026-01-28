// api/index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
// O número de WhatsApp e a senha fixa agora são diretos
const MY_WHATSAPP = '5587991394036'; 
const SENHA_FIXA = 'Padrao975'; 

app.use(cors());
app.use(bodyParser.json());

// Ajustado para o nome da pasta que aparece no seu print (público)
app.use(express.static(path.join(__dirname, '../público')));

// Função para simplificar o nome de usuário (remover espaços e acentos)
function cleanString(str) {
  return String(str).trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, '');
}

// Endpoint principal
app.post('/create', (req, res) => {
  const { firstName, lastName, whatsapp } = req.body;

  if (!firstName || !lastName || !whatsapp) {
    return res.status(400).json({ error: 'Por favor, preencha todos os campos.' });
  }

  const cleanFirst = cleanString(firstName);
  const cleanLast = cleanString(lastName);
  
  // Gera o username (ex: mariano.cell)
  const username = `${cleanFirst}.${cleanLast}`;
  const password = SENHA_FIXA; // Conforme solicitado: Padrao975

  // Mensagem estilizada para o seu WhatsApp
  const messagePlain = 
`✅ Usuário gerado com sucesso!

👤 Login: ${username}
🔑 Senha: ${password}
📞 WhatsApp do cliente: ${whatsapp}

🚀 Para ativar seu *teste grátis* ou *ativação do plano mensal*, clique no botão abaixo para enviar a mensagem automaticamente pelo WhatsApp.

📱 Apps recomendados:
➡ Android: *IBO REVENDA*
➡ Smart TV: *DREAM TV* ou *XCLOUD TV*
➡ iOS: *XCLOUD MOBILE*`;

  const messageEncoded = encodeURIComponent(messagePlain);
  const whatsappLink = `https://wa.me/${MY_WHATSAPP}?text=${messageEncoded}`;

  // Responder ao frontend (Garante que o erro de JSON não aconteça mais)
  return res.json({ username, password, whatsappLink });
});

// IMPORTANTE PARA VERCEL: Exportar o app em vez de usar app.listen
module.exports = app;
