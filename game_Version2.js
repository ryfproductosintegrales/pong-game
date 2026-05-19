// ==========================================
// PONG GAME - VERSIÓN COMPLETA CON TODAS LAS CARACTERÍSTICAS
// ==========================================

// Elementos del DOM
const gameContainer = document.getElementById('gameContainer');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const mainMenu = document.getElementById('mainMenu');
const settingsMenu = document.getElementById('settingsMenu');
const themeMenu = document.getElementById('themeMenu');
const leaderboardMenu = document.getElementById('leaderboardMenu');
const difficultySection = document.getElementById('difficultySection');
const pauseOverlay = document.getElementById('pauseOverlay');
const gameOverMessage = document.getElementById('gameOverMessage');
const pauseBtn = document.getElementById('pauseBtn');

// Configuración del Canvas
function resizeCanvas() {
    const rect = gameContainer.querySelector('.game-canvas');
    if (rect) {
        canvas.width = rect.clientWidth;
        canvas.height = rect.clientHeight;
    }
}

window.addEventListener('resize', resizeCanvas);

// Estado del Juego
let gameState = {
    running: false,
    paused: false,
    mode: 'solo', // solo o multiplayer
    difficulty: 'normal',
    playerScore: 0,
    computerScore: 0,
    winScore: 5,
    currentLevel: 1,
    hits: 0,
    powerUpsUsed: 0,
    totalPoints: 0,
    startTime: 0,
    sound: true,
    visuals: true,
    trails: true,
    theme: 'cyberpunk',
    speedMultiplier: 1,
    volume: 0.7
};

// Objeto Bola
const ball = {
    x: 0,
    y: 0,
    radius: 8,
    speedX: 0,
    speedY: 0,
    maxSpeed: 10,
    trail: []
};

// Objeto Paddle Jugador
const playerPaddle = {
    x: 30,
    y: 0,
    width: 15,
    height: 120,
    speedY: 0,
    maxSpeed: 8
};

// Objeto Paddle Computadora
const computerPaddle = {
    x: 0,
    y: 0,
    width: 15,
    height: 120,
    speedY: 0,
    maxSpeed: 6
};

// Power-ups
const powerUps = {
    slowBall: { name: 'Bola Lenta', symbol: '🐢', color: '#00ff00', duration: 5000 },
    fastBall: { name: 'Bola Rápida', symbol: '⚡', color: '#ff0000', duration: 4000 },
    largerPaddle: { name: 'Paddle Grande', symbol: '📏', color: '#ffff00', duration: 6000 },
    magneticPaddle: { name: 'Paddle Magnético', symbol: '🧲', color: '#ff00ff', duration: 5000 }
};

let activePowerUps = [];

// Input
const keys = {};
document.addEventListener('keydown', (e) => keys[e.key] = true);
document.addEventListener('keyup', (e) => keys[e.key] = false);

// Control por ratón
document.addEventListener('mousemove', (e) => {
    if (!gameState.running || gameState.paused) return;
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    if (mouseY >= 0 && mouseY <= canvas.height) {
        playerPaddle.y = Math.max(0, Math.min(mouseY - playerPaddle.height / 2, canvas.height - playerPaddle.height));
    }
});

// ==========================================
// FUNCIONES DE MENÚ
// ==========================================

function setGameMode(mode) {
    gameState.mode = mode;
    difficultySection.style.display = 'block';
}

function startGame(difficulty) {
    gameState.difficulty = difficulty;
    gameState.running = true;
    gameState.paused = false;
    gameState.playerScore = 0;
    gameState.computerScore = 0;
    gameState.hits = 0;
    gameState.powerUpsUsed = 0;
    gameState.totalPoints = 0;
    gameState.currentLevel = 1;
    gameState.startTime = Date.now();
    activePowerUps = [];

    mainMenu.classList.remove('active');
    settingsMenu.classList.remove('active');
    themeMenu.classList.remove('active');
    leaderboardMenu.classList.remove('active');
    gameContainer.classList.remove('game-hidden');
    gameOverMessage.classList.remove('active');
    pauseOverlay.classList.remove('active');

    resizeCanvas();
    resetBall();
    playerPaddle.y = canvas.height / 2 - playerPaddle.height / 2;
    computerPaddle.y = canvas.height / 2 - computerPaddle.height / 2;
    computerPaddle.x = canvas.width - 30 - computerPaddle.width;

    updateUI();
    gameLoop();
}

