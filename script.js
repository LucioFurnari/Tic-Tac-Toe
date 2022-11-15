function Player(name,marker,playerClass,indexArray) {
    let win = 0;
    let lose = 0;
    let tie = 0;
    function winCount() {
        win = win + 1;
    }
    function loseCount() {
        lose = lose + 1;
    }
    function tieCount() {
        tie = tie + 1;
    }
    function resetArray() {
        indexArray = indexArray.splice(0,indexArray.length)
        console.log(indexArray);
    }
    return {
        name,
        marker,
        playerClass,
        indexArray,
        winCount,
        loseCount,
        tieCount,
        resetArray,
    }
}
const playerX = Player("Player One","X","cross",[]);
const playerO = Player("Player Two","O","circle",[]);

/*--------------------- Logic Module ----------------------------*/

const gameBoard = (function() {
    let board = ["","","",
                "","","",
                "","",""];
    let changeMarker = true;
    let finishGame = false;
    let winPlayer;
    let losePlayer;
    let playsCont = 9;
    
    function resetGameVariables() {
        board.fill("")
        playerX.resetArray();
        playerO.resetArray();
        changeMarker = true;
        finishGame = false;
        winPlayer = undefined;
        losePlayer = undefined;
        playsCont = 9;
    }

    function checkResult(result) {
        if(result == playerX){
            console.log("Win PlayerX");
            winPlayer = playerX.name;
            losePlayer = playerO.name;
            playerX.winCount();
            playerO.loseCount();
            displayController.displayResult(winPlayer, " Win")
            finishGame = true;
        } else if (result == playerO){
            console.log("Win PlayerO");
            winPlayer = playerO.name;
            losePlayer = playerX.name;
            playerO.winCount();
            playerX.loseCount();
            displayController.displayResult(winPlayer, " Win")
            finishGame = true;
        } else if(playsCont == 0 ) {
            finishGame = true;
            playerX.tieCount();
            playerO.tieCount();
            displayController.displayResult("", " Tie")
        }
    }
    function winCondition (array,one,two,three) {
        let oneIsValid = array.includes(one);
        let twoIsValid = array.includes(two)
        let threeIsValid = array.includes(three)
        if (oneIsValid && twoIsValid && threeIsValid) {
            return true
        }
    }

    function winnerCheck(player) {
        switch (true) {
            case winCondition(player.indexArray,0,1,2):
                return player
                break;
            case winCondition(player.indexArray,3,4,5):
                return player
                break;
            case winCondition(player.indexArray,6,7,8):
                return player
                break;
            case winCondition(player.indexArray,0,3,6):
                return player
                break;
            case winCondition(player.indexArray,1,4,7):
                return player
                break;
            case winCondition(player.indexArray,2,5,8):
                return player
                break;
            case winCondition(player.indexArray,0,4,8):
                return player
                break;
            case winCondition(player.indexArray,2,4,6):
                return player
                break;
            default:
                break;
        }
    }

    function gameCheck(index,markerPlayer) {
        if(markerPlayer == playerX.marker) {
            playerX.indexArray.push(index)
            checkResult(winnerCheck(playerX))
        } else if (markerPlayer == playerO.marker) {
            playerO.indexArray.push(index)
            checkResult(winnerCheck(playerO))
        }
    }

    function addMarker(event,playerOne,playerTwo) {
        let marker = changeMarker ? playerOne.marker : playerTwo.marker;
        let markStyle = changeMarker ? playerOne.playerClass : playerTwo.playerClass;
        if(!finishGame) {
            board.map((elem,i) => {
            if(event.target.getAttribute("number") == i){
                if(board[i] == playerOne.marker || board[i] == playerTwo.marker){
                return
                } else {
                board[i] = marker;
                playsCont = playsCont - 1;
                console.log("test");
                console.log(playerX.indexArray);
                gameCheck(i,marker)
                displayController.displayMarker(marker,markStyle,event)
                changeMarker = !changeMarker;
                }
            }})
        }
    }
    return {board, addMarker, resetGameVariables}
})()

/*--------------------- Visual Module ----------------------------*/

const displayController = (function() {
    const gameboardGrid = document.querySelector(".gameboard");
    const playerResult = document.querySelector(".playerResult");
    const resetButton = document.querySelector(".resetBtn");

    resetButton.addEventListener("click",resetGame)

    function resetGame() {
        gameBoard.resetGameVariables()
        while (gameboardGrid.firstChild) {
            gameboardGrid.removeChild(gameboardGrid.firstChild)
        }
        console.log(gameBoard.board);
        displayBoard(gameBoard.board)
    }

    function displayResult(player,result){
        playerResult.textContent = player + result;
    }
    
    function displayMarker(mark,style,event) {
        event.target.classList.add(style);
        event.target.textContent = mark;
    }
    function displayBoard (board) {
        board.map((elem,i) => {
            let square = document.createElement("div");
            square.classList.add("square");
            square.setAttribute("number",i);
            square.addEventListener("click",(event) => {
                gameBoard.addMarker(event,playerX,playerO) 
            })
            gameboardGrid.appendChild(square);
        })
    }
    return {displayBoard,displayMarker,displayResult}
})()

displayController.displayBoard(gameBoard.board)