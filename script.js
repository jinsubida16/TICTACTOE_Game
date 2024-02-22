const n = 3;
const winCondition = 3;
const gameBoard = Array.from({length: n}, () =>
    Array.from({length: n}, () => 0)
);

const clickplay = new Audio("playclick.mp3");
const losegame = new Audio("lose.mp3");
const wingame = new Audio("winner.mp3");
document.getElementById("bgmusic").volume=0.5;

let player = 1;
let AI = false;

function restart() {
    const cells = document.querySelectorAll('.cell');
    for (let i = 0; i < cells.length; i++) {
        cells[i].textContent = '';
        cells[i].addEventListener('click', cellClick, false);
    }
    player = 1;
    gameBoard.forEach(arr => arr.fill(0));
    console.log(gameBoard)
}

function cellClick(cell) {
    clickplay.play();
    play(cell.target.id);
    if (AI) {
        const aiResult = minmax(gameBoard, 0, player);
        console.log(aiResult);
        const cellId = `c${aiResult.row}${aiResult.col}`;
        play(cellId);
    }
}

function play(cellId) {
    const cell = document.getElementById(cellId);
    if (cell.textContent === '') {
        const pattern = player === 1 ? 'O' : 'X';
        console.log(`play ${pattern} on ${cellId}`);
        cell.textContent = pattern;
        const row = parseInt(cellId.charAt(1));
        const col = parseInt(cellId.charAt(2));
        writeBoard(row, col);
        checkBoard(row, col);
        switchTurn();
        clickplay.play();
    }

}

function writeBoard(row, col) {
    console.log(`${row}:${col}`);
    gameBoard[row][col] = player;
}

function switchTurn() {
    if (player === 1) {
        player = -1;
    } else {
        player = 1;
    }
}

function checkBoard(row, col) {
    let winner = null;
    const state = gameState(gameBoard, player, row, col);
    if (state) {
        winner = player === 1 ? 'O' : 'X';
        endGame(winner);
    } else if (state === null) {
        console.log(`TIE`);
        endGame(null);
    }
}

function gameState(board, player, row, col) {
    let diag1 = 0;
    let diag2 = 0;
    if (row === undefined && col === undefined) {
        for (let i = 0; i < n; i++) {
            let ver = 0;
            let hor = 0;
            for (let j = 0; j < n; j++) {
                ver += board[j][i];
                hor += board[i][j];
            }
            if (ver === player * winCondition || hor === player * winCondition) {
                return true;
            }
        }
        for (let i = 0; i < n; i++) {
            diag1 += board[i][i];
            diag2 += board[i][n - 1 - i];
        }
        if (diag1 === player * winCondition || diag2 === player * winCondition) {
            return true;
        } else if (board.every(arr => arr.every(n => n !== 0))) {
            return null;
        } else {
            return false;
        }
    } else {
       
        let ver = 0;
        let hor = 0;
        for (let i = 0; i < n; i++) {
            ver += board[i][col];
            hor += board[row][i];
            diag1 += board[i][i];
            diag2 += board[i][n - 1 - i];
        }
        if (ver === player * winCondition || hor === player * winCondition || diag1 === player * winCondition || diag2 === player * winCondition) {
            return true;
        } else if (board.every(arr => arr.every(n => n !== 0))) {
            return null;
        } else {
            return false;
        }
    }
}

function endGame(winner) {
    const cells = document.querySelectorAll('.cell');
    for (let i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', cellClick);
    }
    if (winner !== null) {
        setTimeout(() => alert(`Congratulations! ${winner} WIN!`), 0);
        wingame.play();
    } else {
        setTimeout(() => alert(`It's a tie`), 0);
        losegame.play();
    }
}

function minmax(board, depth, player) {
    
    const state = gameState(board, player === 1 ? -1 : 1);
    if (state) {
       
        return player === -1 ? depth - 10 : 10 - depth;
    } else if (state === null) {
        return 0;
    } else {
        let moves = [];
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                const calcBoard = board.map(arr => Array.from(arr));
                if (calcBoard[i][j] === 0) {
                    calcBoard[i][j] = player;
                    const value = minmax(calcBoard, depth + 1, player === 1 ? -1 : 1);
                    moves.push({
                        cost: value,
                        cell: {
                            row: i,
                            col: j
                        }
                    });
                }
            }
        }
        if (player === -1) {
            const max = moves.reduce((a, b) => a.cost > b.cost ? a : b);
            if (depth === 0) {
                return max.cell;
            } else {
                return max.cost;
            }
        } else {
            const min = moves.reduce((a, b) => a.cost < b.cost ? a : b);
            if (depth === 0) {
                return min.cell;
            } else {
                return min.cost;
            }
        }
    }
}

restart();
