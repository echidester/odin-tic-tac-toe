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
  let value = "-";

  const updateValue = (player) => (value = player);

  const getValue = () => value;

  return { updateValue, getValue };
}

function GameController(
  playerOneName = "Player 1",
  playerTwoName = "Player 2"
) {
  const board = Gameboard();

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
    const fullBoard = board.getBoard();
    const activeSquare = fullBoard[row][col];

    activeSquare.updateValue(activePlayer.token);
    switchPlayer();
    board.printBoard();
    console.log(activePlayer.name);
  };

  // Initialize game
  board.printBoard();
  console.log(activePlayer.name);

  return { switchPlayer, getActivePlayer, playRound };
}

const game = GameController();