function togglePause() {
    if (!gameState.running) return;
    gameState.paused = !gameState.paused;
    pauseOverlay.classList.toggle('active');
    pauseBtn.textContent = gameState.paused ? '▶ Reanudar' : '⏸ Pausar';
    if (!gameState.paused) {
        gameLoop();
    }
}

function backToMenu() {
    gameState.running = false;
    gameContainer.classList.add('game-hidden');
    gameOverMessage.classList.remove('active');
    pauseOverlay.classList.remove('active');
    mainMenu.classList.add('active');
    gameState.paused = false;
    pauseBtn.textContent = '⏸ Pausar';
    saveLeaderboardEntry();
}

function toggleSettings() {
    mainMenu.classList.toggle('active');
    settingsMenu.classList.toggle('active');
}

function toggleThemeMenu() {
    mainMenu.classList.toggle('active');
    themeMenu.classList.toggle('active');
}

function toggleLeaderboard() {
    mainMenu.classList.toggle('active');
    leaderboardMenu.classList.toggle('active');
    loadLeaderboard('global');
}

// ==========================================
// CONFIGURACIÓN
// ==========================================

document.getElementById('soundToggle').addEventListener('change', (e) => {
    gameState.sound = e.target.checked;
});

document.getElementById('musicToggle').addEventListener('change', (e) => {
    // Implementar música de fondo en el futuro
});

document.getElementById('volumeSlider').addEventListener('input', (e) => {
    gameState.volume = e.target.value / 100;
    document.getElementById('volumeValue').textContent = e.target.value + '%';
});

document.getElementById('visualsToggle').addEventListener('change', (e) => {
    gameState.visuals = e.target.checked;
});

document.getElementById('trailsToggle').addEventListener('change', (e) => {
    gameState.trails = e.target.checked;
});

document.getElementById('ballSpeedSlider').addEventListener('input', (e) => {
    gameState.speedMultiplier = parseFloat(e.target.value);
    const speeds = { '0.5': 'Muy Lenta', '0.75': 'Lenta', '1': 'Normal', '1.25': 'Rápida', '1.5': 'Muy Rápida', '2': 'Extrema' };
    document.getElementById('speedValue').textContent = speeds[e.target.value] || 'Normal';
});

function setTheme(theme) {
    gameState.theme = theme;
    document.body.className = `theme-${theme}`;
    localStorage.setItem('pongTheme', theme);
    document.querySelectorAll('.theme-option').forEach(el => {
        el.style.borderColor = el.dataset.theme === theme ? 'var(--secondary-color)' : 'transparent';
    });
}

function resetData() {
    if (confirm('¿Estás seguro de que deseas resetear todos los datos?')) {
        localStorage.clear();
        location.reload();
    }
}

function exportStats() {
    const stats = JSON.stringify(JSON.parse(localStorage.getItem('pongLeaderboard') || '[]'), null, 2);
    const blob = new Blob([stats], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pong-stats.json';
    a.click();
}

// ==========================================
// TABLA DE PUNTUACIONES
// ==========================================

function saveLeaderboardEntry() {
    const entry = {
        name: `Jugador ${Math.floor(Math.random() * 1000)}`,
        score: gameState.playerScore,
        difficulty: gameState.difficulty,
        hits: gameState.hits,
        level: gameState.currentLevel,
        date: new Date().toISOString(),
        totalPoints: gameState.totalPoints
    };

    let leaderboard = JSON.parse(localStorage.getItem('pongLeaderboard') || '[]');
    leaderboard.push(entry);
    leaderboard.sort((a, b) => b.totalPoints - a.totalPoints);
    leaderboard = leaderboard.slice(0, 50);
    localStorage.setItem('pongLeaderboard', JSON.stringify(leaderboard));
}

function loadLeaderboard(filter) {
    let leaderboard = JSON.parse(localStorage.getItem('pongLeaderboard') || '[]');
    const now = new Date();

    if (filter === 'today') {
        leaderboard = leaderboard.filter(entry => {
            const entryDate = new Date(entry.date);
            return entryDate.toDateString() === now.toDateString();
        });
    } else if (filter === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        leaderboard = leaderboard.filter(entry => new Date(entry.date) >= weekAgo);
    }

    const content = document.getElementById('leaderboardContent');
    if (leaderboard.length === 0) {
        content.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Sin registros</p>';
        return;
    }

    content.innerHTML = leaderboard.map((entry, index) => `
        <div class="leaderboard-item">
            <span class="leaderboard-rank">#${index + 1}</span>
            <span class="leaderboard-name">${entry.name}</span>
            <span class="leaderboard-score">${entry.totalPoints}</span>
        </div>
    `).join('');
}

function switchLeaderboardTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    loadLeaderboard(tab);
}

