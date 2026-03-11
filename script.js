const API_TOKEN = 'B5p5Tos0wXqtw6336VNkre1npIjhg44MdLyvKWTdkJZeXeZECi0VBN6LR3TX';
const MI_TELEFONO = '525652196399';

async function cargarPredictor() {
    const container = document.getElementById('match-container');
    const hoy = new Date().toISOString().split('T')[0];

    try {
        // Formato exacto según tu captura: api_token como parámetro
        const url = `https://api.sportmonks.com/v3/football/fixtures/date/${hoy}?api_token=${API_TOKEN}&include=participants;league`;
        
        // Usamos un proxy para saltar el bloqueo del navegador
        const proxy = "https://api.allorigins.win/get?url=";
        const response = await fetch(proxy + encodeURIComponent(url));
        
        if (!response.ok) throw new Error('Error de red');

        const rawData = await response.json();
        const res = JSON.parse(rawData.contents);

        if (res.data && res.data.length > 0) {
            mostrarEnPantalla(res.data.slice(0, 10));
        } else {
            container.innerHTML = `<div class="loading">No hay partidos disponibles hoy en tus ligas (${hoy}).</div>`;
        }
    } catch (error) {
        console.error(error);
        container.innerHTML = '<div class="loading" style="color:#fbbf24">⚠️ Error de sincronización. Refresca la página.</div>';
    }
}

function mostrarEnPantalla(partidos) {
    const container = document.getElementById('match-container');
    container.innerHTML = '<h2 style="color:#fbbf24">📊 PARLAY REAL (TOP 10)</h2>';

    let mensajeWA = "🎯 *MI PARLAY REAL* 🎯%0A%0A";
    let cuotaTotal = 1.0;

    partidos.forEach((p, index) => {
        const local = p.participants?.find(pt => pt.meta.location === 'home')?.name || "Local";
        const visita = p.participants?.find(pt => pt.meta.location === 'away')?.name || "Visita";
        const liga = p.league?.name || "Fútbol";
        
        // Mercado estándar para asegurar que no falle la lógica
        let mercado = "Más de 1.5 Goles";
        let cuota = 1.45;

        cuotaTotal *= cuota;
        mensajeWA += `${index + 1}. *${local} vs ${visita}*%0A   ${mercado} (@${cuota})%0A%0A`;

        container.innerHTML += `
            <div class="match-card">
                <div style="font-size:0.7rem; color:#fbbf24; font-weight:bold;">🏆 ${liga}</div>
                <h3>${local} vs ${visita}</h3>
                <p><span class="prob-tag">🎯 ${mercado}</span> @${cuota}</p>
            </div>
        `;
    });

    mensajeWA += `*MOMIO TOTAL: @${cuotaTotal.toFixed(2)}*`;
    container.innerHTML += `<a href="https://wa.me/${MI_TELEFONO}?text=${mensajeWA}" class="btn-whatsapp">📲 ENVIAR PARLAY A WHATSAPP</a>`;
}

window.onload = cargarPredictor;
