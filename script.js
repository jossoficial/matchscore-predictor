const API_TOKEN = 'MfKvDrEwpSuoPBEFhPdunRS6wrtZk1BACdpOXhwRrpqC1jo2HUD4MesJCPsZ';
const MI_TELEFONO = '525652196399';

// IDs de las 10 ligas más importantes (incluida Liga MX)
const LIGAS_TOP = [8, 564, 301, 271, 501, 2, 3, 5, 24, 609]; 

async function cargarPredictor() {
    const container = document.getElementById('match-container');
    const hoy = new Date().toISOString().split('T')[0];

    try {
        // Usamos un proxy para evitar el "Error de conexión" (CORS)
        const proxy = "https://corsproxy.io/?";
        const urlBase = `https://api.sportmonks.com/v3/football/fixtures/date/${hoy}?api_token=${API_TOKEN}&include=participants;probabilities;league`;
        
        const response = await fetch(proxy + encodeURIComponent(urlBase));
        const res = await response.json();

        if (res.data && res.data.length > 0) {
            // Filtramos por las ligas top y que tengan equipos
            const filtrados = res.data.filter(p => 
                LIGAS_TOP.includes(p.league_id) && 
                p.participants && p.participants.length >= 2
            );

            // Si hay partidos top los mostramos, si no, los 10 mejores del día
            const mostrar = filtrados.length > 0 ? filtrados : res.data.slice(0, 10);
            generarInterfaz(mostrar.slice(0, 10));
        } else {
            container.innerHTML = `<div class="loading">No hay partidos importantes para hoy (${hoy}).</div>`;
        }
    } catch (error) {
        console.error(error);
        container.innerHTML = '<div class="loading">Error de señal. Reintentando...</div>';
        // Reintento automático en 5 segundos si falla
        setTimeout(cargarPredictor, 5000);
    }
}

function generarInterfaz(partidos) {
    const container = document.getElementById('match-container');
    container.innerHTML = '<h2 style="color:#fbbf24">🔝 TOP 10 - DATOS REALES</h2>';

    let mensajeWA = "🎯 *PARLAY TOP 10 REAL* 🎯%0A%0A";
    let momioTotal = 1.0;

    partidos.forEach((p, index) => {
        const local = p.participants.find(pt => pt.meta.location === 'home')?.name || "Local";
        const visita = p.participants.find(pt => pt.meta.location === 'away')?.name || "Visita";
        const liga = p.league?.name || "Fútbol";
        const prob = p.probabilities?.[0];

        // Análisis de mercado real
        let mercado = "Más de 1.5 Goles";
        let cuota = 1.40;

        if (prob) {
            if (prob.btts > 65) { mercado = "Ambos Anotan"; cuota = (100/prob.btts).toFixed(2); }
            else if (prob.home_victory > 55) { mercado = `Gana ${local}`; cuota = (100/prob.home_victory).toFixed(2); }
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

    const btn = document.createElement('a');
    btn.href = `https://wa.me/${MI_TELEFONO}?text=${mensajeWA}`;
    btn.className = "btn-whatsapp";
    btn.innerHTML = "📲 ENVIAR TOP 10 A WHATSAPP";
    container.appendChild(btn);
}

window.onload = cargarPredictor;
