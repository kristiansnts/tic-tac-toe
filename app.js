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
        _board[row][column] = player
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

    return {
        checkRow
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
        
        if(rules.checkRow(boardValue)){
            setGameCondition(false)
            return [boardValue, true]
        }

        return boardValue;
    }

    const winnerMessage = () => {
        if(printRound().length == 2){
            if(printRound()[1] == true){
                console.log(`${getActivePlayer().name} Win`)
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

    const twoPlayer = (row, column) => {
        alert(`You're ${getActivePlayer().name}, please input your move`)
        row = parseInt(prompt("input your row!"));
        column = parseInt(prompt("input your column!"));
        board.setMove(row, column, getActivePlayer().token);
        console.log(winnerMessage());
        swithPlayer();
        if(getGameCondition() == true) {
            twoPlayer();
        } else {
            return;
        }
    }

    return {
        twoPlayer
    }
}

const game = GameController();
// game.twoPlayer();