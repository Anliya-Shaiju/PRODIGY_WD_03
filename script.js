const board = document.getElementById('board');
const statusText = document.getElementById('statusText');

const startGameBtn = document.getElementById('startGameBtn');
const playerModeSelect = document.getElementById('playerMode');
const firstPlayerSelect = document.getElementById('firstPlayer');
const computerScore = document.getElementById('computerScore');
const playerScore = document.getElementById('playerScore');
const draws = document.getElementById('draws');

let currentPlayer = 'X';
let gameState = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
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

// Initialize the board
function createBoard() {
    board.innerHTML = '';
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        cell.addEventListener('click', handleCellClick);
        board.appendChild(cell);
    }
}
function handleCellClick(event) {
    const cell = event.target;
    const index = cell.dataset.index;

    if (gameState[index] !== '' || !gameActive) return;

    gameState[index] = currentPlayer;
    cell.textContent = currentPlayer;

    // Add class for styling (X or O)
    cell.classList.add(currentPlayer.toLowerCase());

    checkWinner();

    if (aiEnabled && gameActive && currentPlayer === 'O') {
        setTimeout(aiMove, 500);
    }
}

// Check for winner or draw
function checkWinner() {
    let roundWon = false;

    for (let condition of winConditions) {
        const [a, b, c] = condition;
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusText.textContent = `Player ${currentPlayer} Wins!`;
        if (currentPlayer === 'X') playerScore.textContent++;
        else computerScore.textContent++;
        gameActive = false;
        return;
    }

    if (!gameState.includes('')) {
        statusText.textContent = `It's a Draw!`;
        draws.textContent++;
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusText.textContent = `Player ${currentPlayer}'s Turn`;
}

// Restart the game
function resetGame() {
    gameState = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = firstPlayerSelect.value;
    statusText.textContent = `Player ${currentPlayer}'s Turn`;
    createBoard();
}

// Event Listeners
startGameBtn.addEventListener('click', resetGame);

createBoard();