// ==========================================
// LÓGICA DEL JUEGO
// ==========================================

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    const angle = Math.random() * Math.PI / 2 - Math.PI / 4;
    const speed = 6 * gameState.speedMultiplier;
    ball.speedX = (Math.random() > 0.5 ? 1 : -1) * speed * Math.cos(angle);
    ball.speedY = speed * Math.sin(angle);
    ball.trail = [];
}

function updateBall() {
    // Registrar trail
    if (gameState.trails) {
        ball.trail.push({ x: ball.x, y: ball.y });
        if (ball.trail.length > 30) ball.trail.shift();
    }

    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // Rebotes en paredes superior e inferior
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.speedY = -ball.speedY;
        ball.y = Math.max(ball.radius, Math.min(canvas.height - ball.radius, ball.y));
        playSound('wall');
        createParticles(ball.x, ball.y, '#0ff', 8);
    }

    // Fuera de límites
    if (ball.x - ball.radius < 0) {
        gameState.computerScore++;
        playSound('score');
        createParticles(ball.x, ball.y, '#ff00ff', 15);
        checkWin();
        resetBall();
    }
    if (ball.x + ball.radius > canvas.width) {
        gameState.playerScore++;
        gameState.totalPoints += 10;
        playSound('score');
        createParticles(ball.x, ball.y, '#00ff00', 15);
        checkWin();
        resetBall();
    }
}

function checkCollisions() {
    // Colisión con paddle del jugador
    if (
        ball.x - ball.radius < playerPaddle.x + playerPaddle.width &&
        ball.y > playerPaddle.y &&
        ball.y < playerPaddle.y + playerPaddle.height &&
        ball.speedX < 0
    ) {
        ball.speedX = -ball.speedX * 1.08;
        ball.x = playerPaddle.x + playerPaddle.width + ball.radius;
        
        let hitPos = (ball.y - (playerPaddle.y + playerPaddle.height / 2)) / (playerPaddle.height / 2);
        ball.speedY += hitPos * 6;
        
        gameState.hits++;
        gameState.totalPoints += 5;
        playSound('paddle');
        createParticles(ball.x, ball.y, '#00ff00', 10);
        
        // Aplicar power-ups magnéticos
        if (activePowerUps.some(p => p.type === 'magneticPaddle')) {
            ball.speedY *= 0.7;
        }
    }

    // Colisión con paddle de la computadora
    if (
        ball.x + ball.radius > computerPaddle.x &&
        ball.y > computerPaddle.y &&
        ball.y < computerPaddle.y + computerPaddle.height &&
        ball.speedX > 0
    ) {
        ball.speedX = -ball.speedX * 1.08;
        ball.x = computerPaddle.x - ball.radius;
        
        let hitPos = (ball.y - (computerPaddle.y + computerPaddle.height / 2)) / (computerPaddle.height / 2);
        ball.speedY += hitPos * 6;
        
        playSound('paddle');
        createParticles(ball.x, ball.y, '#ff00ff', 10);
    }

    // Limitar velocidad máxima
    const speed = Math.sqrt(ball.speedX ** 2 + ball.speedY ** 2);
    if (speed > ball.maxSpeed) {
        ball.speedX = (ball.speedX / speed) * ball.maxSpeed;
        ball.speedY = (ball.speedY / speed) * ball.maxSpeed;
    }
}

function updatePlayerPaddle() {
    if (keys['ArrowUp']) playerPaddle.y -= 8;
    if (keys['ArrowDown']) playerPaddle.y += 8;
    if (keys['w'] || keys['W']) playerPaddle.y -= 8;
    if (keys['s'] || keys['S']) playerPaddle.y += 8;

    playerPaddle.y = Math.max(0, Math.min(playerPaddle.y, canvas.height - playerPaddle.height));
}

