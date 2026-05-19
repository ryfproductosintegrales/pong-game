// ========== VARIABLES DE CONFIGURACIÓN ==========
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Dimensiones del Canvas
canvas.width = 800;
canvas.height = 400;

// ========== ESTADO DEL JUEGO ==========
let gameState = {
    isRunning: false,
    isPaused: false,
    gameMode: 'solo',
    difficulty: 'normal',
    gameTime: 0,
    powerUpsCollected: 0
};

// ========== OBJETOS DEL JUEGO ==========
const paddle = {
    x: 10,
    y: canvas.height / 2 - 40,
    width: 10,
    height: 80,
    speed: 6,
    dy: 0,
    score: 0
};

const computer = {
    x: canvas.width - 20,
    y: canvas.height / 2 - 40,
    width: 10,
    height: 80,
    speed: 4,
    dy: 0,
    score: 0
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 6,
    dx: 5,
    dy: 5,
    speed: 5,
    maxSpeed: 8,
    hits: 0
};

// ========== VARIABLES DE ENTRADA ==========
let keys = {};
let mouseY = canvas.height / 2;

// ========== CONFIGURACIÓN DEL JUEGO ==========
let gameSettings = {
    sound: true,
    music: true,
    volume: 0.7,
    visuals: true,
    trails: true,
    ballSpeed: 1,
    mouseControl: true,
    vibration: true,
    theme: 'cyberpunk'
};

// ========== PARTÍCULAS ==========
let particles = [];

