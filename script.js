const API_TOKEN = 'B5p5Tos0wXqtw6336VNkre1npIjhg44MdLyvKWTdkJZeXeZECi0VBN6LR3TX';
const MI_TELEFONO = '525652196399';

async function cargarPredictor() {
    const container = document.getElementById('match-container');
    const hoy = new Date().toISOString().split('T')[0];

    try {
        // Usamos un proxy ultra-rápido para saltar el bloqueo de red
        const proxy = "https://api.allorigins.win/get?url=";
        const urlSportmonks = `https://api.sportmonks.com/v3/football/fixtures/date/${hoy}?api_token=${API_TOKEN}&include=participants;league;probabilities`;
        
        const response = await fetch(proxy + encodeURIComponent(urlSportmonks));
        const data = await response.json();
        
        // El proxy devuelve el JSON dentro de una propiedad 'contents'
        const res = JSON.parse(data.contents);

        if (res.data && res.data.length > 0) {
            mostrarEnPantalla(res.data.slice(0, 10));
        } else {
            container.innerHTML = `<div class="loading">No hay partidos disponibles hoy (${hoy}).</div>`;
        }
    } catch (error) {
        console.error(error);
        container.innerHTML = '<div class="loading" style="color:#fbbf24">⚠️ Error de sincronización. Refresca la página.</div>';
    }
}

function mostrarEnPantalla(partidos) {
    const container = document.getElementById('match-container');
    container.innerHTML = '<h2 style="color:#fbbf24">📊 PARLAY REAL (120 LIGAS)</h2>';

    let mensajeWA = "🎯 *MI PARLAY DEL DÍA* 🎯%0A%0A";
    let momioTotal = 1.0;

    partidos.forEach((p, index) => {
        const local = p.participants?.find(pt => pt.meta.location === 'home')?.name || "Local";
        const visita = p.participants?.find(pt => pt.meta.location === 'away')?.name || "Visita";
        const liga = p.league?.name || "Fútbol";
        const prob = p.probabilities?.[0];

        let mercado = "Más de 1.5 Goles";
        let cuota = 1.45;

        if (prob && prob.home_victory > 55) {
            mercado = `Gana ${local}`;
            cuota = (100 / prob.home_victory).toFixed(2);
        }

        momioTotal *= parseFloat(cuota);
        mensajeWA += `${index + 1}. *${local} vs ${visita}*%0A   ${mercado} (@${cuota})%0A%0A`;

        container.innerHTML += `
            <div class="match-card">
                <div style="font-size:0.7rem; color:#fbbf24;">🏆 ${liga}</div>
                <h3>${local} vs ${visita}</h3>
                <p><span class="prob-tag">🎯 ${mercado}</span> <b>@${cuota}</b></p>
            </div>
        `;
    });

    mensajeWA += `*MOMIO TOTAL: @${momioTotal.toFixed(2)}*`;
    container.innerHTML += `<a href="https://wa.me/${MI_TELEFONO}?text=${mensajeWA}" class="btn-whatsapp">📲 ENVIAR PARLAY A WHATSAPP</a>`;
}

window.onload = cargarPredictor;
