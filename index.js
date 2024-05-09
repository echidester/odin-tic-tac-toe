function Gameboard() {
  const rows = 3;
  const cols = 3;
  let board = [];

  // Create a 3x3 board

  const setBoard = () => {
    for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < cols; j++) {
        board[i].push(Square());
      }
    }
  };

  const getBoard = () => board;

  setBoard();

  return { getBoard, setBoard };
}

function Square() {
  let value = "";

  const updateValue = (player) => (value = player);

  const getValue = () => value;

  return { updateValue, getValue };
}

function GameController(
  playerOneName = "Player 1",
  playerTwoName = "Player 2"
) {
  const board = Gameboard();
  const fullBoard = board.getBoard();
  let gameActive = false;
  const playerMsgHeadline = document.querySelector(".player-message");

  const players = [
    {
      name: playerOneName,
      token: "X",
    },
    {
      name: playerTwoName,
      token: "O",
    },
  ];

  let activePlayer = players[0];

  const switchPlayer = () =>
    (activePlayer = activePlayer === players[0] ? players[1] : players[0]);

  const getActivePlayer = () => activePlayer;

  const getGameActive = () => gameActive;

  const setGameActive = () => (gameActive = !gameActive);

  const playRound = (row, col) => {
    const activeSquare = fullBoard[row][col];

    if (activeSquare.getValue() === "") {
      activeSquare.updateValue(activePlayer.token);

      if (checkTie()) {
        playerMsgHeadline.textContent = `You tied!`;
        return fullBoard;
      } else {
        if (!checkWin()) {
          switchPlayer();
          playerMsgHeadline.textContent = `It's ${activePlayer.name}'s turn.`;
          return fullBoard;
        } else {
          return fullBoard;
        }
      }
    } else {
      playerMsgHeadline.textContent = `It's ${activePlayer.name}'s turn.`;
      return fullBoard;
    }
  };

  const checkLine = (cell1, cell2, cell3) => {
    if (cell1 !== "" && cell1 === cell2 && cell2 === cell3) {
      return true;
    } else {
      return false;
    }
  };

  const checkWin = () => {
    // check down & across
    for (let i = 0; i < 3; i++) {
      if (
        checkLine(
          fullBoard[0][i].getValue(),
          fullBoard[1][i].getValue(),
          fullBoard[2][i].getValue()
        ) ||
        checkLine(
          fullBoard[i][0].getValue(),
          fullBoard[i][1].getValue(),
          fullBoard[i][2].getValue()
        )
      ) {
        // if either of these checkLines evaluate to true, there is a winner

        playerMsgHeadline.textContent = `${activePlayer.name} wins!`;
        gameActive = false;
        return fullBoard;
      }
    }

    if (
      checkLine(
        fullBoard[0][0].getValue(),
        fullBoard[1][1].getValue(),
        fullBoard[2][2].getValue()
      ) ||
      checkLine(
        fullBoard[0][2].getValue(),
        fullBoard[1][1].getValue(),
        fullBoard[2][0].getValue()
      )
    ) {
      // if either of these checkLines evaluate to true, there is a winner
      playerMsgHeadline.textContent = `${activePlayer.name} wins!`;
      gameActive = false;
      return fullBoard;
    }
  };

  const checkTie = () => {
    let blankSpaces = 0;

    console.log(fullBoard[0][0].getValue());
    // If all squares have values & checkWin is false, there is a tie!
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        blankSpaces =
          fullBoard[i][j].getValue() === "" ? blankSpaces + 1 : blankSpaces + 0;
      }
    }

    if (blankSpaces === 0) {
      gameActive = false;
      return true;
    } else {
      return false;
    }
  };

  return {
    switchPlayer,
    getActivePlayer,
    playRound,
    checkWin,
    checkLine,
    getGameActive,
    setGameActive,
  };
}

const ScreenController = () => {
  // Variables for Other Functions
  let board = Gameboard();
  let game = GameController();

  // DOM Elements
  const containerDiv = document.querySelector(".container");
  const dialog = document.querySelector("dialog");
  const startBtn = document.querySelector(".start-btn");
  const submitBtn = document.querySelector(".submit-btn");
  const playerMsgHeadline = document.querySelector(".player-message");

  // Methods to pass into Event Listeners
  // (1) Start Button
  const openModal = () => dialog.showModal();

  // (2) Submit Button (in dialog box)
  const submitForm = (e) => {
    e.preventDefault();

    // Create a new, blank tic-tac-toe board
    board.setBoard();

    // Load the Game Controller with the correct player names
    game = GameController(playerOne.value, playerTwo.value);
    playerOne.value = "";
    playerTwo.value = "";

    // Close dialog box
    dialog.close();

    // Build all UI display elements
    game.setGameActive();
    containerDiv.classList.remove("hidden");
    displayTurnMessage();
    displayBoard(board.getBoard());
  };

  // Event Listeners
  // (1) Start Button
  const addStartBtnListeners = () => {
    startBtn.removeEventListener("click", openModal);
    startBtn.addEventListener("click", openModal);
  };

  // (2) Submit Button
  const addSubmitBtnListener = () => {
    submitBtn.removeEventListener("click", submitForm);
    submitBtn.addEventListener("click", submitForm);
  };

  // Screen Controller Methods
  const displayTurnMessage = () => {
    playerMsgHeadline.textContent = `It's ${
      game.getActivePlayer().name
    }'s turn.`;
  };

  const displayBoard = (board) => {
    // drop previous board
    let updatedBoard;

    containerDiv.innerHTML = "";
    startBtn.textContent =
      game.getGameActive() === false ? `Start Game` : `Reset Game`;

    // build current board
    if (game.getGameActive()) {
      board.map((row, rowIndex) =>
        row.map((square, colIndex) => {
          const newBtn = document.createElement("button");
          newBtn.textContent = square.getValue();
          newBtn.classList = `row-${rowIndex} col-${colIndex} board-btn`;
          containerDiv.appendChild(newBtn);
        })
      );
    } else {
      board.map((row, rowIndex) =>
        row.map((square, colIndex) => {
          const newBtn = document.createElement("button");
          newBtn.textContent = square.getValue();
          newBtn.classList = `row-${rowIndex} col-${colIndex} board-btn`;
          newBtn.setAttribute("disabled", false);
          containerDiv.appendChild(newBtn);
        })
      );
    }

    const boardBtns = document.querySelectorAll(".board-btn");

    // Event Listeners
    boardBtns.forEach((btn) =>
      btn.addEventListener("click", () => {
        const rowIndex = btn.classList[0].slice(-1);
        const colIndex = btn.classList[1].slice(-1);

        updatedBoard = game.playRound(rowIndex, colIndex);
        displayBoard(updatedBoard);
      })
    );

    addStartBtnListeners();
  };

  displayBoard(board.getBoard());
  addStartBtnListeners();
  addSubmitBtnListener();

  return { displayBoard, addStartBtnListeners };
};

ScreenController();
