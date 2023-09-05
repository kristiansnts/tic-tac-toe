function GameBoard(){
    let _board = [];
    const _rows = 3;
    const _columns = 3;

    for (let i = 0; i < _rows; i++) {
        _board[i] = [];
        for (let j = 0; j < _columns; j++){
            _board[i].push(Cell());
        }
    }
    
    const getBoard = () => _board;

    const dropMove = (column, row, player) => {
        _board[row][column].addMove(player)
    }

    const printBoard = () => {

        const _rules = Rules();

        const boardWithValue = _board.map((row) => row.map((cell) => cell.getValue()))
        console.log(boardWithValue);

        _rules.checkRow(boardWithValue);
        
    }

    return {
        getBoard, 
        dropMove,
        printBoard
    }
}

function Rules() {

   const checkRow = (board) => {
        let res = []

        for (let i = 0; i < board.length; i++){
            if(board[i].every(current => current == 'X' || current == 'O')){
                res.push(true);
            } else {
                res.push(false);
            }

        }

        const winCondition = (condition) => condition === true;

        const checkWin = () => res.some(winCondition) ? console.log('You Win') : '';
        checkWin();
   }


   return {
        checkRow,
   }

}

function Cell() {
    let _value = "";

    const addMove = (player) => {
        _value = player;
    };

    const getValue = () => _value;

    return {getValue, addMove}
}

function GameController() {

    const _board = GameBoard();

    const _players = [
        {
            name: 'PlayerX',
            token: 'X'
        },
        {
            name: 'PlayerO',
            token: 'O'
        }
    ];

    let activePlayer = _players[0]

    const getActivePlayer = () => activePlayer;

    const switchPlayer = () => {
        activePlayer = activePlayer === _players[0] ? _players[1] : _players[0];
        return {activePlayer};
    }

    const printNewRound = () => {
        _board.printBoard();
    }


    const playRound = (column, row) => {
        console.log(`${getActivePlayer().name} is Dropping move at column ${column}, and row ${row}`);
        _board.dropMove(column, row, getActivePlayer().token)
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