// script.js
const form = document.getElementById('userForm');
const result = document.getElementById('result');
const waButton = document.getElementById('waButton');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // Feedback visual imediato
  result.style.display = 'block';
  result.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gerando seu acesso VIP...';
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
      result.innerHTML = `<span style="color: #ff4444;">❌ Erro: ${json.error}</span>`;
      return;
    }

    // Exibe apenas o essencial na tela para não poluir o visual
    result.innerHTML = `
      <div style="border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px; margin-bottom: 10px;">
        <span style="color: #25D366;">✅ Usuário gerado com sucesso!</span>
      </div>
      <b>👤 Login:</b> ${json.username}<br>
      <b>🔑 Senha:</b> ${json.password}<br><br>
      <small>Clique no botão abaixo para receber os links dos apps no seu WhatsApp.</small>
    `;

    // Configura o botão do WhatsApp com o link que vem do servidor
    waButton.href = json.whatsappLink;
    waButton.style.display = 'flex'; // Usando flex para alinhar o ícone que adicionamos no HTML

  } catch (err) {
    result.innerHTML = '<span style="color: #ff4444;">❌ Erro de conexão. Tente novamente.</span>';
    console.error('Erro:', err);
  }
});
