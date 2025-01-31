const cardsArray = ['🍎', '🍊', '🍇', '🍉', '🍌', '🍒', '🍍', '🍓', '🍑', '🥭', '🍈', '🍋', '🥝', '🥥', '🍐', '🍏', '🍉', '🍔'];
let firstCard, secondCard;
let hasFlippedCard = false;
let lockBoard = false;
let moves = 0;
let matchedPairs = 0;
let timer;
let secondsElapsed = 0;

const gameBoard = document.querySelector('.game-board');
const timerDisplay = document.getElementById('timer');
const movesDisplay = document.getElementById('moves');
const restartButton = document.getElementById('restart');
const matchSound = document.getElementById('match-sound');
const noMatchSound = document.getElementById('no-match-sound');
const themeToggleButton = document.getElementById('theme-toggle');
const levelSelect = document.getElementById('level-select');

// Configurações de nível
levelSelect.addEventListener('change', () => {
    restartGame();
});

// Alternar modo escuro
themeToggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    themeToggleButton.textContent = document.body.classList.contains('dark-mode') ? 'Modo Claro' : 'Modo Escuro';
});

// Criar cartas dinamicamente
function createCards(numPairs) {
    const deck = shuffleCards([...cardsArray.slice(0, numPairs), ...cardsArray.slice(0, numPairs)]);
    gameBoard.style.gridTemplateColumns = `repeat(${Math.ceil(Math.sqrt(numPairs * 2))}, 100px)`;
    gameBoard.innerHTML = '';
    deck.forEach(symbol => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front"></div>
                <div class="card-back">${symbol}</div>
            </div>`;
        gameBoard.appendChild(card);
        card.addEventListener('click', flipCard);
    });
}

// Embaralhar cartas
function shuffleCards(deck) {
    return deck.sort(() => Math.random() - 0.5);
}

// Virar carta
function flipCard() {
    if (lockBoard || this === firstCard) return;

    this.classList.add('flipped');
    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
    } else {
        secondCard = this;
        checkForMatch();
    }
}

// Checar correspondência
function checkForMatch() {
    moves++;
    movesDisplay.textContent = moves;
    const isMatch = firstCard.querySelector('.card-back').textContent === secondCard.querySelector('.card-back').textContent;
    isMatch ? disableCards() : unflipCards();
}

// Desabilitar cartas
function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    matchSound.play();
    matchedPairs++;
    if (matchedPairs === parseInt(levelSelect.value) / 2) {
        clearInterval(timer);
        setTimeout(() => alert(`Você venceu em ${moves} movimentos e ${secondsElapsed} segundos.`), 500);
    }
    resetBoard();
}

// Desvirar cartas
function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        noMatchSound.play();
        resetBoard();
    }, 1000);
}

// Resetar estado do tabuleiro
function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

// Iniciar temporizador
function startTimer() {
    clearInterval(timer);
    secondsElapsed = 0;
    timer = setInterval(() => {
        secondsElapsed++;
        const minutes = Math.floor(secondsElapsed / 60);
        const seconds = secondsElapsed % 60;
        timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);
}

// Reiniciar jogo
function restartGame() {
    clearInterval(timer);
    moves = 0;
    matchedPairs = 0;
    movesDisplay.textContent = '0';
    timerDisplay.textContent = '00:00';

    // Define o número de pares com base no nível selecionado
    const selectedLevel = parseInt(levelSelect.value);
    createCards(selectedLevel / 2);
    startTimer();
}

// Inicializar jogo
document.addEventListener('DOMContentLoaded', () => {
    createCards(levelSelect.value / 2);
    startTimer();
});
