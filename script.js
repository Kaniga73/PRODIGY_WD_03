const cells = document.querySelectorAll('.cell');
const statusDiv = document.getElementById('status');
const resetBtn = document.getElementById('reset');
const modeHumanBtn = document.getElementById('mode-human');
const modeAIBtn = document.getElementById('mode-ai');

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = false;
let mode = null;

function checkWinner() {
    const winPatterns = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return {winner: board[a], pattern};
        }
    }
    return board.includes("") ? null : {winner: "draw"};
}

function highlightWinner(pattern) {
    pattern.forEach(idx => {
        cells[idx].classList.add('win');
    });
}

function handleCellClick(e) {
    const idx = e.target.dataset.index;
    if (!gameActive || board[idx]) return;
    board[idx] = currentPlayer;
    e.target.textContent = currentPlayer;
    e.target.style.color = currentPlayer === "X" ? "#43c6ac" : "#f76d6d";
    const result = checkWinner();
    if (result) {
        gameActive = false;
        if (result.winner === "draw") {
            statusDiv.innerHTML = `<span style="color:#f76d6d;font-weight:bold;">It's a draw!</span>`;
        } else {
            highlightWinner(result.pattern);
            statusDiv.innerHTML = `<span style="color:#43c6ac;font-weight:bold;">Player ${result.winner} wins!</span>`;
        }
    } else {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        statusDiv.innerHTML = `Player <span style="color:${currentPlayer === "X" ? "#43c6ac" : "#f76d6d"};font-weight:bold;">${currentPlayer}</span>'s turn`;
        if (mode === "ai" && currentPlayer === "O" && gameActive) {
            setTimeout(aiMove, 400);
        }
    }
}

function aiMove() {
    // Simple AI: win, block, or random
    let move = findBestMove("O") || findBestMove("X") || randomMove();
    if (move !== null) {
        cells[move].click();
    }
}

function findBestMove(player) {
    const winPatterns = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        const line = [board[a], board[b], board[c]];
        if (line.filter(x => x === player).length === 2 && line.includes("")) {
            return pattern[line.indexOf("")];
        }
    }
    return null;
}

function randomMove() {
    const empty = board.map((v, i) => v === "" ? i : null).filter(v => v !== null);
    if (empty.length === 0) return null;
    return empty[Math.floor(Math.random() * empty.length)];
}

function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameActive = !!mode;
    statusDiv.innerHTML = mode ? `Player <span style="color:#43c6ac;font-weight:bold;">X</span>'s turn` : "Choose a mode to start!";
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove('win');
        cell.style.color = "#222";
    });
}

modeHumanBtn.onclick = () => {
    mode = "human";
    modeHumanBtn.disabled = true;
    modeAIBtn.disabled = false;
    resetGame();
};

modeAIBtn.onclick = () => {
    mode = "ai";
    modeHumanBtn.disabled = false;
    modeAIBtn.disabled = true;
    resetGame();
};

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetBtn.addEventListener('click', resetGame);

// Initialize with no mode selected
resetGame();