document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('menu');

    if (toggle && menu) {
        toggle.addEventListener('click', function() {
            menu.classList.toggle('active');
        });
    } else {
        console.warn('Menu elements not found');
    }
});

if ('ontouchstart' in window || navigator.maxTouchPoints) {
    document.body.classList.add('no-hover');
}

// =======================
// TIMER DO EVENTO (VERSÃO MOBILE-FRIENDLY)
// =======================
function initTimer() {
    console.log('Iniciando timer...'); // Log inicial

    try {
        // Elementos (com verificação extra)
        const diasEl = document.getElementById("dias");
        const horasEl = document.getElementById("horas");
        const minutosEl = document.getElementById("minutos");
        const segundosEl = document.getElementById("segundos");
        const timerContainer = document.getElementById("timer");

        if (!diasEl || !horasEl || !minutosEl || !segundosEl || !timerContainer) {
            console.warn('Timer: elementos do DOM não encontrados. Abortando timer.');
            return;
        }

        console.log('Elementos do timer encontrados OK!'); // Log de sucesso

        // Data do evento em UTC (mesma que antes)
        const dataEventoUTCms = Date.UTC(2026, 0, 17, 22, 30, 0);
        console.log('Data evento UTC ms:', dataEventoUTCms); // Log pra comparar com Date.now()
        console.log('Agora (Date.now()):', Date.now()); // Log atual

        let isRunning = true;

        // Função de atualização
        function atualizar() {
            if (!isRunning) return;

            const agora = Date.now();
            const distancia = dataEventoUTCms - agora;
            console.log('Atualizando timer. Distância ms:', distancia); // Log a cada tick (remova depois se spam)

            if (distancia <= 0) {
                clearInterval(intervalo); // Se usar interval
                isRunning = false;
                timerContainer.innerHTML = "💍 Chegou o grande dia! 💖";
                console.log('Timer finalizado: evento chegou!');
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

        // Inicializa
        atualizar();

        // Usa requestAnimationFrame pra mobile (roda ~60fps, mas chamamos a cada 1s)
        let lastTime = 0;
        function loop(currentTime) {
            if (currentTime - lastTime >= 1000) { // A cada 1s
                atualizar();
                lastTime = currentTime;
            }
            if (isRunning) {
                requestAnimationFrame(loop);
            }
        }
        requestAnimationFrame(loop);

        // Fallback: setInterval se requestAnimationFrame não for suportado (raro)
        const intervalo = setInterval(atualizar, 1000);

        console.log('Timer iniciado com sucesso!');

    } catch (err) {
        console.error('Erro no timer:', err);
    }
}

// Inicia no DOMContentLoaded, com fallback no load (pra mobile lento)
document.addEventListener('DOMContentLoaded', initTimer);
window.addEventListener('load', function() {
    if (!document.body.classList.contains('timer-inited')) { // Evita duplo init
        document.body.classList.add('timer-inited');
        initTimer();
    }
});

// =======================
// FORMULÁRIO DINÂMICO E WHATSAPP (sem mudanças, mas com logs extras)
// =======================
document.addEventListener("DOMContentLoaded", function () {
    console.log('Iniciando form...'); // Log

    const adultosInput = document.getElementById('adultos');
    const criancasInput = document.getElementById('criancas');
    const acompanhantesContainer = document.getElementById('acompanhantes-adultos');
    const criancasContainer = document.getElementById('nomes-criancas');
    const form = document.getElementById('formPresenca');

    if (!adultosInput || !criancasInput || !acompanhantesContainer || !criancasContainer || !form) {
        console.warn('Form elements not found');
        return;
    }

    console.log('Elementos do form encontrados OK!'); // Log

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
        e.preventDefault();

        const nome = document.getElementById('nome').value || 'Não informado';
        const telefone = document.getElementById('telefone').value || 'Não informado';
        const adultos = adultosInput.value || '0';
        const criancas = criancasInput.value || '0';
        const acompanhantes = [...document.querySelectorAll('#acompanhantes-adultos input')].map(i => i.value).join(', ') || 'Nenhum';
        const nomesCriancas = [...document.querySelectorAll('#nomes-criancas input')].map(i => i.value).join(', ') || 'Nenhuma';
        const obs = document.getElementById('obs').value || 'Sem observações';

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

        const numeroNoiva = '5511970204225';
        window.open(`https://wa.me/${numeroNoiva}?text=${encodeURIComponent(mensagem)}`, '_blank');
        console.log('Form enviado pro WhatsApp'); // Log
    });
});