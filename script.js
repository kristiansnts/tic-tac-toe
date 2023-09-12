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
            // alert('please choose empty cell!!');
            return false;
        }
    }

    const printBoard = () => {

        const _rules = Rules();

        const boardWithValue = _board.map((row) => row.map((cell) => cell.getValue()))

        if(_rules.checkDiag(boardWithValue) || _rules.checkColumn(boardWithValue) || _rules.checkRow(boardWithValue)){
            return [boardWithValue, true];
        }
        
        if (_rules.checkDraw(boardWithValue)){
            return [boardWithValue, false]
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

    let getGameCondition = () => _gameCondition;

    let gameMessage = (condition) => {
        if(condition == 'X') {
            console.log('X Win')
        } else if (condition == 'O'){
            console.log('O Win')
        } else {
            console.log('Draw')
        }
    }

    let checkWinner = (player, condition) => {
        if(player == 'X' && condition == true){
            return 'O';
        } else if( player == 'O' && condition == true){
            return 'X';
        } else if( condition == false ) {
            return 'draw';
        }
    }

    const printNewRound = () => {
        if(_board.printBoard().length == 2){
            console.log(_board.printBoard()[0])
            _gameCondition = (_board.printBoard()[1]) ? false : true
            let message = checkWinner(getActivePlayer().token, _board.printBoard()[1]);
            // console.log(message, getActivePlayer().token);
            gameMessage(message);
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
    
    const vsComp = () => {
        if(getActivePlayer().token == 'O'){
            [row, column] = getRandom();
            playRound(column, row)
            alert(`Computer put row ${row}, and column ${column}`);
        } else {
            alert(`You're ${getActivePlayer().name}, please input column and row you will place!`);
            const column = parseInt(prompt('Insert your column from 0 to 2'));
            const row = parseInt(prompt('Insert your row from 0 to 2'));
            playRound(column, row);
        }
        if(getGameCondition() == true){
            vsComp();
        } else {
            return;
        }
    }

    // const vsAi = () => {
    //     let board = _board.getBoard();
    //     let bestScore = -Infinity;
    //     if(getActivePlayer().token == 'O'){
    //         let move;
            // for (let i = 0; i < board.length; i++){
            //     for (let j = 0; j < board.length; j++){
            //         if(board[i][j].getValue() == ''){
            //             board[i][j].addMove(getActivePlayer().token);
            //             let score = minimax(board, 0, true);
            //             board[i][j].addMove('');
            //             // console.log(board[i][j])
            //             if(score > bestScore){
            //                 bestScore = score
            //                 move = {i, j};
            //             }
            //         }
            //     }
            // }
            // board.forEach((row, rIndex) => row.forEach((item, cIndex) => {
            //     if(item.getValue() == ''){
            //         board[rIndex][cIndex].addMove(getActivePlayer().token);
            //         let score = minimax(board, 0, true);
            //         board[rIndex][cIndex].addMove('');
            //         if(score > bestScore){
            //             bestScore = score
            //             move = {rIndex, cIndex};
            //         }
            //     }
            // }));
    //         playRound(move.j, move.i);
    //         alert(`Computer put row ${move.i}, and column ${move.j}`);
    //     } else {
    //         alert(`You're ${getActivePlayer().name}, please input column and row you will place!`);
    //         const column = parseInt(prompt('Insert your column from 0 to 2'));
    //         const row = parseInt(prompt('Insert your row from 0 to 2'));
    //         playRound(column, row);
    //     }

    //     if(getGameCondition() == true){
    //         vsAi();
    //     } else {
    //         return;
    //     }
    // }

    const vsAi = () => {
        if(getActivePlayer().token == 'O'){
            // [column, row] = bestMove(getActivePlayer().token);
            let board = _board.getBoard().map((row) => row.map((cell) => cell.getValue()));
            let bestScore = -1000;
            let move;
            for (let i = 0; i < board.length; i++){
                for (let j = 0; j < board.length; j++){
                    if(board[i][j] == ''){
                        board[i][j] = 'O';
                        let score = minimax(board, 0, false);
                        board[i][j] = '';
                        if(score > bestScore){
                            bestScore = score
                            console.log(j, i)
                        }
                    }
                }
            }
            // console.log(move);
            // playRound(move.j, move.i);
            // alert(`Computer put row ${row}, and column ${column}`);
        } else {
            alert(`You're ${getActivePlayer().name}, please input column and row you will place!`);
            const column = parseInt(prompt('Insert your column from 0 to 2'));
            const row = parseInt(prompt('Insert your row from 0 to 2'));
            playRound(column, row);
        }

        if(getGameCondition() == true){
            vsAi();
        } else {
            return;
        }
    }

    // const bestMove = (player) => {
    //     let board = _board.getBoard().map((row) => row.map((cell) => cell.getValue()));
    //     let bestScore = -1000;
    //     let move;
    //     for (let i = 0; i < board.length; i++){
    //         for (let j = 0; j < board.length; j++){
    //             if(board[i][j] == ''){
    //                 board[i][j] = (player);
    //                 let score = minimax(board, 0, false);
    //                 board[i][j] = ('');
    //                 if(score > bestScore){
    //                     bestScore = score
    //                     move = {j, i}
    //                 }
    //             }
    //         }
    //     }


    //     // for (let i = 0; i < board.length; i++){
    //     //     for (let j = 0; j < board.length; j++){
    //     //         if(board[rows[i]][cols[j]] == ''){
    //     //             board[rows[i][cols[j]]] = player;
    //     //             let score = minimax(board, 0, false)
    //     //             board[rows[i][cols[j]]] = '';
    //     //             if(score > bestScore){
    //     //                 bestScore = score;
    //     //                 return [i, j]
    //     //             }
    //     //         }
    //     //     }
    //     // }
    // }

    let scores = {
        'X': -1,
        'O': 1,
        'draw': 0
    }

    const minimax = (board, depth, isMaximizing) => {

        
        console.log(_board.printBoard())
        if(_board.printBoard().length == 2){
            let result = checkWinner(getActivePlayer().token, _board.printBoard()[1]);
            return scores[result]
        } 

        
        if(isMaximizing){
            let bestScore = Infinity;
            for(let i = 0; i < board.length; i++){
                for(let j = 0; j < board.length; j++){
                    if(board[i][j] == ''){
                        board[i][j] = 'O';
                        let score = minimax(board, depth + 1, false)
                        board[i][j] = '';
                        bestScore = Math.max(score, bestScore)
                    }
                }
            }
            return bestScore;
        } else {
            let bestScore = -Infinity;
            for (let i = 0; i < board.length; i++){
                for (let j = 0; j < board.length; j++){
                    if(board[i][j] == ''){
                        board[i][j] = 'X';
                        // console.log(board[i][j], [i, j]);
                        let score = minimax(board, depth + 1, true);
                        board[i][j] = '';
                        bestScore = Math.min(score, bestScore)
                    }
                }
            }
            return bestScore;
        }

    }

    // const minimax = (board, depth, isMaximizing) => {

    //     if(_board.printBoard().length == 2){
    //         let result = checkWinner('X', _board.printBoard()[1])
          
    //         if (result == 'O'){
    //             return scores['O']
    //         }
    //     }



    //     if (isMaximizing) {
    //         let bestScore = -Infinity
    //         board.forEach((row, rIndex) => row.forEach((item, cIndex) => {
    //             if(item.getValue() == ''){
    //                 board[rIndex][cIndex].addMove('O');
    //                 let score = minimax(board, depth + 1, false);
    //                 board[rIndex][cIndex].addMove('');
    //                 bestScore = Math.max(score, bestScore)
    //             }
    //         }));
    //         return bestScore
    //     } else {
    //         let bestScore = Infinity
    //         board.forEach((row, rIndex) => row.forEach((item, cIndex) => {
    //             if(item.getValue() == ''){
    //                 board[rIndex][cIndex].addMove('X');
    //                 let score = minimax(board, depth + 1, true);
    //                 board[rIndex][cIndex].addMove('');
    //                 bestScore = Math.min(score, bestScore)
    //             }
    //         }));
    //         return bestScore
    //     }
       
    // }

    const getRandom = () => {
        const board = _board.getBoard().map(row => row.map(cell => cell.getValue()));
        let rows = []
        let cols = []
        board.forEach((row, rIndex) => row.forEach((item, cIndex) => {
            if(item == ''){
                rows.push(rIndex)
                cols.push(cIndex)
            }
        }));
        const randomRow = rows[Math.floor(Math.random()*rows.length)];
        const randomCol = cols[Math.floor(Math.random()*cols.length)];
        return [randomRow, randomCol];
    }

    printNewRound();

    return {
        playRound,
        twoPlayer,
        getActivePlayer,
        vsComp,
        vsAi
    }
}

const game = GameController();
// game.playRound(0,0)
// game.playRound(2,0)
// game.playRound(0,1)
// game.playRound(0,2)
// game.playRound(1,2)
// game.vsComp();
game.vsAi();
// game.playRound(1,1)
// game.playRound(2,0)
// game.playRound(2,1)
// game.playRound(2,2)
// game.playRound(1,2)

// game.twoPlayer();

// const board = GameBoard()
// board.getBoard();