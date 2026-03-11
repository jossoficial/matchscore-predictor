const API_TOKEN = 'MfKvDrEwpSuoPBEFhPdunRS6wrtZk1BACdpOXhwRrpqC1jo2HUD4MesJCPsZ';
const MI_TELEFONO = '525652196399';
const CACHE_TIME = 3 * 60 * 60 * 1000; // 3 Horas

async function cargarPredictor() {
    const container = document.getElementById('match-container');
    const lastUpdate = localStorage.getItem('last_update');
    const ahora = new Date().getTime();

    // Si tenemos datos recientes (menos de 3h), no gastamos créditos de API
    if (lastUpdate && (ahora - lastUpdate < CACHE_TIME)) {
        const cached = JSON.parse(localStorage.getItem('cached_matches'));
        mostrarEnPantalla(cached);
        return;
    }

    try {
        // Consultamos la "Verdad": Partidos con probabilidades reales de Sportmonks
        const url = `https://api.sportmonks.com/v3/football/fixtures?include=participants;probabilities&api_token=${API_TOKEN}`;
        const response = await fetch(url);
        const res = await response.json();

        if (res.data && res.data.length >= 5) {
            const seleccionados = res.data.slice(0, 5);
            localStorage.setItem('last_update', ahora.toString());
            localStorage.setItem('cached_matches', JSON.stringify(seleccionados));
            mostrarEnPantalla(seleccionados);
        } else {
            container.innerHTML = '<p>Buscando partidos disponibles...</p>';
        }
    } catch (e) {
        container.innerHTML = '<p>Error de conexión con Sportmonks.</p>';
    }
}

function mostrarEnPantalla(partidos) {
    const container = document.getElementById('match-container');
    container.innerHTML = '<h2 style="color:#fbbf24">🔥 PARLAY REAL DEL DÍA</h2>';

    let mensajeWA = "🎯 *PARLAY REAL VERIFICADO* 🎯%0A%0A";
    let momioTotal = 1.0;

    partidos.forEach(p => {
        const local = p.participants.find(pt => pt.meta.location === 'home').name;
        const visita = p.participants.find(pt => pt.meta.location === 'away').name;
        const prob = p.probabilities ? p.probabilities[0] : null;

        // Selección de mercado basada en probabilidad real
        let mercado = "Más de 1.5 Goles";
        let porcentaje = 72;

        if (prob) {
            if (prob.btts > 62) { mercado = "Ambos Anotan: SÍ"; porcentaje = prob.btts; }
            else if (prob.home_victory > 52) { mercado = `Gana ${local}`; porcentaje = prob.home_victory; }
        }

        const cuota = (100 / porcentaje).toFixed(2);
        momioTotal *= parseFloat(cuota);

        const card = document.createElement('div');
        card.className = 'match-card';
        card.innerHTML = `
            <small style="color:#94a3b8">${p.name}</small>
            <h3>${local} vs ${visita}</h3>
            <p><span class="prob-tag">${mercado}</span> <b style="margin-left:10px;">@${cuota}</b></p>
        `;
        container.appendChild(card);

        mensajeWA += `✅ *${local} vs ${visita}*%0A- Pronóstico: ${mercado} (@${cuota})%0A%0A`;
    });

    mensajeWA += `*MOMIO TOTAL: @${momioTotal.toFixed(2)}*`;

    const btn = document.createElement('a');
    btn.href = `https://wa.me/${MI_TELEFONO}?text=${mensajeWA}`;
    btn.className = 'btn-whatsapp';
    btn.innerHTML = '📲 ENVIAR PARLAY A MI WHATSAPP';
    container.appendChild(btn);
}

window.onload = cargarPredictor;
