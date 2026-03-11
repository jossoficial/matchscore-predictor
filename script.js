const API_TOKEN = 'MfKvDrEwpSuoPBEFhPdunRS6wrtZk1BACdpOXhwRrpqC1jo2HUD4MesJCPsZ';
const MI_TELEFONO = '525652196399';

async function cargarPredictor() {
    const container = document.getElementById('match-container');
    const hoy = new Date().toISOString().split('T')[0];

    try {
        // PASO 1: Probar si el Token es válido consultando el perfil
        const pruebaLink = `https://api.sportmonks.com/v3/core/me?api_token=${API_TOKEN}`;
        const respPrueba = await fetch(pruebaLink);
        const dataPrueba = await respPrueba.json();

        if (dataPrueba.error || !dataPrueba.data) {
            container.innerHTML = `<div class="loading" style="color:#ff4444">❌ TOKEN INVÁLIDO O EXPIRADO.<br><small>Verifica que lo copiaste completo de Sportmonks.</small></div>`;
            return;
        }

        // PASO 2: Intentar cargar los partidos de hoy
        const urlPartidos = `https://api.sportmonks.com/v3/football/fixtures/date/${hoy}?api_token=${API_TOKEN}&include=participants;probabilities;league`;
        const response = await fetch(urlPartidos);
        const res = await response.json();

        if (res.data && res.data.length > 0) {
            // Filtrar los 10 más importantes
            mostrarEnPantalla(res.data.slice(0, 10));
        } else {
            container.innerHTML = `<div class="loading">No hay partidos disponibles hoy en tus ligas para la fecha: ${hoy}</div>`;
        }
    } catch (error) {
        console.error(error);
        container.innerHTML = '<div class="loading">⚠️ Error de Red. Revisa tu conexión a internet.</div>';
    }
}

function mostrarEnPantalla(partidos) {
    const container = document.getElementById('match-container');
    container.innerHTML = '<h2 style="color:#fbbf24">📊 PARLAY REAL (TOP 10)</h2>';

    let mensajeWA = "🎯 *MI PARLAY REAL* 🎯%0A%0A";
    let momioTotal = 1.0;

    partidos.forEach((p) => {
        const local = p.participants.find(pt => pt.meta.location === 'home')?.name || "Local";
        const visita = p.participants.find(pt => pt.meta.location === 'away')?.name || "Visita";
        const liga = p.league?.name || "Fútbol";
        const prob = p.probabilities?.[0];

        let mercado = "Más de 1.5 Goles";
        let cuota = 1.40;

        if (prob && prob.btts > 60) { mercado = "Ambos Anotan"; cuota = (100/prob.btts).toFixed(2); }

        momioTotal *= parseFloat(cuota);
        mensajeWA += `✅ *${local} vs ${visita}*%0A- ${mercado} (@${cuota})%0A%0A`;

        container.innerHTML += `
            <div class="match-card">
                <small style="color:#fbbf24">🏆 ${liga}</small>
                <h3>${local} vs ${visita}</h3>
                <p><span class="prob-tag">🎯 ${mercado}</span> <b>@${cuota}</b></p>
            </div>
        `;
    });

    mensajeWA += `*MOMIO TOTAL: @${momioTotal.toFixed(2)}*`;
    container.innerHTML += `<a href="https://wa.me/${MI_TELEFONO}?text=${mensajeWA}" class="btn-whatsapp">📲 ENVIAR PARLAY A WHATSAPP</a>`;
}

window.onload = cargarPredictor;
