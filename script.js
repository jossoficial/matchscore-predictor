const API_TOKEN = 'MfKvDrEwpSuoPBEFhPdunRS6wrtZk1BACdpOXhwRrpqC1jo2HUD4MesJCPsZ';
const MI_TELEFONO = '525652196399'; // Tu número configurado

async function cargarDatosReales() {
    const container = document.getElementById('match-container');
    container.innerHTML = '<div class="loading">Consultando Mercados Reales...</div>';

    try {
        // Consultamos partidos incluyendo participantes y probabilidades matemáticas de Sportmonks
        const url = `https://api.sportmonks.com/v3/football/fixtures?include=participants;probabilities&api_token=${API_TOKEN}`;
        
        const response = await fetch(url);
        const json = await response.json();
        
        if (!json.data || json.data.length < 5) {
            container.innerHTML = '<p>No hay suficientes partidos con datos reales hoy en tu plan.</p>';
            return;
        }

        procesarYEnviar(json.data.slice(0, 5));

    } catch (error) {
        container.innerHTML = '<p>Error de conexión con la API.</p>';
    }
}

function procesarYEnviar(partidos) {
    const container = document.getElementById('match-container');
    container.innerHTML = '<h2 style="color:#fbbf24">📊 PARLAY REAL GENERADO</h2>';

    let textoWhatsapp = "🎯 *NUEVO PARLAY REAL* 🎯%0A%0A";
    let cuotaAcumulada = 1.0;

    partidos.forEach((p, index) => {
        const local = p.participants.find(pt => pt.meta.location === 'home').name;
        const visita = p.participants.find(pt => pt.meta.location === 'away').name;
        
        const prob = p.probabilities ? p.probabilities[0] : null;
        
        // Selección de mercado basada en la probabilidad real más alta de la API
        let mercado = "Más de 1.5 Goles";
        let porcentaje = 75;

        if (prob) {
            if (prob.btts > 65) {
                mercado = "Ambos Anotan: SÍ";
                porcentaje = prob.btts;
            } else if (prob.home_victory > 55) {
                mercado = `Gana ${local}`;
                porcentaje = prob.home_victory;
            } else if (prob.over_2_5 > 60) {
                mercado = "Más de 2.5 Goles";
                porcentaje = prob.over_2_5;
            }
        }

        const cuota = (100 / porcentaje).toFixed(2);
        cuotaAcumulada *= parseFloat(cuota);

        // Crear la tarjeta en la web
        const card = document.createElement('div');
        card.className = 'match-card';
        card.innerHTML = `
            <div style="font-size:0.7rem; color:#94a3b8;">${p.name}</div>
            <h3>${local} vs ${visita}</h3>
            <p><span class="prob-tag">🎯 ${mercado}</span> <span style="margin-left:10px;">@${cuota}</span></p>
        `;
        container.appendChild(card);

        // Formatear mensaje para WhatsApp
        textoWhatsapp += `✅ *${local} vs ${visita}*%0A- Pronóstico: ${mercado}%0A- Cuota: @${cuota}%0A%0A`;
    });

    textoWhatsapp += `*MOMIO TOTAL: @${cuotaAcumulada.toFixed(2)}*%0A%0A_Enviado desde mi Predictor GitHub_`;

    // Botón de acción real
    const linkWA = `https://wa.me/${MI_TELEFONO}?text=${textoWhatsapp}`;
    
    const btn = document.createElement('a');
    btn.href = linkWA;
    btn.target = "_blank";
    btn.className = "btn-action btn-whatsapp";
    btn.style.display = "block";
    btn.style.marginTop = "20px";
    btn.style.textDecoration = "none";
    btn.innerHTML = "📲 ENVIAR PARLAY A MI WHATSAPP";
    
    container.appendChild(btn);
}

window.onload = cargarDatosReales;
