function GameBoard(){

    let _board = [];
    const row = 3;
    const col = 3;

    for (let i = 0; i < row; i++){
        _board[i] = []
        for (let j = 0; j < col; j++){
            _board[i].push('');
        }
    }

    const setMove = (row, column, player) => {
        if(_board[row][column] == ''){
            _board[row][column] = player
            return true;
        } else {
            return false;
            alert('Please Select Empty Cell'); 
        }
    }

    const getBoard = () => _board;

    return {
        getBoard,
        setMove
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

        if(diagonal1.every(current => current == 'X')){
            return true
        } else if (diagonal1.every(current => current == 'O')){
            return true
        } else if (diagonal2.every(current => current == 'X')){
            return true
        } else if (diagonal2.every(current => current == 'O')){
            return true
        }
    }

    const checkDraw = (board) => {

        const filterBoard = []

        for(let i = 0; i < board.length; i++){
            for(let j = 0; j < board.length; j++){
                if(board[i][j] == ''){
                    filterBoard.push([j,i])
                }
            }
        }

        if(filterBoard.length == 0){
            return true
        } else {
            return false
        }

    }

    return {
        checkRow,
        checkColumn,
        checkDiag,
        checkDraw
    }

}

function GameController() {

    const board = GameBoard();

    const rules = Rules()

    const players = [
        {
            name: 'Player X',
            token: 'X'
        }, 
        {
            name: 'Player O',
            token: 'O'
        }
    ];

    let activePlayer = players[0];

    const getActivePlayer = () => activePlayer;

    const swithPlayer = () => {
        activePlayer = activePlayer == players[0] ? players[1] : players[0];
    }

    const printRound = () => {
        let boardValue = board.getBoard();
        
        if(rules.checkRow(boardValue) || rules.checkColumn(boardValue) || rules.checkDiag(boardValue)){
            setGameCondition(false)
            return [boardValue, true]
        } else if (rules.checkDraw(boardValue)){
            setGameCondition(false)
            return [boardValue, false]
        }

        return boardValue;
    }

    const winnerMessage = () => {
        if(printRound().length == 2){
            if(printRound()[1] == true){
                console.log(`${getActivePlayer().name} Win`)
            } else if (printRound()[1] == false){
                console.log('Draw');
            }
        } else {
            console.log(printRound())
        }

    }

    let gameCondition = true;

    const setGameCondition = (value) => {
        gameCondition = value
    }

    const getGameCondition = () => gameCondition;
    
    const newRound = (round) => {
        swithPlayer();
        if(getGameCondition() == true) {
            round();
        } else {
            return;
        }
    }

    const getRandomMove = () => {
        const boardValue = board.getBoard();
        let rows = []
        let cols = []
        
        for (let i = 0; i < 3; i++){
            for (let j = 0; j < 3; j++){
                if(boardValue[i][j] == ''){
                    rows.push(i);
                    cols.push(j)
                }
            }
        }
        const randomRow = rows[Math.floor(Math.random()*rows.length)];
        const randomCol = cols[Math.floor(Math.random()*cols.length)];
        return [randomRow, randomCol];
    }


    const twoPlayer = (row, column) => {
        alert(`You're ${getActivePlayer().name}, please input your move`)
        row = parseInt(prompt("input your row!"));
        column = parseInt(prompt("input your column!"));
        if(board.setMove(row, column, getActivePlayer().token) == true){
            console.log(winnerMessage());
        } else {
            twoPlayer();
        }    
        newRound(twoPlayer);
    }    

    const vsComp = () => {
        if(getActivePlayer().token == 'O'){
            [row, column] = getRandomMove();
            if(board.setMove(row, column, getActivePlayer().token) == true){
                alert(`Computer was put move on row: ${row}, and colum: ${column}`)
                console.log(winnerMessage());
            } else {
                vsComp();
            }
            newRound(vsComp);
        } else {
            alert(`You're ${getActivePlayer().name}, please input your move`)
            row = parseInt(prompt("input your row!"));
            column = parseInt(prompt("input your column!"));
            if(board.setMove(row, column, getActivePlayer().token) == true){
                console.log(winnerMessage());
            } else {
                vsComp();
            }
            newRound(vsComp);
        }
    }

    return {
        twoPlayer,
        vsComp
    }
}

const game = GameController();
// game.twoPlayer();
// game.vsComp()