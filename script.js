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
    let botActive = false;

    function changeBotActive(value) {
        botActive = value;
    }
    
    function resetGameVariables() {
        board.fill("")
        playerX.resetArray();
        playerO.resetArray();
        // changeMarker = true;
        finishGame = false;
        winPlayer = undefined;
        playsCont = 9;
    }

    function getResult(result) {
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
            getResult(winnerCheck(playerX))
        } else if (markerPlayer == playerO.marker) {
            playerO.indexArray.push(index)
            getResult(winnerCheck(playerO))
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
                if(botActive && !finishGame) {
                    console.log("probando");
                    botController.gameBot(board,playerOne,playerTwo,gameCheck)
                    playsCont = playsCont - 1;
                } else {
                    changeMarker = !changeMarker;
                } 
                }
            }})
        }
    }
    return {board, addMarker, resetGameVariables,changeBotActive}
})()


/*--------------------- Visual Module ----------------------------*/

const displayController = (function() {
    const gameBoardGrid = document.querySelector(".gameboard");
    const playerResult = document.querySelector(".playerResult");
    const resetButton = document.querySelector(".resetBtn");

    const boardOverlay = document.querySelector(".overlay");
    const resultBoard = document.querySelector(".result-board");

    const formOverlay = document.querySelector(".form-overlay");
    const formContainer = document.querySelector(".form-container");
    const playerForm = document.querySelector(".names-form");

    const botSelector = document.querySelector(".bot-select");
    const playerTwoLabel = document.querySelector(".player-two-label");

    let selectLabel = false;
    botSelector.addEventListener("click",() => {
        selectLabel = !selectLabel;
        if(selectLabel) {
            playerTwoLabel.textContent = "Bot";
            botSelector.classList.add("bot-active")
            gameBoard.changeBotActive(true);
        } else {
            playerTwoLabel.textContent = "Player Two";
            botSelector.classList.remove("bot-active")
            gameBoard.changeBotActive(false);
        }
        
    })

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
        while (gameBoardGrid.firstChild) {
            gameBoardGrid.removeChild(gameBoardGrid.firstChild)
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
            gameBoardGrid.appendChild(square);
        })
    }
    displayBoard(gameBoard.board)
    displayPlayerInfo()
    return {displayBoard,displayMarker,displayResult}
})()

/*--------------------- IA Module ----------------------------*/

const botController = (function(){
    function getRandomInt(min,max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    }
    function checkWinnerPosition(userPlayer,botPlayer,one,two,three) {
            let choiceOne = userPlayer.includes(one)
            let choiceTwo = userPlayer.includes(two)
            let choiceThree = userPlayer.includes(three)
            if (choiceOne) {
                console.log("probando");
                return two;
            }
    }
    function gameBot(board,playerOne,playerTwo,gameCheckFunction) {
        const winnerPositions = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]
        const gameBoardSquares = document.querySelectorAll(".square");
        let indexArray = []
        for(let i=0; i < board.length; i++){
            if(board[i] != playerOne.marker && board[i] != playerTwo.marker){
                indexArray.push(i)
            }
        }
        // let testvalue = winnerPositions.forEach(elem => checkWinnerPosition(playerOne.indexArray,elem[0],elem[1],elem[2]))
        // console.log(testvalue);
        // console.log(playerOne.indexArray);
        let nRandom = getRandomInt(0,indexArray.length);
        let index = indexArray[nRandom]

        gameBoardSquares.forEach((square) => {
            if(square.getAttribute("number") == index){
                board[index] = playerTwo.marker;
                gameCheckFunction(index,playerTwo.marker);
                square.classList.add(playerTwo.playerClass)
                square.textContent = playerTwo.marker
        }})
    }
    return {gameBot}
}())