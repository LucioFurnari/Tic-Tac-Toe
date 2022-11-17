function Player(marker,playerClass,indexArray) {
    let win = 0;  
    let name = "";
    return {
        name,
        marker,
        playerClass,
        indexArray,
        winCount: function() {
            this.win = this.win + 1;
        },
        resetArray: function(){
            this.indexArray = [];
        },
        resetWinCount: function() {
            this.win = 0;
        },
        changeName: function(name) {
            console.log("test");
            this.name = name;
        },
        win,
    }
}
const playerX = Player("X","cross",[]);
const playerO = Player("O","circle",[]);

/*--------------------- Logic Module ----------------------------*/

const gameBoard = (function() {
    let board = ["","","",
                "","","",
                "","",""];
    let changeMarker = true;
    let finishGame = false;
    let winPlayer;
    let playsCont = 9;

    
    function resetGameVariables() {
        board.fill("")
        playerX.resetArray();
        playerO.resetArray();
        // changeMarker = true;
        finishGame = false;
        winPlayer = undefined;
        playsCont = 9;
    }

    function checkResult(result) {
        if(result){
            result.winCount();
            displayController.displayResult(result.name, " Win")
            finishGame = true;
        } else if(playsCont == 0 ) {
            finishGame = true;
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
        const winPositions = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]
        let winner;
        winPositions.forEach(pos=> {
            if(winCondition(player.indexArray,pos[0],pos[1],pos[2])){
                winner = player; 
            }
        })
        return winner
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
                gameCheck(i,marker);
                displayController.displayMarker(marker,markStyle,event);
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

    const boardOverlay = document.querySelector(".overlay");
    const resultBoard = document.querySelector(".result-board");

    const formOverlay = document.querySelector(".form-overlay");
    const formContainer = document.querySelector(".form-container");
    const playerForm = document.querySelector(".names-form");
    displayPlayerInfo()

    playerForm.addEventListener("submit",(event) => {
        event.preventDefault()
        playerX.changeName(document.querySelector("input[name=player-one]").value)
        playerO.changeName(document.querySelector("input[name=player-two]").value)
        formOverlay.classList.remove("active")
        formContainer.classList.remove("active")
        displayPlayerInfo()
    })

    resetButton.addEventListener("click",() => {
        resetGame()
        playerX.resetWinCount();
        playerO.resetWinCount();
        displayPlayerInfo()
    })
    boardOverlay.addEventListener("click",() => {
        boardOverlay.classList.remove("active");
        resultBoard.classList.remove("active");
        resetGame()
    })

    function displayPlayerInfo(){
        document.querySelector(".playerOneName").textContent = playerX.name;
        document.querySelector(".playerTwoName").textContent = playerO.name;
        document.querySelector(".playerOneScore").textContent = playerX.win;
        document.querySelector(".playerTwoScore").textContent = playerO.win;
    }
    function resetGame() {
        gameBoard.resetGameVariables()
        while (gameboardGrid.firstChild) {
            gameboardGrid.removeChild(gameboardGrid.firstChild)
        }
        displayBoard(gameBoard.board)
    }

    function displayResult(player,result){
        boardOverlay.classList.add("active");
        resultBoard.classList.add("active");
        playerResult.textContent = player + result;
        displayPlayerInfo()
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