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
        if(_board[row][column].getValue() == '') {
            _board[row][column].addMove(player)
            return true;
        } else {
            alert('please choose empty cell!!')
            return false;
        }
    }

    const printBoard = () => {

        const _rules = Rules();

        const boardWithValue = _board.map((row) => row.map((cell) => cell.getValue()))

        if(_rules.checkDiag(boardWithValue) || _rules.checkColumn(boardWithValue) || _rules.checkRow(boardWithValue)){
            return [boardWithValue,false];
        } 
        // console.log(_rules.checkColumn(boardWithValue),  _rules.checkRow(boardWithValue), _rules.checkDiag(boardWithValue))
        return boardWithValue

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
            if(board[i].every(current => current == 'X' )){
                res.push(true);
            } else if(board[i].every(current => current == 'O')){
                res.push(true);
            } else {
                res.push(false);
            }
        }

        const winCondition = (condition) => condition === true; 

        const checkWin = () => {
            if(res.some(winCondition)) {
               return true
            }
        }
       return checkWin();
    }

    
    // Tranposing Column to array to make easier checking
    const checkColumn = (board) => {
        
        const tranpose = (arr) => {
            let [row] = arr;
    
            return row.map((value, column) => arr.map(row => row[column]))
        }

        const row = tranpose(board);

        return checkRow(row);
    }

    const checkDiag = (board) => {
        let diagonal1 = [board[0][0], board[1][1], board[2][2]];
        let diagonal2 = [board[2][0], board[1][1], board[0][2]];

        if(diagonal1.every(current => current == 'X' || current == 'O')){
            return true
        } else if (diagonal2.every(current => current == 'X' || current == 'O')){
            return true
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

    let activePlayer = _players[0]

    const getActivePlayer = () => activePlayer;

    const switchPlayer = () => {
        activePlayer = activePlayer === _players[0] ? _players[1] : _players[0];
        return {activePlayer};
    }

    let _gameCondition = true

    const getGameCondition = () => _gameCondition;

    const printNewRound = () => {
        if(_board.printBoard().length == 2){
            console.log(_board.printBoard()[0])
            _gameCondition = _board.printBoard()[1]
            console.log('You Win');
        } else {
            console.log(_board.printBoard())
        }
    }

    const playRound = (column, row) => {
        if(_board.dropMove(column, row, getActivePlayer().token)){
            console.log(`${getActivePlayer().name} is Dropping move at column ${column}, and row ${row}`);
            switchPlayer();
        }
        printNewRound();
    }

    const twoPlayer = () => {
        alert(`You're ${getActivePlayer().name}, please input column and row you will place!`);
        const column = parseInt(prompt('Insert your column from 0 to 2'));
        const row = parseInt(prompt('Insert your row from 0 to 2'));
        playRound(column, row);
        if(getGameCondition() == true){
            twoPlayer();
        } else {
            return;
        }
    }  

    printNewRound();

    return {
        playRound,
        twoPlayer,
        getActivePlayer,
    }
}

const game = GameController();
