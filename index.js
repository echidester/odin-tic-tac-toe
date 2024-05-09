function Gameboard() {
  const rows = 3;
  const cols = 3;
  const board = [];

  // Create a 3x3 board
  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < cols; j++) {
      board[i].push(Square());
    }
  }

  const printBoard = () => {
    const boardWithTokens = board.map((row) =>
      row.map((square) => square.getValue())
    );
    console.log(boardWithTokens);
  };

  const getBoard = () => board;

  return { printBoard, getBoard };
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
  let gameActive = true;
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

  const playRound = (row, col) => {
    if (gameActive) {
      const activeSquare = fullBoard[row][col];

      if (activeSquare.getValue() === "") {
        activeSquare.updateValue(activePlayer.token);
        if (!checkWin()) {
          switchPlayer();
          playerMsgHeadline.textContent = `It's ${activePlayer.name}'s turn.`;
          return fullBoard;
        } else {
          return fullBoard;
        }
      } else {
        playerMsgHeadline.textContent = `It's ${activePlayer.name}'s turn.`;
        return fullBoard;
      }
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
        console.log(`For loop...${i}`);
        board.printBoard();
        console.log(`${activePlayer.name} wins!`);
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
      console.log(`Diagonals...`);
      board.printBoard();
      console.log(`${activePlayer.name} wins!`);
      gameActive = false;
      return fullBoard;
    }
  };

  return { switchPlayer, getActivePlayer, playRound, checkWin, checkLine };
}

const ScreenController = () => {
  // Variables for Other Functions
  const board = Gameboard();
  let game = GameController();

  // DOM Elements
  const containerDiv = document.querySelector(".container");
  const dialog = document.querySelector("dialog");
  const boardBtns = document.querySelectorAll(".board-btn");
  const startBtn = document.querySelector(".start-btn");
  const resetBtn = document.querySelector(".reset-btn");
  const submitBtn = document.querySelector(".submit-btn");
  const playerMsgHeadline = document.querySelector(".player-message");

  // Methods to pass into Event Listeners
  // (1) Start Button
  const openModal = () => dialog.showModal();

  // (2) Submit Button (in dialog box)
  const submitForm = (e) => {
    e.preventDefault();

    game = GameController(playerOne.value, playerTwo.value);
    containerDiv.classList.remove("hidden");
    dialog.close();
    startBtn.setAttribute("disabled", false);
    resetBtn.removeAttribute("disabled");
    playerMsgHeadline.textContent = `It's ${
      game.getActivePlayer().name
    }'s turn.`;
  };

  // (3) Reset Button

  // (4) Board Button

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

  const displayBoard = (board) => {
    // drop previous board
    let updatedBoard;

    containerDiv.innerHTML = "";

    // build current board
    board.map((row, rowIndex) =>
      row.map((square, colIndex) => {
        const newBtn = document.createElement("button");
        newBtn.textContent = square.getValue();
        newBtn.classList = `row-${rowIndex} col-${colIndex} board-btn`;
        containerDiv.appendChild(newBtn);
      })
    );

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