function updateComputerPaddle() {
    const difficulties = {
        easy: { speed: 3, range: 80, maxSpeed: 4 },
        normal: { speed: 5, range: 40, maxSpeed: 6 },
        hard: { speed: 7, range: 20, maxSpeed: 8 },
        nightmare: { speed: 9, range: 5, maxSpeed: 10 }
    };

    const config = difficulties[gameState.difficulty];
    const computerCenter = computerPaddle.y + computerPaddle.height / 2;

    if (computerCenter < ball.y - config.range) {
        computerPaddle.y += config.speed;
    } else if (computerCenter > ball.y + config.range) {
        computerPaddle.y -= config.speed;
    }

    computerPaddle.y = Math.max(0, Math.min(computerPaddle.y, canvas.height - computerPaddle.height));
}

function updateSecondPlayerPaddle() {
    if (keys['w'] || keys['W']) playerPaddle.y -= 8;
    if (keys['s'] || keys['S']) playerPaddle.y += 8;

    if (keys['ArrowUp']) computerPaddle.y -= 8;
    if (keys['ArrowDown']) computerPaddle.y += 8;

    playerPaddle.y = Math.max(0, Math.min(playerPaddle.y, canvas.height - playerPaddle.height));
    computerPaddle.y = Math.max(0, Math.min(computerPaddle.y, canvas.height - computerPaddle.height));
}

function checkWin() {
    if (gameState.playerScore >= gameState.winScore) {
        endGame(`🎉 ¡GANASTE!`, true);
    } else if (gameState.computerScore >= gameState.winScore) {
        endGame(`🤖 GAME OVER`, false);
    }
}

// ==========================================
// POWER-UPS
// ==========================================

function spawnPowerUp() {
    if (Math.random() < 0.02) { // 2% de probabilidad cada frame
        const types = Object.keys(powerUps);
        const type = types[Math.floor(Math.random() * types.length)];
        activePowerUps.push({
            type: type,
            startTime: Date.now(),
            duration: powerUps[type].duration
        });

        gameState.powerUpsUsed++;
        gameState.totalPoints += 20;
        playSound('powerup');

        // Aplicar efecto del power-up
        applyPowerUp(type);
    }
}

function applyPowerUp(type) {
    switch(type) {
        case 'slowBall':
            ball.speedX *= 0.6;
            ball.speedY *= 0.6;
            break;
        case 'fastBall':
            ball.speedX *= 1.4;
            ball.speedY *= 1.4;
            break;
        case 'largerPaddle':
            playerPaddle.height = 200;
            setTimeout(() => playerPaddle.height = 120, powerUps[type].duration);
            break;
    }
}

function updatePowerUps() {
    activePowerUps = activePowerUps.filter(powerUp => {
        const elapsed = Date.now() - powerUp.startTime;
        return elapsed < powerUp.duration;
    });
}

// ==========================================
// SONIDO
// ==========================================

function playSound(type) {
    if (!gameState.sound) return;

    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        gainNode.gain.value = gameState.volume * 0.2;

        const sounds = {
            paddle: { freq: 400, duration: 0.1 },
            wall: { freq: 300, duration: 0.08 },
            score: { freq: 600, duration: 0.15 },
            win: { freq: 800, duration: 0.3 },
            powerup: { freq: 1000, duration: 0.2 }
        };

        const sound = sounds[type] || sounds.paddle;
        oscillator.frequency.value = sound.freq;
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + sound.duration);
    } catch (e) {
        console.log('Audio no disponible');
    }
}

// ==========================================
// EFECTOS VISUALES
// ==========================================

function createParticles(x, y, color, count = 8) {
    if (!gameState.visuals) return;

    for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;
        const velocity = Math.random() * 4 + 2;
        const particle = {
            x: x,
            y: y,
            vx: Math.cos(angle) * velocity,
            vy: Math.sin(angle) * velocity,
            life: 1,
            color: color,
            size: Math.random() * 4 + 2
        };
        particles.push(particle);
    }
}

let particles = [];

function updateParticles() {
    particles = particles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;
        p.vy += 0.1; // Gravedad
        return p.life > 0;
    });
}

// ==========================================
// UI
// ==========================================

