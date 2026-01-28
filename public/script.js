const form = document.getElementById('userForm');
const result = document.getElementById('result');
const waButton = document.getElementById('waButton');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  result.style.display = 'block';
  result.innerHTML = '⏳ Gerando seu acesso...';
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
    result.innerHTML = `✅ <b>Acesso Pronto!</b><br><br>👤 Login: ${json.username}<br>🔑 Senha: ${json.password}`;
    waButton.href = json.whatsappLink;
    waButton.style.display = 'flex';
  } catch (err) {
    result.innerHTML = '❌ Erro ao gerar. Tente novamente.';
  }
});

// Notificações Aleatórias
const names = ["Ricardo", "Ana", "Marcos", "Lúcia", "Felipe", "Sandra", "Thiago", "Carla", "Bruno"];
function showPop() {
    const name = names[Math.floor(Math.random() * names.length)];
    document.getElementById('notification-text').innerHTML = `<b>${name}</b> acabou de gerar um acesso!`;
    const pop = document.getElementById('social-proof');
    pop.classList.add('show');
    setTimeout(() => pop.classList.remove('show'), 4000);
}
setInterval(showPop, 25000); 
setTimeout(showPop, 5000);
