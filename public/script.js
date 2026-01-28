const form = document.getElementById('userForm');
const result = document.getElementById('result');
const waButton = document.getElementById('waButton');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  result.style.display = 'block';
  result.innerHTML = '⏳ Preparando seus dados...';
  waButton.style.display = 'none';

  try {
    const res = await fetch('/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        whatsapp: document.getElementById('whatsapp').value
      })
    });
    const json = await res.json();
    
    // MENSAGEM FOCO EM ATIVAÇÃO
    result.innerHTML = `
      <div style="border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px; margin-bottom: 8px;">
        <span style="color: #FFD700; font-weight: bold;">⚠️ QUASE LÁ! DADOS GERADOS</span>
      </div>
      <b>👤 Login:</b> ${json.username}<br>
      <b>🔑 Senha:</b> ${json.password}<br><br>
      <small>Para liberar seu acesso, envie os dados acima no WhatsApp agora mesmo!</small>
    `;

    waButton.href = json.whatsappLink;
    waButton.style.display = 'flex';
    waButton.innerHTML = '<i class="fab fa-whatsapp"></i> &nbsp; ENVIAR E ATIVAR TESTE';
  } catch (err) {
    result.innerHTML = '❌ Erro ao processar. Tente novamente.';
  }
});

// Prova Social Discreta
const names = ["Ricardo", "Ana", "Marcos", "Lúcia", "Felipe", "Sandra", "Thiago", "Carla", "Bruno"];
function showPop() {
    const name = names[Math.floor(Math.random() * names.length)];
    const notifyText = document.getElementById('notification-text');
    if(notifyText) {
        notifyText.innerHTML = `<b>${name}</b> solicitou um teste agora!`;
        const pop = document.getElementById('social-proof');
        pop.classList.add('show');
        setTimeout(() => pop.classList.remove('show'), 4000);
    }
}
setInterval(showPop, 25000); 
setTimeout(showPop, 5000);