function updateUI() {
    document.getElementById('playerScore').textContent = gameState.playerScore;
    document.getElementById('computerScore').textContent = gameState.computerScore;
    document.getElementById('difficultyDisplay').textContent = gameState.difficulty.toUpperCase();
    document.getElementById('levelDisplay').textContent = `Nivel ${gameState.currentLevel}`;
    document.getElementById('hitsDisplay').textContent = `⚔️ Golpes: ${gameState.hits}`;
    
    const elapsed = Math.floor((Date.now() - gameState.startTime) / 1000);
    document.getElementById('timeDisplay').textContent = `⏱️ Tiempo: ${elapsed}s`;
    document.getElementById('powerUpDisplay').textContent = `💫 Power-ups: ${activePowerUps.length}`;
}

function endGame(title, playerWon) {
    gameState.running = false;
    playSound('win');

    const elapsed = Math.floor((Date.now() - gameState.startTime) / 1000);

    document.getElementById('gameOverTitle').textContent = title;
    document.getElementById('gameOverText').textContent = playerWon ? 'Nivel Completado' : 'Intenta de Nuevo';
    document.getElementById('statPlayerScore').textContent = gameState.playerScore;
    document.getElementById('statComputerScore').textContent = gameState.computerScore;
    document.getElementById('statHits').textContent = gameState.hits;
    document.getElementById('statTime').textContent = elapsed + 's';
    document.getElementById('statPowerUps').textContent = gameState.powerUpsUsed;
    document.getElementById('statTotalPoints').textContent = gameState.totalPoints;

    gameOverMessage.classList.add('active');
}

// ==========================================
// RENDERIZADO
// ==========================================

function draw() {
    // Limpiar canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Línea central
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.3)';
    ctx.setLineDash([15, 15]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Dibujar trails
    if (gameState.trails) {
        ball.trail.forEach((point, index) => {
            ctx.fillStyle = `rgba(0, 255, 255, ${index / ball.trail.length * 0.4})`;
            ctx.beginPath();
            ctx.arc(point.x, point.y, ball.radius * 0.7, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    // Dibujar paddles
    drawPaddle(playerPaddle);
    drawPaddle(computerPaddle);

    // Dibujar bola
    ctx.fillStyle = '#fff';
    ctx.shadowColor = 'rgba(0, 255, 255, 0.8)';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Dibujar partículas
    particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    });

    // Dibujar poder-ups activos
    activePowerUps.forEach((powerUp, index) => {
        ctx.fillStyle = powerUps[powerUp.type].color;
        ctx.font = '20px Arial';
        ctx.fillText(powerUps[powerUp.type].symbol, 50 + index * 40, 50);
    });
}

function drawPaddle(paddle) {
    const theme = gameState.theme;
    if (paddle === playerPaddle) {
        ctx.fillStyle = 'rgba(0, 255, 0, 0.8)';
        ctx.shadowColor = '#0f0';
    } else {
        ctx.fillStyle = 'rgba(255, 0, 255, 0.8)';
        ctx.shadowColor = '#f0f';
    }
    ctx.shadowBlur = 15;
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.shadowBlur = 0;
}

// ==========================================
// BUCLE PRINCIPAL
// ==========================================

function gameLoop() {
    if (!gameState.running || gameState.paused) {
        requestAnimationFrame(gameLoop);
        return;
    }

    if (gameState.mode === 'solo') {
        updatePlayerPaddle();
        updateComputerPaddle();
    } else {
        updateSecondPlayerPaddle();
    }

    updateBall();
    checkCollisions();
    spawnPowerUp();
    updatePowerUps();
    updateParticles();
    updateUI();
    draw();

    requestAnimationFrame(gameLoop);
}

// ==========================================
// INICIALIZACIÓN
// ==========================================

window.addEventListener('load', () => {
    resizeCanvas();

    // Cargar tema guardado
    const savedTheme = localStorage.getItem('pongTheme') || 'cyberpunk';
    setTheme(savedTheme);

    // Cargar preferencias
    const soundSetting = localStorage.getItem('pongSound');
    if (soundSetting !== null) {
        gameState.sound = soundSetting === 'true';
        document.getElementById('soundToggle').checked = gameState.sound;
    }
});

// Evitar que la página se desplace
window.addEventListener('keydown', (e) => {
    if (['ArrowUp', 'ArrowDown', ' '].includes(e.key)) {
        e.preventDefault();
    }
});