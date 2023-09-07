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

        _rules.checkDiag(boardWithValue);
        _rules.checkColumn(boardWithValue);
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
        let res = [];

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

    
    // Tranposing Column to array to make easier checking
    const checkColumn = (board) => {
        
        const tranpose = (arr) => {
            let [row] = arr;
    
            return row.map((value, column) => arr.map(row => row[column]))
        }

        const row = tranpose(board);

        checkRow(row);
    }

    const checkDiag = (board) => {
        let diagonal1 = [board[0][0], board[1][1], board[2][2]];
        let diagonal2 = [board[2][0], board[1][1], board[0][2]];

        if(diagonal1.every(current => current == 'X' || current == 'O')){
            console.log('You Win')
        } else if (diagonal2.every(current => current == 'X' || current == 'O')){
            console.log('You Win')
        }

    }


   return {
        checkRow,
        checkColumn,
        checkDiag
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

    let activePlayer = _players[1]

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
        // switchPlayer();
        printNewRound();
    }

    printNewRound();

    return {
        playRound,
        getActivePlayer
    }
}

const game = GameController();