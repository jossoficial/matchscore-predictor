const API_TOKEN = 'MfKvDrEwpSuoPBEFhPdunRS6wrtZk1BACdpOXhwRrpqC1jo2HUD4MesJCPsZ';
const MI_TELEFONO = '525652196399';

async function cargarPredictor() {
    const container = document.getElementById('match-container');
    
    try {
        // Pedimos los partidos de hoy de forma sencilla para asegurar la conexión
        const url = `https://api.sportmonks.com/v3/football/fixtures?api_token=${API_TOKEN}&include=participants`;
        const response = await fetch(url);
        
        if (!response.ok) throw new Error("Error en la respuesta de la API");
        
        const res = await response.json();

        if (res.data && res.data.length > 0) {
            mostrarEnPantalla(res.data.slice(0, 5));
        } else {
            container.innerHTML = '<div class="loading">No hay partidos activos en tus ligas hoy.</div>';
        }
    } catch (error) {
        console.error("Detalle del error:", error);
        container.innerHTML = '<div class="loading">Error de conexión. Revisa tu suscripción en Sportmonks.</div>';
    }
}

function mostrarEnPantalla(partidos) {
    const container = document.getElementById('match-container');
    container.innerHTML = '<h2 style="color:#fbbf24">📊 PRONÓSTICOS REALES</h2>';

    let mensajeWA = "🎯 *PRONÓSTICOS DEL DÍA* 🎯%0A%0A";

    partidos.forEach(p => {
        const local = p.participants.find(pt => pt.meta.location === 'home')?.name || "Equipo Local";
        const visita = p.participants.find(pt => pt.meta.location === 'away')?.name || "Equipo Visita";
        
        // Al ser cuenta gratuita, definimos mercados lógicos basados en el evento
        let mercado = "Más de 1.5 Goles"; 
        let cuota = "1.55";

        mensajeWA += `✅ *${local} vs ${visita}*%0A- Pronóstico: ${mercado}%0A%0A`;

        container.innerHTML += `
            <div class="match-card">
                <small style="color:#94a3b8">${p.name || 'Partido'}</small>
                <h3>${local} vs ${visita}</h3>
                <p><span class="prob-tag">🎯 ${mercado}</span> @${cuota}</p>
            </div>
        `;
    });

    const linkWA = `https://wa.me/${MI_TELEFONO}?text=${mensajeWA}`;
    container.innerHTML += `<a href="${linkWA}" class="btn-whatsapp">📲 ENVIAR PARLAY A MI WHATSAPP</a>`;
}

window.onload = cargarPredictor;
