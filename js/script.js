document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('menu');

    toggle.addEventListener('click', function() {
      menu.classList.toggle('active');
    });
  });

if ('ontouchstart' in window || navigator.maxTouchPoints) {
  document.body.classList.add('no-hover');
}


// =======================
// TIMER DO EVENTO
// =======================
document.addEventListener('DOMContentLoaded', function () {
  try {
    // elementos (pega uma vez)
    const diasEl = document.getElementById("dias");
    const horasEl = document.getElementById("horas");
    const minutosEl = document.getElementById("minutos");
    const segundosEl = document.getElementById("segundos");
    const timerContainer = document.getElementById("timer");

    // verifica existência (se algum não existir, sai sem quebrar)
    if (!diasEl || !horasEl || !minutosEl || !segundosEl || !timerContainer) {
      console.warn('Timer: elementos do DOM não encontrados. Abortando timer.');
      return;
    }

    // Defina aqui o instante exato do evento em UTC para evitar problemas de parsing/fuso
    // Seu horário é 2026-01-17 19:30 (horário de Brasil -03:00).
    // Em UTC esse instante é 2026-01-17 22:30 (19:30 + 3h).
    // Usamos Date.UTC(ano, mêsIndex, dia, horaUTC, min, seg)
    const dataEventoUTCms = Date.UTC(2026, 0, 17, 22, 30, 0); // janeiro = 0
    // alternativa: const dataEventoUTCms = new Date(2026,0,17,19,30,0).getTime(); // local time version

    // função de atualização (separa para teste manual)
    function atualizar() {
      const agora = Date.now();
      const distancia = dataEventoUTCms - agora;

      if (distancia <= 0) {
        // evento já chegou
        clearInterval(intervalo);
        timerContainer.innerHTML = "💍 Chegou o grande dia! 💖";
        return;
      }

      const dias = Math.floor(distancia / (1000 * 60 * 60 * 24));
      const horas = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutos = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
      const segundos = Math.floor((distancia % (1000 * 60)) / 1000);

      diasEl.textContent = String(dias).padStart(2, '0');
      horasEl.textContent = String(horas).padStart(2, '0');
      minutosEl.textContent = String(minutos).padStart(2, '0');
      segundosEl.textContent = String(segundos).padStart(2, '0');
    }

    // inicializa
    atualizar();
    const intervalo = setInterval(atualizar, 1000);

  } catch (err) {
    console.error('Erro no timer:', err);
  }
});


// =======================
// FORMULÁRIO DINÂMICO E WHATSAPP
// =======================
document.addEventListener("DOMContentLoaded", function () {
  const adultosInput = document.getElementById('adultos');
  const criancasInput = document.getElementById('criancas');
  const acompanhantesContainer = document.getElementById('acompanhantes-adultos');
  const criancasContainer = document.getElementById('nomes-criancas');
  const form = document.getElementById('formPresenca');

  // ===== ADULTOS
  adultosInput.addEventListener('input', () => {
    const qtd = parseInt(adultosInput.value) || 1;
    acompanhantesContainer.innerHTML = '';

    if (qtd >= 2) {
      for (let i = 2; i <= qtd; i++) {
        const div = document.createElement('div');
        div.classList.add('form');
        div.innerHTML = `
          <label for="acompanhante${i}">Nome do acompanhante ${i - 1}:</label>
          <input type="text" id="acompanhante${i}" name="acompanhante${i}" placeholder="Insira o nome do acompanhante ${i - 1}">
        `;
        acompanhantesContainer.appendChild(div);
      }
    }
  });

  // ===== CRIANÇAS
  criancasInput.addEventListener('input', () => {
    const qtd = parseInt(criancasInput.value) || 0;
    criancasContainer.innerHTML = '';

    if (qtd >= 1) {
      for (let i = 1; i <= qtd; i++) {
        const div = document.createElement('div');
        div.classList.add('form');
        div.innerHTML = `
          <label for="crianca${i}">Nome da criança ${i}:</label>
          <input type="text" id="crianca${i}" name="crianca${i}" placeholder="Insira o nome da criança ${i}">
        `;
        criancasContainer.appendChild(div);
      }
    }
  });

  // ===== ENVIO DO FORMULÁRIO
  form.addEventListener('submit', function(e) {
    e.preventDefault(); // evita reload

    // Pega os valores do formulário
    const nome = document.getElementById('nome').value || 'Não informado';
    const telefone = document.getElementById('telefone').value || 'Não informado';
    const adultos = adultosInput.value || '0';
    const criancas = criancasInput.value || '0';
    const acompanhantes = [...document.querySelectorAll('#acompanhantes-adultos input')].map(i => i.value).join(', ') || 'Nenhum';
    const nomesCriancas = [...document.querySelectorAll('#nomes-criancas input')].map(i => i.value).join(', ') || 'Nenhuma';
    const obs = document.getElementById('obs').value || 'Sem observações';

    // Cria mensagem bonita
    const mensagem = 
`*Confirmação de Presença* 

Nome: ${nome}
Telefone: ${telefone}

Adultos: ${adultos}
Crianças: ${criancas}

Acompanhantes: ${acompanhantes}
Nomes das crianças: ${nomesCriancas}

Observações: ${obs}

Obrigado!`;

    // WhatsApp da noiva
    const numeroNoiva = '5511970204225';
    window.open(`https://wa.me/${numeroNoiva}?text=${encodeURIComponent(mensagem)}`, '_blank');
  });
});


