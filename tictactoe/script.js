const board = document.getElementById("board");
const status = document.getElementById("status");
const clickSound = document.getElementById("clickSound");
const winSound = document.getElementById("winSound");

let cells = [];
let playerScore = 0;
let aiScore = 0;
let currentPlayer = "X"; // Player is X, AI is O
let boardState = Array(9).fill("");

function createBoard() {
  board.innerHTML = "";
  cells = [];
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", handleClick);
    board.appendChild(cell);
    cells.push(cell);
  }
}

function handleClick(e) {
  const index = e.target.dataset.index;
  if (boardState[index] || checkWinner()) return;
  boardState[index] = "X";
  e.target.textContent = "X";
  clickSound.play();
  if (checkWinner()) {
    endGame("You");
    return;
  }
  if (boardState.every(cell => cell)) {
    endGame("Draw");
    return;
  }
  status.textContent = "AI's turn...";
  setTimeout(aiMove, 500); // AI delay
}

function aiMove() {
  let index = bestMove();
  if (index !== -1) {
    boardState[index] = "O";
    cells[index].textContent = "O";
    clickSound.play();
    if (checkWinner()) {
      endGame("AI");
      return;
    }
    if (boardState.every(cell => cell)) {
      endGame("Draw");
      return;
    }
  }
  status.textContent = "Your turn";
}

function bestMove() {
  for (let i = 0; i < boardState.length; i++) {
    if (!boardState[i]) return i; // Simple AI: first empty
  }
  return -1;
}

function checkWinner() {
  const wins = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6]
  ];
  for (let combo of wins) {
    const [a, b, c] = combo;
    if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
      cells[a].classList.add("win");
      cells[b].classList.add("win");
      cells[c].classList.add("win");
      return boardState[a];
    }
  }
  return null;
}

function endGame(winner) {
  winSound.play();
  if (winner === "You") {
    playerScore++;
    document.getElementById("playerScore").textContent = playerScore;
    status.textContent = "You Win!";
  } else if (winner === "AI") {
    aiScore++;
    document.getElementById("aiScore").textContent = aiScore;
    status.textContent = "AI Wins!";
  } else {
    status.textContent = "It's a draw!";
  }
  // Disable further clicks
  board.removeEventListener("click", handleClick, true);
}

function resetGame() {
  boardState = Array(9).fill("");
  status.textContent = "Your turn";
  createBoard();
}

createBoard();
