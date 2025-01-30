// Adicionar 20 pares de frutas
const cardsArray = ['🍎', '🍊', '🍇', '🍉', '🍌', '🍒', '🍍', '🍓', '🍑', '🥭', 
    '🍎', '🍊', '🍇', '🍉', '🍌', '🍒', '🍍', '🍓', '🍑', '🥭',
    '🍈', '🍋', '🍍', '🍒', '🍍', '🍉', '🍋', '🍇', '🍓', '🍏',
    '🍑', '🍎', '🍒', '🍇', '🍊', '🍉', '🥭', '🍒', '🍌', '🍊'];

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

// Embaralhar cartas
function shuffleCards() {
return cardsArray.sort(() => Math.random() - 0.5);
}

// Criar cartas dinamicamente
function createCards() {
gameBoard.innerHTML = '';
shuffleCards().forEach(symbol => {
const card = document.createElement('div');
card.classList.add('card');
card.innerHTML = `
<div class="card-inner">
<div class="card-front"></div>
<div class="card-back">${symbol}</div>
</div>
`;
gameBoard.appendChild(card);
card.addEventListener('click', flipCard);
});
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

// Checar se as cartas combinam
function checkForMatch() {
moves++;
movesDisplay.textContent = moves;

const isMatch = firstCard.querySelector('.card-back').textContent ===
    secondCard.querySelector('.card-back').textContent;

isMatch ? disableCards() : unflipCards();
}

// Desabilitar cartas
function disableCards() {
firstCard.removeEventListener('click', flipCard);
secondCard.removeEventListener('click', flipCard);

matchSound.play();
matchedPairs++;

if (matchedPairs === cardsArray.length / 2) {
clearInterval(timer);
setTimeout(() => alert(`Parabéns! Você completou o jogo em ${moves} movimentos e ${secondsElapsed} segundos.`), 500);
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
secondsElapsed = 0;
moves = 0;
matchedPairs = 0;
movesDisplay.textContent = '0';
timerDisplay.textContent = '00:00';
createCards();
startTimer();
}

// Inicializar jogo
document.addEventListener('DOMContentLoaded', () => {
createCards();
startTimer();
});

restartButton.addEventListener('click', restartGame);



// Referência ao botão para alternar o tema
const themeToggleButton = document.getElementById('theme-toggle');

// Alternar entre modo claro e escuro
themeToggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        themeToggleButton.textContent = 'Modo Claro'; // Altera o texto do botão para "Modo Claro"
    } else {
        themeToggleButton.textContent = 'Modo Escuro'; // Altera o texto do botão para "Modo Escuro"
    }
});
