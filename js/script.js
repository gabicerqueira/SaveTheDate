// Função pra mostrar debug na tela (visível no mobile)
function showDebug(msg, isError = false) {
    const debugEl = document.getElementById('debug');
    if (debugEl) {
        debugEl.innerHTML += msg + '<br>';
        if (isError) debugEl.style.display = 'block';
        console.log(msg); // Também pro console se disponível
    } else {
        alert(msg); // Fallback se nem debug div tiver
    }
}

document.addEventListener('DOMContentLoaded', function() {
    showDebug('DOM carregado. Iniciando menu...');
    const toggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('menu');

    if (toggle && menu) {
        toggle.addEventListener('click', function() {
            menu.classList.toggle('active');
        });
        showDebug('Menu OK');
    } else {
        showDebug('ERRO: Menu elements not found', true);
    }
});

if ('ontouchstart' in window || navigator.maxTouchPoints) {
    document.body.classList.add('no-hover');
    showDebug('Modo touch detectado');
}

// =======================
// TIMER DO EVENTO (COM DEBUG VISUAL)
// =======================
function initTimer() {
    showDebug('Tentando iniciar timer...');

    try {
        // Elementos
        const diasEl = document.getElementById("dias");
        const horasEl = document.getElementById("horas");
        const minutosEl = document.getElementById("minutos");
        const segundosEl = document.getElementById("segundos");
        const timerContainer = document.getElementById("timer");

        if (!diasEl || !horasEl || !minutosEl || !segundosEl || !timerContainer) {
            showDebug('ERRO: Elementos do timer não encontrados! Verifique IDs no HTML: dias, horas, minutos, segundos, timer', true);
            return;
        }

        showDebug('Elementos do timer OK!');

        // Data evento UTC
        const dataEventoUTCms = Date.UTC(2026, 0, 17, 22, 30, 0);
        const agoraInicial = Date.now();
        showDebug(`Data evento: ${dataEventoUTCms} ms | Agora: ${agoraInicial} ms | Distância inicial: ${dataEventoUTCms - agoraInicial} ms`);

        let ticks = 0; // Contador pra ver se atualiza

        function atualizar() {
            ticks++;
            const agora = Date.now();
            const distancia = dataEventoUTCms - agora;

            // Debug visual: Mostra ticks a cada 10s (não spam)
            if (ticks % 10 === 0) {
                showDebug(`Tick ${ticks}: Distância ${distancia} ms (segundos: ${Math.floor(distancia / 1000)})`);
            }

            if (distancia <= 0) {
                clearInterval(intervalo);
                timerContainer.innerHTML = "💍 Chegou o grande dia! 💖";
                showDebug('Timer finalizado: Evento chegou!');
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

            // Se ticks > 5 mas segundos não mudam, avisa
            if (ticks > 5 && segundos === 0) {
                showDebug('AVISO: Timer não está atualizando segundos! Pode ser throttle no Safari.', true);
            }
        }

        // Inicializa
        atualizar();

        // Intervalo simples (1000ms)
        const intervalo = setInterval(atualizar, 1000);

        showDebug('Timer iniciado! Aguarde ticks nos logs.');

    } catch (err) {
        showDebug(`ERRO no timer: ${err.message}`, true);
    }
}

// Inicia múltiplos fallbacks pra mobile lento
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initTimer, 100); // Delay pequeno
});
window.addEventListener('load', function() {
    setTimeout(initTimer, 500); // Delay maior se load for lento
});

// =======================
// FORMULÁRIO (com debug básico, sem mudanças grandes)
// =======================
document.addEventListener("DOMContentLoaded", function () {
    showDebug('Iniciando form...');

    const adultosInput = document.getElementById('adultos');
    const criancasInput = document.getElementById('criancas');
    const acompanhantesContainer = document.getElementById('acompanhantes-adultos');
    const criancasContainer = document.getElementById('nomes-criancas');
    const form = document.getElementById('formPresenca');

    if (!adultosInput || !criancasInput || !acompanhantesContainer || !criancasContainer || !form) {
        showDebug('ERRO: Elementos do form não encontrados!', true);
        return;
    }

    showDebug('Form OK');

    // Resto do código do form igual ao anterior (adultos, criancas, submit)
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
        showDebug('Form enviado pro WhatsApp');
    });
});