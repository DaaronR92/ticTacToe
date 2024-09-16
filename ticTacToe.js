// ticTacToe.js

// Grabbing all the elements we need from the HTML
const cells = document.querySelectorAll('.cell');  // All Tic-Tac-Toe cells
const statusText = document.getElementById('status');  // The status text (e.g., "X's move")
const restartBtn = document.getElementById('restart');  // Restart button
const backToMenuBtn = document.getElementById('back-to-menu');  // Back to Main Menu button
const mainMenu = document.getElementById('main-menu');  // Main menu area
const gameBoard = document.getElementById('game-board');  // Tic-Tac-Toe board
const controls = document.getElementById('controls');  // The control buttons (Restart, Back to Menu)
const pvpBtn = document.getElementById('pvp');  // Player vs Player button
const cpuBtn = document.getElementById('cpu');  // Player vs CPU button
const darkModeToggle = document.getElementById('dark-mode-toggle');  // Dark Mode toggle button

// Initial game settings
let currentPlayer = 'X';  // Start with Player X
let gameActive = true;  // Game is active when it starts
let boardState = ["", "", "", "", "", "", "", "", ""];  // The game board is an array of 9 empty strings (one for each cell)
let isPlayerVsCPU = false;  // Boolean to track if we're in Player vs CPU mode

// Defining all possible winning conditions (row, column, diagonal)
const winningConditions = [
    [0, 1, 2],  // Top row
    [3, 4, 5],  // Middle row
    [6, 7, 8],  // Bottom row
    [0, 3, 6],  // Left column
    [1, 4, 7],  // Middle column
    [2, 5, 8],  // Right column
    [0, 4, 8],  // Diagonal from top-left to bottom-right
    [2, 4, 6]   // Diagonal from top-right to bottom-left
];

// Adding click event listeners to each cell so players can make their moves
cells.forEach(cell => cell.addEventListener('click', cellClicked));

// Event listeners for the restart and back-to-main-menu buttons
restartBtn.addEventListener('click', restartGame);
backToMenuBtn.addEventListener('click', backToMainMenu);

// Event listeners for main menu buttons (choosing game mode)
pvpBtn.addEventListener('click', startPVP);  // Player vs Player mode
cpuBtn.addEventListener('click', startCPU);  // Player vs CPU mode

// Event listener for the dark mode toggle button
darkModeToggle.addEventListener('click', toggleDarkMode);

// Function to toggle dark mode on and off
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');  // Adds or removes the 'dark-mode' class from the body
}

// Function to start the Player vs Player game mode
function startPVP() {
    isPlayerVsCPU = false;  // We're not playing against the CPU
    startGame();  // Start the game
}

// Function to start the Player vs CPU game mode
function startCPU() {
    isPlayerVsCPU = true;  // We're playing against the CPU
    startGame();  // Start the game
}

// This function handles starting the game (regardless of the game mode)
function startGame() {
    mainMenu.style.display = 'none';  // Hide the main menu
    gameBoard.style.display = 'grid';  // Show the game board
    controls.style.display = 'block';  // Show the control buttons (Restart, Back to Menu)
    statusText.textContent = `It's ${currentPlayer}'s turn`;  // Display whose turn it is
    statusText.style.display = 'block';  // Make sure the status text is visible
}

// This function handles what happens when a cell is clicked
function cellClicked(e) {
    const cell = e.target;  // Get the clicked cell
    const cellIndex = cell.getAttribute('data-index');  // Get the cell's index

    // If the cell is already taken or the game is over, do nothing
    if (boardState[cellIndex] !== "" || !gameActive) return;

    // Update the clicked cell
    updateCell(cell, cellIndex);
    checkWinner();  // Check if someone won

    // If it's Player vs CPU mode and it's the CPU's turn (O), make the CPU move
    if (isPlayerVsCPU && currentPlayer === 'O' && gameActive) {
        setTimeout(cpuMove, 500);  // Wait 500ms before the CPU makes its move (for a bit of delay)
    }
}

// This function updates the cell with the current player's symbol (X or O)
function updateCell(cell, index) {
    boardState[index] = currentPlayer;  // Update the board state
    cell.textContent = currentPlayer;  // Display the player's symbol (X or O) in the clicked cell
}

// This function changes the current player from X to O (or vice versa)
function changePlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';  // Switch players
    statusText.textContent = `It's ${currentPlayer}'s turn`;  // Update the status text to reflect whose turn it is
}

// This function checks if someone has won the game or if it's a draw
function checkWinner() {
    let roundWon = false;  // Track if the round is won

    // Loop through the winning conditions and check if any are met
    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        let a = boardState[winCondition[0]];
        let b = boardState[winCondition[1]];
        let c = boardState[winCondition[2]];

        // If any cell in a win condition is empty, skip this condition
        if (a === '' || b === '' || c === '') continue;

        // If all three cells are the same, we have a winner
        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }

    // If someone won, display a message and end the game
    if (roundWon) {
        statusText.textContent = `Player ${currentPlayer} has won!`;
        gameActive = false;  // Stop the game
        return;
    }

    // If no more moves are left and no one won, it's a draw
    if (!boardState.includes("")) {
        statusText.textContent = "It's a draw!";
        gameActive = false;  // Stop the game
        return;
    }

    // If no one has won and it's not a draw, switch to the other player
    changePlayer();
}

// This function restarts the game (clears the board and resets everything)
function restartGame() {
    currentPlayer = 'X';  // Reset to Player X
    boardState = ["", "", "", "", "", "", "", "", ""];  // Clear the board state
    gameActive = true;  // Make the game active again
    statusText.textContent = `It's ${currentPlayer}'s turn`;  // Reset the status text

    // Clear the content of all cells
    cells.forEach(cell => {
        cell.textContent = "";
    });
}

// This function returns the player to the main menu and resets the game
function backToMainMenu() {
    restartGame();  // Reset the game state
    gameBoard.style.display = 'none';  // Hide the game board
    controls.style.display = 'none';  // Hide the control buttons
    statusText.style.display = 'none';  // Hide the status text
    mainMenu.style.display = 'block';  // Show the main menu
}

// Simple CPU logic: Chooses a random empty cell and makes a move
function cpuMove() {
    const emptyCells = boardState.map((value, index) => value === "" ? index : null).filter(index => index !== null);
    const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];  // Randomly pick an available cell
    const cell = cells[randomIndex];

    updateCell(cell, randomIndex);  // The CPU makes its move
    checkWinner();  // Check if the CPU won
}

// When the page loads, make sure the game board, controls, and status are hidden
window.onload = () => {
    gameBoard.style.display = 'none';  // Hide the board
    controls.style.display = 'none';  // Hide the control buttons
    statusText.style.display = 'none';  // Hide the status text
};