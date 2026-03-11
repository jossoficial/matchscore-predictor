const API_KEY = 'ee435e2af8827223177d12d11923bffa';
const REGION = 'us'; // Puedes usar 'us' para momios americanos o 'eu' para decimales
const MARKET = 'h2h'; 

async function cargarTodo() {
    const container = document.getElementById('match-container');
    container.innerHTML = '<p>Buscando eventos en todas las ligas...</p>';

    try {
        // 1. Obtenemos la lista de todas las ligas activas
        const respLigas = await fetch(`https://api.the-odds-api.com/v4/sports/?apiKey=${API_KEY}`);
        const ligas = await respLigas.json();

        // Limpiamos el contenedor para empezar a llenar por secciones
        container.innerHTML = '';

        // 2. Filtramos y recorremos las ligas principales (o todas las disponibles)
        // Usamos slice(0, 5) para no saturar tu límite de API en un solo clic
        for (const liga of ligas.slice(0, 8)) { 
            await obtenerPartidosPorLiga(liga.key, liga.title);
        }

    } catch (error) {
        console.error(error);
        container.innerHTML = '<p>Error de conexión. Revisa tu límite de API.</p>';
    }
}

async function obtenerPartidosPorLiga(ligaKey, ligaNombre) {
    const container = document.getElementById('match-container');
    
    try {
        const response = await fetch(`https://api.the-odds-api.com/v4/sports/${ligaKey}/odds/?apiKey=${API_KEY}&regions=${REGION}&markets=${MARKET}`);
        const partidos = await response.json();

        if (partidos.length > 0) {
            // Crear un título para la liga
            const tituloLiga = document.createElement('h2');
            tituloLiga.innerText = ligaNombre;
            tituloLiga.style.color = '#38bdf8';
            tituloLiga.style.marginTop = '30px';
            container.appendChild(tituloLiga);

            // Mostrar los primeros 3 partidos de esa liga
            partidos.slice(0, 3).forEach(evento => {
                const card = document.createElement('div');
                card.className = 'match-card';
                
                let cuotas = "Cuotas no disponibles";
                if (evento.bookmakers[0]) {
                    const outcomes = evento.bookmakers[0].markets[0].outcomes;
                    cuotas = outcomes.map(o => `${o.name}: <strong>${o.price}</strong>`).join(' | ');
                }

                card.innerHTML = `
                    <h3>${evento.home_team} vs ${evento.away_team}</h3>
                    <p class="prob">${cuotas}</p>
                `;
                container.appendChild(card);
            });
        }
    } catch (e) {
        console.log("Error cargando liga: " + ligaKey);
    }
}

window.onload = cargarTodo;
