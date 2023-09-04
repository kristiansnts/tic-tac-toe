function GameBoard(){
    let board = [];
    const rows = 3;
    const columns = 3;

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++){
            board[i].push(Cell());
        }
    }
    
    const getBoard = () => board;

    const dropMove = (column, row, player) => {
        board[row][column].addMove(player)
    }

    const printBoard = () => {
        const boardWithValue = board.map((row) => row.map((cell) => cell.getValue()))
        console.log(boardWithValue);
    }

    return {
        getBoard, 
        dropMove,
        printBoard
    }
}

function Cell() {
    let value = "";

    const addMove = (player) => {
        value = player;
    };

    const getValue = () => value;

    return {getValue, addMove}
}

function GameController() {

    const board = GameBoard();

    const players = [
        {
            name: 'PlayerX',
            token: 'X'
        },
        {
            name: 'PlayerO',
            token: 'O'
        }
    ];

    let activePlayer = players[0]

    const getActivePlayer = () => activePlayer;

    const switchPlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
        return {activePlayer};
    }

    const printNewRound = () => {
        board.printBoard();
    }

    const playRound = (column, row) => {
        console.log(`${getActivePlayer().name} is Dropping move at column ${column}, and row ${row}`);
        board.dropMove(column, row, getActivePlayer().token)
        switchPlayer();
        printNewRound();
    }

    printNewRound();

    return {
        playRound,
        getActivePlayer
    }
}

const game = GameController();