class Particle {
    constructor(x, y, vx, vy, color, life = 30) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.life = life;
        this.maxLife = life;
        this.size = Math.random() * 3 + 2;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.1;
        this.life--;
    }

    draw(ctx) {
        const alpha = this.life / this.maxLife;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// ========== EVENT LISTENERS ==========
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if (e.key === ' ') {
        e.preventDefault();
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

document.addEventListener('mousemove', (e) => {
    if (gameSettings.mouseControl) {
        const rect = canvas.getBoundingClientRect();
        mouseY = e.clientY - rect.top;
    }
});

// ========== FUNCIONES DE MENÚ ==========
function setGameMode(mode) {
    gameState.gameMode = mode;
    const difficultySection = document.getElementById('difficultySection');
    if (mode === 'solo') {
        difficultySection.style.display = 'block';
    } else {
        difficultySection.style.display = 'none';
        startGame('multiplayer');
    }
}

function startGame(difficulty) {
    if (difficulty !== 'multiplayer') {
        gameState.difficulty = difficulty;
        setComputerDifficulty(difficulty);
    }
    
    resetGame();
    showGameContainer();
    gameState.isRunning = true;
    
    document.getElementById('mainMenu').classList.remove('active');
    
    gameLoop();
}

function setComputerDifficulty(difficulty) {
    switch(difficulty) {
        case 'easy':
            computer.speed = 2;
            break;
        case 'normal':
            computer.speed = 4;
            break;
        case 'hard':
            computer.speed = 5.5;
            break;
        case 'nightmare':
            computer.speed = 7;
            break;
    }
}

function showGameContainer() {
    document.getElementById('gameContainer').classList.add('active');
    document.getElementById('gameContainer').classList.remove('game-hidden');
}

function hideGameContainer() {
    document.getElementById('gameContainer').classList.remove('active');
    document.getElementById('gameContainer').classList.add('game-hidden');
}

function resetGame() {
    paddle.y = canvas.height / 2 - 40;
    paddle.score = 0;
    computer.y = canvas.height / 2 - 40;
    computer.score = 0;
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = 5;
    ball.dy = 5;
    ball.hits = 0;
    gameState.gameTime = 0;
    gameState.powerUpsCollected = 0;
    gameState.isPaused = false;
    particles = [];
    
    updateScoreboard();
}

function togglePause() {
    gameState.isPaused = !gameState.isPaused;
    const pauseOverlay = document.getElementById('pauseOverlay');
    
    if (gameState.isPaused) {
        pauseOverlay.classList.add('active');
    } else {
        pauseOverlay.classList.remove('active');
    }
}

function backToMenu() {
    gameState.isRunning = false;
    gameState.isPaused = false;
    hideGameContainer();
    document.getElementById('mainMenu').classList.add('active');
    document.getElementById('pauseOverlay').classList.remove('active');
    document.getElementById('gameOverMessage').classList.remove('active');
}

// ========== FUNCIONES DE CONFIGURACIÓN ==========
function toggleSettings() {
    const mainMenu = document.getElementById('mainMenu');
    const settingsMenu = document.getElementById('settingsMenu');
    
    mainMenu.classList.toggle('active');
    settingsMenu.classList.toggle('active');
}

function toggleThemeMenu() {
    const mainMenu = document.getElementById('mainMenu');
    const themeMenu = document.getElementById('themeMenu');
    
    mainMenu.classList.toggle('active');
    themeMenu.classList.toggle('active');
}

function toggleLeaderboard() {
    const mainMenu = document.getElementById('mainMenu');
    const leaderboardMenu = document.getElementById('leaderboardMenu');
    
    mainMenu.classList.toggle('active');
    leaderboardMenu.classList.toggle('active');
    
    if (leaderboardMenu.classList.contains('active')) {
        loadLeaderboard('global');
    }
}

function setTheme(theme) {
    gameSettings.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('pongTheme', theme);
}

function resetData() {
    if (confirm('¿Estás seguro de que quieres resetear todos los datos?')) {
        localStorage.clear();
        alert('Datos reseteados');
        location.reload();
    }
}

function exportStats() {
    const stats = localStorage.getItem('pongStats') || '{}';
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(stats);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "pong_stats.json");
    downloadAnchor.click();
}

// ========== TABLA DE PUNTUACIONES ==========
function loadLeaderboard(tab) {
    const leaderboardContent = document.getElementById('leaderboardContent');
    const stats = JSON.parse(localStorage.getItem('pongStats') || '[]');
    
    let filteredStats = stats;
    const now = new Date();
    
    if (tab === 'today') {
        filteredStats = stats.filter(stat => {
            const statDate = new Date(stat.date);
            return statDate.toDateString() === now.toDateString();
        });
    } else if (tab === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filteredStats = stats.filter(stat => {
            const statDate = new Date(stat.date);
            return statDate >= weekAgo;
        });
    }
    
    filteredStats.sort((a, b) => b.totalPoints - a.totalPoints);
    
    leaderboardContent.innerHTML = '';
    
    if (filteredStats.length === 0) {
        leaderboardContent.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No hay datos disponibles</p>';
        return;
    }
    
    filteredStats.slice(0, 10).forEach((stat, index) => {
        const entry = document.createElement('div');
        entry.className = 'leaderboard-entry';
        entry.innerHTML = `
            <span class="leaderboard-rank rank-${index + 1}">#${index + 1}</span>
            <span class="leaderboard-name">Jugador ${index + 1}</span>
            <span class="leaderboard-score">${stat.totalPoints} pts</span>
        `;
        leaderboardContent.appendChild(entry);
    });
}

function switchLeaderboardTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    loadLeaderboard(tab);
}

// ========== FÍSICA DEL JUEGO ==========
function updatePaddle() {
    if (keys['ArrowUp'] || keys['w'] || keys['W']) {
        paddle.dy = -paddle.speed;
    } else if (keys['ArrowDown'] || keys['s'] || keys['S']) {
        paddle.dy = paddle.speed;
    } else {
        paddle.dy = 0;
    }
    
    if (gameSettings.mouseControl && mouseY) {
        const paddleCenter = paddle.y + paddle.height / 2;
        const diff = mouseY - paddleCenter;
        if (Math.abs(diff) > 5) {
            paddle.dy = Math.sign(diff) * paddle.speed;
        }
    }
    
    paddle.y += paddle.dy;
    
    if (paddle.y < 0) paddle.y = 0;
    if (paddle.y + paddle.height > canvas.height) paddle.y = canvas.height - paddle.height;
}

