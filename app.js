// store the gameboard as an array inside the gameboard object
const Gameboard = (function () {
    const cells = document.querySelectorAll(".cell");
    let board = ["", "", "", "", "", "", "", "", ""];

    const displayGameBoard = () => {
        // each array item is displayed in each cell based on respective index data 
        cells.forEach(cell => {
            const index = parseInt(cell.dataset.index);
            cell.textContent = board[index];

            cell.addEventListener("click", GameController.handleClick);
        });
    }

    return { board, displayGameBoard };
})();

// players store in object
const createPlayer = (name, mark) => {
    let score = 0;
    const getScore = () => score;
    const addScore = () => { score++; };

    return { name, mark, getScore, addScore };
};

// const ash = createPlayer("Ash");
// ash.addScore();

// console.log({
//     playerName: ash.playerName,
//     score: ash.getScore()
// })

const GameController = (function () {
    let players = [];
    let activePlayer;
    let gameOver;

    const startGame = () => {
        players = [
            createPlayer(document.querySelector("#player-one").value, "X"),
            createPlayer(document.querySelector("#player-two").value, "O")
        ]
        activePlayer = players[0];
        gameOver = false;
        Gameboard.displayGameBoard();
    }

    const handleClick = (event) => {
        let index = event.target.dataset.index;

        // cells will not be overwritten
        if (Gameboard.board[index] !== "" || gameOver) return;
        // place current players mark
        Gameboard.board[index] = activePlayer.mark;
        // update the display
        Gameboard.displayGameBoard();
        console.log("Current Player:", activePlayer.name);
        console.log(Gameboard.board);
        swtichPlayerTurn();
    }

    const swtichPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    return { startGame, handleClick };
})();

document.querySelector("#start-button").addEventListener("click", () => {
    GameController.startGame();
});