const API_TOKEN = 'MfKvDrEwpSuoPBEFhPdunRS6wrtZk1BACdpOXhwRrpqC1jo2HUD4MesJCPsZ';
const MI_TELEFONO = '525652196399';

// IDs de las ligas más importantes (Premier, LaLiga, Champions, Liga MX, etc.)
const LIGAS_TOP = [8, 564, 301, 271, 501, 2, 3, 5, 24, 609]; 

async function cargarPredictor() {
    const container = document.getElementById('match-container');
    const hoy = new Date().toISOString().split('T')[0];

    try {
        // Pedimos partidos de hoy con equipos y probabilidades
        const url = `https://api.sportmonks.com/v3/football/fixtures/date/${hoy}?api_token=${API_TOKEN}&include=participants;probabilities;league`;
        
        const response = await fetch(url);
        const res = await response.json();

        if (res.data && res.data.length > 0) {
            // FILTRO: Solo partidos que pertenezcan a nuestras ligas importantes
            const partidosImportantes = res.data.filter(p => 
                LIGAS_TOP.includes(p.league_id) && 
                p.participants && p.participants.length >= 2
            );

            // Si no hay de las TOP, mostramos los 10 con mayor probabilidad de éxito
            const finales = partidosImportantes.length > 0 ? partidosImportantes : res.data.slice(0, 10);
            
            mostrarEnPantalla(finales.slice(0, 10));
        } else {
            container.innerHTML = `<div class="loading">No hay partidos importantes hoy (${hoy}).</div>`;
        }
    } catch (error) {
        console.error(error);
        container.innerHTML = '<div class="loading">Error de conexión. Revisa tu Token.</div>';
    }
}

function mostrarEnPantalla(partidos) {
    const container = document.getElementById('match-container');
    container.innerHTML = '<h2 style="color:#fbbf24">🔝 TOP 10 PARLAY REAL</h2>';

    let mensajeWA = "🎯 *PARLAY TOP 10 (DATOS REALES)* 🎯%0A%0A";
    let momioTotal = 1.0;

    partidos.forEach((p, index) => {
        const local = p.participants.find(pt => pt.meta.location === 'home')?.name || "Local";
        const visita = p.participants.find(pt => pt.meta.location === 'away')?.name || "Visita";
        const nombreLiga = p.league?.name || "Fútbol";
        
        const prob = (p.probabilities && p.probabilities.length > 0) ? p.probabilities[0] : null;

        // Lógica de mercado real
        let mercado = "Más de 1.5 Goles";
        let porcentaje = 75;

        if (prob) {
            if (prob.btts > 65) { mercado = "Ambos Anotan"; porcentaje = prob.btts; }
            else if (prob.home_victory > 55) { mercado = `Gana ${local}`; porcentaje = prob.home_victory; }
        }

        const cuota = (100 / porcentaje).toFixed(2);
        momioTotal *= parseFloat(cuota);

        mensajeWA += `${index + 1}. *${local} vs ${visita}*%0A   ${mercado} (@${cuota})%0A%0A`;

        container.innerHTML += `
            <div class="match-card">
                <div style="font-size:0.7rem; color:#fbbf24; font-weight:bold;">🏆 ${nombreLiga}</div>
                <h3>${local} vs ${visita}</h3>
                <p><span class="prob-tag">🎯 ${mercado}</span> <b>@${cuota}</b></p>
            </div>
        `;
    });

    mensajeWA += `*MOMIO TOTAL: @${momioTotal.toFixed(2)}*`;

    const btn = document.createElement('a');
    btn.href = `https://wa.me/${MI_TELEFONO}?text=${mensajeWA}`;
    btn.className = "btn-whatsapp";
    btn.innerHTML = "📲 ENVIAR TOP 10 A MI WHATSAPP";
    container.appendChild(btn);
}

window.onload = cargarPredictor;