function updateComputer() {
    const computerCenter = computer.y + computer.height / 2;
    const ballCenter = ball.y;
    
    const diff = ballCenter - computerCenter;
    
    let reactionDelay = 0;
    switch(gameState.difficulty) {
        case 'easy':
            reactionDelay = 50;
            break;
        case 'normal':
            reactionDelay = 20;
            break;
        case 'hard':
            reactionDelay = 5;
            break;
        case 'nightmare':
            reactionDelay = 0;
            break;
    }
    
    if (Math.abs(diff) > reactionDelay) {
        computer.dy = Math.sign(diff) * computer.speed;
    } else {
        computer.dy *= 0.8;
    }
    
    computer.y += computer.dy;
    
    if (computer.y < 0) computer.y = 0;
    if (computer.y + computer.height > canvas.height) computer.y = canvas.height - computer.height;
}

function updateBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;
    
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.dy = -ball.dy;
        ball.y = ball.y - ball.radius < 0 ? ball.radius : canvas.height - ball.radius;
        playSound('bounce');
        createParticles(ball.x, ball.y, 5, '#00d4ff');
    }
    
    if (ball.x - ball.radius < paddle.x + paddle.width &&
        ball.y > paddle.y &&
        ball.y < paddle.y + paddle.height) {
        
        ball.dx = Math.abs(ball.dx);
        
        const collidePoint = ball.y - (paddle.y + paddle.height / 2);
        const normalizedCollide = collidePoint / (paddle.height / 2);
        const angleRad = (Math.PI / 4) * normalizedCollide;
        
        ball.dx = ball.speed * Math.cos(angleRad) * gameSettings.ballSpeed;
        ball.dy = ball.speed * Math.sin(angleRad) * gameSettings.ballSpeed;
        
        ball.x = paddle.x + paddle.width + ball.radius;
        
        ball.hits++;
        paddle.score += 10;
        
        playSound('paddle');
        createParticles(ball.x, ball.y, 8, '#ffbe0b');
    }
    
    if (ball.x + ball.radius > computer.x &&
        ball.y > computer.y &&
        ball.y < computer.y + computer.height) {
        
        ball.dx = -Math.abs(ball.dx);
        
        const collidePoint = ball.y - (computer.y + computer.height / 2);
        const normalizedCollide = collidePoint / (computer.height / 2);
        const angleRad = (Math.PI / 4) * normalizedCollide;
        
        ball.dx = -ball.speed * Math.cos(angleRad) * gameSettings.ballSpeed;
        ball.dy = ball.speed * Math.sin(angleRad) * gameSettings.ballSpeed;
        
        ball.x = computer.x - ball.radius;
        
        playSound('paddle');
        createParticles(ball.x, ball.y, 8, '#ff006e');
    }
    
    if (ball.x - ball.radius < 0) {
        computer.score++;
        playSound('score');
        resetBall();
    }
    
    if (ball.x + ball.radius > canvas.width) {
        paddle.score++;
        playSound('score');
        resetBall();
    }
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = (Math.random() > 0.5 ? 1 : -1) * 5;
    ball.dy = (Math.random() - 0.5) * 5;
    ball.hits = 0;
}

// ========== PARTÍCULAS ==========
function createParticles(x, y, count, color) {
    if (!gameSettings.visuals) return;
    
    for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;
        const speed = 2 + Math.random() * 3;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        particles.push(new Particle(x, y, vx, vy, color, 30));
    }
}

function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        if (particles[i].life <= 0) {
            particles.splice(i, 1);
        }
    }
}

