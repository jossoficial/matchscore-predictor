const pronosticos = [
    { local: "Real Madrid", visitante: "Barcelona", prob: "Gana Local 48%" },
    { local: "Lakers", visitante: "Warriors", prob: "Más de 220.5 puntos" },
    { local: "Cruz Azul", visitante: "América", prob: "Empate/Visitante" }
];

const container = document.getElementById('match-container');
container.innerHTML = '';

pronosticos.forEach(m => {
    container.innerHTML += `
        <div class="match-card">
            <h3>${m.local} vs ${m.visitante}</h3>
            <p class="prob">Pronóstico: ${m.prob}</p>
        </div>
    `;
});
