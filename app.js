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
            const mark = board[index];
            cell.textContent = mark;

            cell.classList.remove("x", "o");

            if (mark === "\u2715") cell.classList.add("x");
            if (mark === "\u25EF") cell.classList.add("o");

        });
    }

    const hilightWinningCells = (combo) => {
        const cells = document.querySelectorAll(".cell");

        combo.forEach(index => {
            const cell = cells[index];
            cell.classList.add("winner");
        });
    };

    const resetBoard = () => {
        board = ["", "", "", "", "", "", "", "", ""];
        cells.forEach(cell => cell.classList.remove("winner"));
        displayGameBoard();
    };

    const addClickListener = () => {
        cells.forEach(cell => {
            cell.removeEventListener("click", GameController.handleClick);
            cell.addEventListener("click", GameController.handleClick);
        });
    };

    return { get board() { return board; }, displayGameBoard, resetBoard, addClickListener, hilightWinningCells, winningCombos };
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
    let drawScore = 0
    let activePlayer;
    let gameOver;

    const initGame = () => {
        players = [
            createPlayer(scoreBoardDisplay.playerOneInput.value, "\u2715"),
            createPlayer(scoreBoardDisplay.playerTwoInput.value, "\u25EF")
        ];
        Gameboard.addClickListener();
        startNewRound();
    };

    const startNewRound = () => {
        activePlayer = players[0];
        gameOver = false;
        Gameboard.resetBoard();
        scoreBoardDisplay.updateScore(players[0].getScore(), players[1].getScore(), drawScore);
    }

    const handleClick = (event) => {
        const board = Gameboard.board;
        let index = event.target.dataset.index;

        // cells will not be overwritten
        if (board[index] !== "" || gameOver) return;
        // place current players mark
        board[index] = activePlayer.mark;
        // update the display
        Gameboard.displayGameBoard();

        const topMessage = document.querySelector("#top-message");
        const winningCombo = checkWinner(board);

        if (winningCombo) {
            gameOver = true;
            activePlayer.addScore();

            Gameboard.hilightWinningCells(winningCombo);

            const winnerName = activePlayer.name.toUpperCase();
            scoreBoardDisplay.updateScore(players[0].getScore(), players[1].getScore(), drawScore);

            handleButtons.showNextRound(`${winnerName} TAKES THE ROUND`);
            topMessage.textContent = "You won!"

            return;
        }
        // checks if all cells are filled and checkWinner return false
        if (board.every(cell => cell !== "")) {
            gameOver = true;
            drawScore++;
            scoreBoardDisplay.updateScore(players[0].getScore(), players[1].getScore(), drawScore);

            handleButtons.showNextRound("It's a draw!");
            topMessage.textContent = "Uh Oh!"

            return;
        }

        swtichPlayerTurn();
    }

    const swtichPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const checkWinner = (board) => {
        // checks all the possible winning combinations
        for (const combo of Gameboard.winningCombos) {
            const [a, b, c] = combo;
            // checks if the cells are non-empty and have the same player mark
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return combo; // winner found
            };
        }
        return null; // no winner found
    }

    return { initGame, startNewRound, handleClick };
})();

const scoreBoardDisplay = (function () {
    let playerOneInput = document.querySelector("#player-one");
    let playerTwoInput = document.querySelector("#player-two");

    let playerOneDisplayName = document.querySelector("#p1-name");
    let playerTwoDisplayName = document.querySelector("#p2-name");

    let playerOneScore = document.querySelector("#p1-score");
    let playerTwoScore = document.querySelector("#p2-score");
    let drawScore = document.querySelector("#draw-score");

    const updateScore = (p1Score, p2Score, draw) => {
        playerOneScore.textContent = p1Score;
        playerTwoScore.textContent = p2Score;
        drawScore.textContent = draw;
    };

    return { playerOneInput, playerTwoInput, playerOneDisplayName, playerTwoDisplayName, updateScore }
})();

const handleButtons = (function () {
    const gameWindow = document.querySelector("#board-wrapper");
    const startWindow = document.querySelector("#start-wrapper");
    const nextRoundModal = document.querySelector(".modal-wrapper");
    const modalMessage = document.querySelector("#modal-message");
    const nextRoundButton = document.querySelector("#next-round-button");
    const quitButton = document.querySelector("#quit-button");

    const startButton = () => {
        document.querySelector("#start-button").addEventListener("click", () => {
            GameController.initGame();

            // display user input name into the scoreboard display if name was provided
            scoreBoardDisplay.playerOneDisplayName.textContent = scoreBoardDisplay.playerOneInput.value || "Player One";
            scoreBoardDisplay.playerTwoDisplayName.textContent = scoreBoardDisplay.playerTwoInput.value || "Player Two";

            startWindow.classList.add("hidden");
            gameWindow.classList.remove("hidden");
        });
    }

    const showNextRound = (message) => {
        modalMessage.textContent = message;
        nextRoundModal.classList.remove("hidden");
    };

    // play next round
    nextRoundButton.addEventListener("click", () => {
        nextRoundModal.classList.add("hidden");
        GameController.startNewRound();
    });

    //quit the game
    quitButton.addEventListener("click", () => {
        nextRoundModal.classList.add("hidden");
        gameWindow.classList.add("hidden");
        startWindow.classList.remove("hidden");
        Gameboard.resetBoard();
        location.reload();
    });

    return { startButton, showNextRound };
})();

handleButtons.startButton();