const API_TOKEN = 'B5p5Tos0wXqtw6336VNkre1npIjhg44MdLyvKWTdkJZeXeZECi0VBN6LR3TX';
const MI_TELEFONO = '525652196399';

async function cargarPredictor() {
    const container = document.getElementById('match-container');
    // Fecha de hoy para la consulta
    const hoy = new Date().toISOString().split('T')[0];

    try {
        // Consultamos la versión v3 de Sportmonks para partidos de hoy
        const url = `https://api.sportmonks.com/v3/football/fixtures/date/${hoy}?api_token=${API_TOKEN}&include=participants;probabilities;league`;
        
        const response = await fetch(url);
        const res = await response.json();

        // Limpiar pantalla
        container.innerHTML = '';

        if (res.data && res.data.length > 0) {
            // Filtrar solo los primeros 10 para que sea un parlay manejable
            mostrarEnPantalla(res.data.slice(0, 10));
        } else if (res.message) {
            // Si la API devuelve un mensaje de error específico
            container.innerHTML = `<div class="loading" style="color:#fbbf24">Aviso de API: ${res.message}</div>`;
        } else {
            container.innerHTML = `<div class="loading">No hay partidos programados para hoy en tus ligas activas.</div>`;
        }
    } catch (error) {
        console.error("Error técnico:", error);
        container.innerHTML = '<div class="loading">Error de conexión. Verifica tu internet o el estado del Token.</div>';
    }
}

function mostrarEnPantalla(partidos) {
    const container = document.getElementById('match-container');
    container.innerHTML = '<h2 style="color:#fbbf24">📊 PARLAY REAL (TOP 10)</h2>';

    let mensajeWA = "🎯 *MI PARLAY DEL DÍA* 🎯%0A%0A";
    let momioTotal = 1.0;

    partidos.forEach((p) => {
        const local = p.participants.find(pt => pt.meta.location === 'home')?.name || "Local";
        const visita = p.participants.find(pt => pt.meta.location === 'away')?.name || "Visita";
        const liga = p.league?.name || "Fútbol";
        const prob = p.probabilities?.[0];

        // Definimos un mercado basado en datos reales
        let mercado = "Más de 1.5 Goles";
        let cuota = 1.45;

        if (prob && prob.btts > 60) {
            mercado = "Ambos Anotan: SÍ";
            cuota = (100 / prob.btts).toFixed(2);
        } else if (prob && prob.home_victory > 50) {
            mercado = `Gana ${local}`;
            cuota = (100 / prob.home_victory).toFixed(2);
        }

        momioTotal *= parseFloat(cuota);
        mensajeWA += `✅ *${local} vs ${visita}*%0A- ${mercado} (@${cuota})%0A%0A`;

        container.innerHTML += `
            <div class="match-card">
                <div style="font-size:0.7rem; color:#fbbf24; font-weight:bold;">🏆 ${liga}</div>
                <h3>${local} vs ${visita}</h3>
                <p><span class="prob-tag">🎯 ${mercado}</span> <b>@${cuota}</b></p>
            </div>
        `;
    });

    mensajeWA += `*MOMIO TOTAL: @${momioTotal.toFixed(2)}*`;

    const btn = document.createElement('a');
    btn.href = `https://wa.me/${MI_TELEFONO}?text=${mensajeWA}`;
    btn.className = "btn-whatsapp";
    btn.innerHTML = "📲 ENVIAR PARLAY A MI WHATSAPP";
    container.appendChild(btn);
}

window.onload = cargarPredictor;
