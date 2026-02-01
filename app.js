// store the gameboard as an array inside the gameboard object
const Gameboard = (function () {
    const cells = document.querySelectorAll(".cell");
    let board = ["", "", "", "", "", "", "", "", ""];
    const winningCombos = [
        [0, 1, 2], // top row
        [3, 4, 5], // middle row
        [6, 7, 8], // bottom row
        [0, 3, 6], // left column
        [1, 4, 7], // middle column
        [2, 5, 8], // right column
        [0, 4, 8], // main diagonal
        [2, 4, 6]  // oposite diagonal
    ];

    const displayGameBoard = () => {
        // each array item is displayed in each cell based on respective index data 
        cells.forEach(cell => {
            const index = parseInt(cell.dataset.index);
            cell.textContent = board[index];

            cell.addEventListener("click", GameController.handleClick);
        });
    }

    return { board, displayGameBoard, winningCombos };
})();

// players store in object
const createPlayer = (name, mark) => {
    let score = 0;
    const getScore = () => score;
    const addScore = () => { score++; };

    return { name, mark, getScore, addScore };
};

const GameController = (function () {
    board = Gameboard.board;
    let players = [];
    let activePlayer;
    let gameOver;

    const startGame = () => {
        players = [
            createPlayer(document.querySelector("#player-one").value, "\u2715"),
            createPlayer(document.querySelector("#player-two").value, "\u25EF")
        ]
        activePlayer = players[0];
        gameOver = false;
        Gameboard.displayGameBoard();
    }

    const handleClick = (event) => {
        let index = event.target.dataset.index;

        // cells will not be overwritten
        if (board[index] !== "" || gameOver) return;
        // place current players mark
        board[index] = activePlayer.mark;
        // update the display
        Gameboard.displayGameBoard();

        if (checkWinner(board)) {
            gameOver = true;

            setTimeout(() => {
                alert(`${activePlayer.name} wins!`)
            }, 50);

            return;
        }
        // checks if all cells are filled and checkWinner return false
        if (board.every(cell => cell !== "")) {
            gameOver = true;

            setTimeout(() => {
                alert("Its a draw!");
            }, 50);

            return;
        }

        swtichPlayerTurn();
    }

    const swtichPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const checkWinner = (board) => {
        let winner;
        // checks all the possible winning combinations
        for (const combo of Gameboard.winningCombos) {
            const [a, b, c] = combo;
            // checks if the cells are non-empty and have the same player mark
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return true; // winner found
            };
        }
        return false; // no winner found
    }

    return { startGame, handleClick };
})();

document.querySelector("#start-button").addEventListener("click", () => {
    GameController.startGame();
});