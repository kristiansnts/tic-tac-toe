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

    const render = DisplayController();

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
            render.setBoard(boardValue);
            return [boardValue, true]
        } else if (rules.checkDraw(boardValue)){
            render.setBoard(boardValue);
            return [boardValue, false]
        }
        render.setBoard(boardValue);
        return boardValue;
    }
    
    const winnerMessage = () => {
        let boardValue = board.getBoard()
        let result = checkWinner(boardValue);
        console.log(boardValue)
        if(printRound().length == 2){
            if(result == 'X'){
                setGameCondition(false)
                console.log('X Winner')
            } else if (result == 'O'){
                setGameCondition(false)
                console.log('O Winner')
            } else if(printRound()[1] == false){
                setGameCondition(false)
                console.log('Draw')
            }
        }
        
    }

    const winnerCondition = [
        [[0, 0], [0, 1], [0, 2]],
        [[1, 0], [1, 1], [1, 2]],
        [[2, 0], [2, 1], [2, 2]],
        [[0, 0], [1, 0], [2, 0]],
        [[0, 1], [1, 1], [2, 1]],
        [[0, 2], [1, 2], [2, 2]],
        [[0, 0], [1, 1], [2, 2]],
        [[0, 2], [1, 1], [2, 0]]   
    ];

    const checkWinner = (board) => {
        for (let i = 0; i < winnerCondition.length; i++) {
            const [a, b, c] = winnerCondition[i];
            if (
                board[a[0]][a[1]] &&
                board[a[0]][a[1]] === board[b[0]][b[1]] &&
                board[a[0]][a[1]] === board[c[0]][c[1]]
            ) {
                return board[a[0]][a[1]];
            }
        }

        if(printRound().length == 2 && printRound()[1] == false){
            return 'draw';
        }

        return null;
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

    const getBestMove = (boardValue) => {
        let bestScore = -Infinity;
        let bestMove;

        for (let i = 0; i < 3; i++){
            for (let j = 0; j < 3; j++){
                if(boardValue[i][j] == ''){
                    boardValue[i][j] = 'O';
                    let score = minimax(boardValue, 0, false);
                    boardValue[i][j] = '';
                    if(score > bestScore){
                        bestScore = score;
                        bestMove = [i, j];
                    }
                }
            }
        }
        return bestMove;
    }

    const minimax = (boardValue, depth, isMaximizing) => {

        let scores = {
            'O': 1,
            'X': -1,
            'draw': 0
        }

        let result = checkWinner(boardValue);
        if(result !== null){
            return scores[result];
        }

        if(isMaximizing){
            let bestScore = -Infinity;
            for (let i = 0; i < 3; i++){
                for (let j = 0; j < 3; j++){
                    if(boardValue[i][j] == ''){
                        boardValue[i][j] = 'O';
                        let score = minimax(boardValue, depth + 1, false);
                        boardValue[i][j] = '';
                        bestScore = Math.max(score, bestScore)
                    }
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 3; i++){
                for (let j = 0; j < 3; j++){
                    if(boardValue[i][j] == ''){
                        boardValue[i][j] = 'X';
                        let score = minimax(boardValue, depth + 1, true);
                        boardValue[i][j] = '';
                        bestScore = Math.min(score, bestScore)
                    }
                }
            }
            return bestScore;
        }
    }

    const twoPlayer = (row, column) => {
        render.playerTurn(getActivePlayer().name);
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

    const vsAi = () => {
        if(getActivePlayer().token == 'O'){
            [row, column] = getBestMove(board.getBoard());
            if(board.setMove(row, column, getActivePlayer().token) == true){
                alert(`Computer was put move on row: ${row}, and colum: ${column}`)
                console.log(winnerMessage());
            } else {
                vsAi();
            }
            newRound(vsAi);
        } else {
            alert(`You're ${getActivePlayer().name}, please input your move`)
            row = parseInt(prompt("input your row!"));
            column = parseInt(prompt("input your column!"));
            if(board.setMove(row, column, getActivePlayer().token) == true){
                console.log(winnerMessage());
            } else {
                vsAi();
            }
            newRound(vsAi);
        }
    }

    window.addEventListener('click', (e) => {
        if(e.target.classList.contains('cell')){
            row = e.target.getAttribute('data-row');
            column = e.target.getAttribute('data-column')
            twoPlayer(row, column);
        }
    });

    render.setBoard(board.getBoard());

    return {
        twoPlayer,
        vsComp,
        vsAi
    }
}


function DisplayController(){
    
    const boardUI = document.getElementById('board');
    const turnUI = document.querySelector('#turn h3');

    const setBoard = (board) => {
        let cell = "";
        for(let i = 0; i < 3; i++){
            for(let j = 0; j < 3; j++){
                cell += `<button type="button" class="cell" data-row="${i}" data-column="${j}">${board[i][j]}</button>`;
            }
        }
        boardUI.innerHTML = cell;
    }

    const playerTurn = (player) => {
        let content = `${player} Turn`
        turnUI.textContent = content;
    }

    return {
        setBoard,
        playerTurn
    }

}

const game = GameController()
// game.twoPlayer();
