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

    const resetBoard = () => {
        for (let i = 0; i < row; i++){
            _board[i] = []
            for (let j = 0; j < col; j++){
                _board[i].push('');
            }
        }
        return getBoard();
    }

    return {
        getBoard,
        resetBoard,
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

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

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

    const resetPlayer = () => {
        activePlayer = players[0];
    }

    const swithPlayer = () => {
        activePlayer = activePlayer == players[0] ? players[1] : players[0];
    }

    const printRound = () => {
        let boardValue = board.getBoard();
        
        if(rules.checkRow(boardValue) || rules.checkColumn(boardValue) || rules.checkDiag(boardValue)){
            render.setBoard(boardValue);
            return true
        } else if (rules.checkDraw(boardValue)){
            render.setBoard(boardValue);
            return false
        }
        render.setBoard(boardValue);
    }
    
    const winnerMessage = () => {
        let boardValue = board.getBoard()
        let result = checkWinner(boardValue);
        if(printRound()){
            if(result == 'X'){
                setGameCondition(false)
                render.winnerMessage(result);
                return true;
            } else if (result == 'O'){
                setGameCondition(false)
                render.winnerMessage(result);
                return true;
            } else if(result == 'draw'){
                setGameCondition(false)
                render.winnerMessage(result);
                return true;
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

        if(printRound() == false){
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
            winnerMessage();
        } else {
            twoPlayer();
        }    
        newRound(twoPlayer);
    }    

    const vsComp = (row, column) => {
        render.playerTurn(getActivePlayer().name);
        async function computerTurn() {
            await sleep(500);
            [row, column] = getRandomMove();
                if(board.setMove(row, column, getActivePlayer().token) == true){
                    if(winnerMessage() == true){
                        return;
                    };
                } else {
                    vsComp();
                }
                newRound(vsComp);
        }

        async function playerTurn() {
            render.stopBoard();
            await sleep(100);
            render.activeBoard();
            if(board.setMove(row, column, getActivePlayer().token) == true){
                if(winnerMessage() == true){
                    return;
                };
            } else {
                vsComp();
            }
            newRound(vsComp);
        }

        if(getActivePlayer().token == 'O'){
            computerTurn();
        } else {
            playerTurn()
        }
    }

    const vsAi = (row, column) => {
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
            if(board.setMove(row, column, getActivePlayer().token) == true){
                console.log(winnerMessage());
            } else {
                vsAi();
            }
            newRound(vsAi);
        }
    }

    const twoPlayerButton = document.getElementById('two-player');
    const vsCompButton = document.getElementById('vs-computer');
    const vsAIButton = document.getElementById('vs-ai');


    twoPlayerButton.addEventListener('click', () => {
        render.reset();
        render.setBoard(board.resetBoard());
    
        window.addEventListener('click', (e) => {
            that = e.target;
            if(that.classList.contains('cell')){
                row = e.target.getAttribute('data-row');
                column = e.target.getAttribute('data-column')
                twoPlayer(row, column);
            }
    
            if(that.id == 'reset-button'){
                resetPlayer();
                render.playerTurn(getActivePlayer().name);
                render.setBoard(board.resetBoard());
                render.reset();
            }
    
            if(that.id == 'back-to-game-mode'){
                render.homeScreen();
            }
        });  
    })

    vsCompButton.addEventListener('click', () => {
        render.reset();
        render.setBoard(board.resetBoard());
    
        window.addEventListener('click', (e) => {
            that = e.target;
            if(that.classList.contains('cell')){
                row = e.target.getAttribute('data-row');
                column = e.target.getAttribute('data-column')
                vsComp(row, column);
            }
    
            if(that.id == 'reset-button'){
                resetPlayer();
                render.playerTurn(getActivePlayer().name);
                render.setBoard(board.resetBoard());
                render.reset();
                setGameCondition(true);
            }
    
            if(that.id == 'back-to-game-mode'){
                render.homeScreen();
            }
        });  
    })

    return {
        twoPlayer,
        vsComp,
        vsAi
    }
}


function DisplayController(){
    
    const boardUI = document.getElementById('board');
    const turnUI = document.querySelector('#turn');
    const resetButtonUI = document.getElementById('reset-button');
    const backToGameModeButtonUI = document.getElementById('back-to-game-mode')
    const gameModeUI = document.getElementById('game-mode');
    const winnerMessageUI = document.getElementById('winner-message');

    const reset = () => {
        turnUI.classList.remove('hidden');
        resetButtonUI.classList.remove('hidden');
        backToGameModeButtonUI.classList.remove('hidden');
        gameModeUI.style.display = 'none';
        boardUI.style.display = '';
        winnerMessageUI.classList.add('hidden');
        activeBoard();
    }
    
    const homeScreen = () => {
        turnUI.classList.add('hidden');
        resetButtonUI.classList.add('hidden');
        backToGameModeButtonUI.classList.add('hidden');
        boardUI.style.display = 'none';
        gameModeUI.style.display = '';
        winnerMessageUI.classList.add('hidden');
    }
    
    const setBoard = (board) => {
        let cell = "";
        for(let i = 0; i < 3; i++){
            for(let j = 0; j < 3; j++){
                cell += `<button type="button" class="cell" style="color:${board[i][j] == 'X' ? 'red' : 'blue'}" data-row="${i}" data-column="${j}">${board[i][j]}</button>`;
            }
        }
        boardUI.innerHTML = cell;
    }
    
    const playerTurn = (player) => {
        let content = `${player} Turn`
        turnUI.textContent = content;
    }
    
    const winnerMessage = (result) => {
        winnerMessageUI.classList.remove('hidden');
        winnerMessageUI.textContent = `${result == 'draw' ? 'Draw' : result + ' Winner'}`;
        stopBoard();
    }
    
    const stopBoard = () => {
        boardUI.style.cssText = 'pointer-events: none';
    }
    
    const activeBoard = () => {
        boardUI.style.cssText = 'pointer-events: auto';
    }

    return {
        setBoard,
        stopBoard,
        activeBoard,
        playerTurn,
        winnerMessage,
        homeScreen,
        reset
    }

}

const game = GameController()

