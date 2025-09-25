// script.js
const form = document.getElementById('userForm');
const result = document.getElementById('result');
const waButton = document.getElementById('waButton');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  result.textContent = 'Gerando usuário...';
  waButton.style.display = 'none';

  const payload = {
    firstName: document.getElementById('firstName').value,
    lastName: document.getElementById('lastName').value,
    whatsapp: document.getElementById('whatsapp').value
  };

  try {
    const res = await fetch('/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (json.error) {
      result.textContent = `Erro: ${json.error}`;
      return;
    }

    const message = `✅ Usuário gerado com sucesso!\n\nLogin: ${json.username}\nSenha: ${json.password}\n\nPara ativar seu teste grátis ou concluir assinatura do seu plano mensal, clique no botão abaixo para enviar a mensagem automaticamente pelo WhatsApp.`;

    // mostra mensagem amigável no site (com quebras)
    result.innerHTML = message.replace(/\n/g, '<br>');

    // botão para abrir o WhatsApp já com a mensagem estilizada (retornada pelo backend)
    waButton.href = json.whatsappLink;
    waButton.style.display = 'inline-block';

    // opcional: limpar inputs
    // form.reset();

  } catch (err) {
    result.textContent = 'Erro ao gerar: ' + err.message;
  }
});