// ========== SONIDOS ==========
function playSound(type) {
    if (!gameSettings.sound) return;
    
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const now = audioContext.currentTime;
    
    switch(type) {
        case 'bounce':
        case 'paddle':
            const osc1 = audioContext.createOscillator();
            const gain1 = audioContext.createGain();
            osc1.connect(gain1);
            gain1.connect(audioContext.destination);
            osc1.frequency.value = 400;
            gain1.gain.setValueAtTime(gameSettings.volume * 0.3, now);
            gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            osc1.start(now);
            osc1.stop(now + 0.1);
            break;
        case 'score':
            const osc2 = audioContext.createOscillator();
            const gain2 = audioContext.createGain();
            osc2.connect(gain2);
            gain2.connect(audioContext.destination);
            osc2.frequency.setValueAtTime(800, now);
            osc2.frequency.exponentialRampToValueAtTime(600, now + 0.2);
            gain2.gain.setValueAtTime(gameSettings.volume * 0.2, now);
            gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
            osc2.start(now);
            osc2.stop(now + 0.2);
            break;
    }
}

// ========== RENDERIZADO ==========
function draw() {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.3)';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
    
    drawPaddle(paddle, '#00d4ff');
    drawPaddle(computer, '#ff006e');
    
    ctx.fillStyle = '#ffbe0b';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    
    if (gameSettings.visuals) {
        ctx.strokeStyle = 'rgba(255, 190, 11, 0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius + 3, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    particles.forEach(particle => {
        particle.draw(ctx);
    });
    
    if (gameSettings.trails) {
        ctx.fillStyle = 'rgba(255, 190, 11, 0.2)';
        ctx.beginPath();
        ctx.arc(ball.x - ball.dx * 0.5, ball.y - ball.dy * 0.5, ball.radius * 0.8, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawPaddle(paddle, color) {
    ctx.fillStyle = color;
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    
    if (gameSettings.visuals) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
        
        ctx.strokeStyle = `rgba(${color === '#00d4ff' ? '0, 212, 255' : '255, 0, 110'}, 0.5)`;
        ctx.lineWidth = 3;
        ctx.strokeRect(paddle.x - 2, paddle.y - 2, paddle.width + 4, paddle.height + 4);
    }
}

// ========== ACTUALIZACIÓN DE UI ==========
function updateScoreboard() {
    document.getElementById('playerScore').textContent = paddle.score;
    document.getElementById('computerScore').textContent = computer.score;
    document.getElementById('hitsDisplay').textContent = `⚔️ Golpes: ${ball.hits}`;
    document.getElementById('timeDisplay').textContent = `⏱️ Tiempo: ${Math.floor(gameState.gameTime)}s`;
    document.getElementById('powerUpDisplay').textContent = `💫 Power-ups: ${gameState.powerUpsCollected}`;
    document.getElementById('difficultyDisplay').textContent = gameState.difficulty.charAt(0).toUpperCase() + gameState.difficulty.slice(1);
}

// ========== CONTROLES DE CONFIGURACIÓN ==========
document.getElementById('soundToggle').addEventListener('change', (e) => {
    gameSettings.sound = e.target.checked;
});

document.getElementById('musicToggle').addEventListener('change', (e) => {
    gameSettings.music = e.target.checked;
});

document.getElementById('volumeSlider').addEventListener('input', (e) => {
    gameSettings.volume = e.target.value / 100;
    document.getElementById('volumeValue').textContent = e.target.value + '%';
});

document.getElementById('visualsToggle').addEventListener('change', (e) => {
    gameSettings.visuals = e.target.checked;
});

document.getElementById('trailsToggle').addEventListener('change', (e) => {
    gameSettings.trails = e.target.checked;
});

document.getElementById('ballSpeedSlider').addEventListener('input', (e) => {
    gameSettings.ballSpeed = parseFloat(e.target.value);
    const speedNames = { '0.5': 'Lenta', '0.75': 'Normal-Lenta', '1': 'Normal', '1.25': 'Normal-Rápida', '1.5': 'Rápida', '1.75': 'Muy Rápida', '2': 'Extrema' };
    document.getElementById('speedValue').textContent = speedNames[e.target.value] || 'Normal';
});

document.getElementById('mouseControlToggle').addEventListener('change', (e) => {
    gameSettings.mouseControl = e.target.checked;
});

document.getElementById('vibrationToggle').addEventListener('change', (e) => {
    gameSettings.vibration = e.target.checked;
});

// ========== GAME OVER ==========
function checkGameOver() {
    const winScore = 10;
    
    if (paddle.score >= winScore || computer.score >= winScore) {
        gameState.isRunning = false;
        showGameOver();
        saveStats();
    }
}

function showGameOver() {
    const gameOverMessage = document.getElementById('gameOverMessage');
    const gameOverTitle = document.getElementById('gameOverTitle');
    const gameOverText = document.getElementById('gameOverText');
    
    const playerWon = paddle.score > computer.score;
    gameOverTitle.textContent = playerWon ? '¡GANASTE! 🎉' : 'GAME OVER 💔';
    gameOverTitle.style.color = playerWon ? '#00d4ff' : '#ff006e';
    gameOverText.textContent = playerWon 
        ? `¡Excelente trabajo! Ganaste ${paddle.score} - ${computer.score}`
        : `La IA ganó. Final ${computer.score} - ${paddle.score}`;
    
    document.getElementById('statPlayerScore').textContent = paddle.score;
    document.getElementById('statComputerScore').textContent = computer.score;
    document.getElementById('statHits').textContent = ball.hits;
    document.getElementById('statTime').textContent = Math.floor(gameState.gameTime) + 's';
    document.getElementById('statPowerUps').textContent = gameState.powerUpsCollected;
    
    const totalPoints = (paddle.score * 100) + (ball.hits * 10) + Math.floor(gameState.gameTime);
    document.getElementById('statTotalPoints').textContent = totalPoints;
    
    gameOverMessage.classList.add('active');
}

function saveStats() {
    const stats = JSON.parse(localStorage.getItem('pongStats') || '[]');
    const totalPoints = (paddle.score * 100) + (ball.hits * 10) + Math.floor(gameState.gameTime);
    
    stats.push({
        playerScore: paddle.score,
        computerScore: computer.score,
        hits: ball.hits,
        time: Math.floor(gameState.gameTime),
        powerUps: gameState.powerUpsCollected,
        totalPoints: totalPoints,
        difficulty: gameState.difficulty,
        date: new Date().toISOString()
    });
    
    localStorage.setItem('pongStats', JSON.stringify(stats.slice(-100)));
}

// ========== LOOP PRINCIPAL ==========
let lastTime = 0;
function gameLoop(currentTime) {
    if (lastTime === 0) lastTime = currentTime;
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;
    
    if (gameState.isRunning && !gameState.isPaused) {
        updatePaddle();
        updateComputer();
        updateBall();
        updateParticles();
        
        gameState.gameTime += deltaTime;
        updateScoreboard();
        
        checkGameOver();
    }
    
    draw();
    
    requestAnimationFrame(gameLoop);
}

// ========== INICIALIZACIÓN ==========
window.addEventListener('load', () => {
    const savedTheme = localStorage.getItem('pongTheme') || 'cyberpunk';
    setTheme(savedTheme);
    
    function resizeCanvas() {
        const container = document.querySelector('.game-canvas');
        if (container && gameState.isRunning) {
            const maxWidth = container.clientWidth - 6;
            const maxHeight = container.clientHeight - 6;
            
            const ratio = 2;
            let width = maxWidth;
            let height = width / ratio;
            
            if (height > maxHeight) {
                height = maxHeight;
                width = height * ratio;
            }
            
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
        }
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    requestAnimationFrame(gameLoop);
});

document.addEventListener('contextmenu', (e) => e.preventDefault());
