const board = document.getElementById('board');
const statusText = document.getElementById('statusText');
const restartBtn = document.getElementById('restartBtn');
const startGameBtn = document.getElementById('startGameBtn');
const playerModeSelect = document.getElementById('playerMode');
const firstPlayerSelect = document.getElementById('firstPlayer');
const cells = document.querySelectorAll(".cell");

let currentPlayer = 'X';
let gameState = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let playerMode = 'player'; // Default mode
let aiEnabled = false;

// Winning combinations
const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

// Start the game with settings
startGameBtn.addEventListener('click', () => {
    playerMode = playerModeSelect.value;
    aiEnabled = playerMode === 'ai';
    currentPlayer = firstPlayerSelect.value;

    resetGame();
    board.style.display = 'grid';
    restartBtn.style.display = 'inline-block';
    statusText.textContent = `Player ${currentPlayer}'s Turn`;
});

// Create the board
function createBoard() {
    board.innerHTML = ''; // Clear any existing cells
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        cell.addEventListener('click', handleCellClick);
        board.appendChild(cell);
    }
}

// Handle cell click
function handleCellClick(event) {
    if (!gameActive) return; // Disable clicks when game is over

    const cell = event.target;
    const index = cell.dataset.index;

    if (gameState[index] !== '') return;

    gameState[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer === 'X' ? 'x' : 'o');

    checkWinner();

    if (aiEnabled && gameActive && currentPlayer === 'O') {
        setTimeout(aiMove, 500);
    } else if (gameActive) {
        switchTurn();
    }
}

// AI makes a move
function aiMove() {
    const emptyCells = gameState
        .map((value, index) => (value === '' ? index : null))
        .filter(index => index !== null);

    if (emptyCells.length > 0) {
        const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        gameState[randomIndex] = currentPlayer;
        const cell = board.querySelector(`[data-index="${randomIndex}"]`);
        cell.textContent = currentPlayer;
        cell.classList.add('o');

        checkWinner();
    }
}

// Check for a winner or a draw
function checkWinner() {
    let roundWon = false;

    for (let condition of winConditions) {
        const [a, b, c] = condition;
        if (
            gameState[a] &&
            gameState[a] === gameState[b] &&
            gameState[a] === gameState[c]
        ) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusText.textContent = `Player ${currentPlayer} Wins!`;
        gameActive = false; // Disable further moves
        return;
    }

    if (!gameState.includes('')) {
        statusText.textContent = `It's a Draw!`;
        gameActive = false; // Disable further moves
        return;
    }
}

// Switch turns
function switchTurn() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusText.textContent = `Player ${currentPlayer}'s Turn`;
}

// Restart the game
function resetGame() {
    currentPlayer = firstPlayerSelect.value;
    gameState = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    createBoard();
    statusText.textContent = `Player ${currentPlayer}'s Turn`;
}

// Initialize the game
restartBtn.addEventListener('click', resetGame);
createBoard();
