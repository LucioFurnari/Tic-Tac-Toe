function Player(name,marker,playerClass,indexArray) {
    let win = 0;
    function winCount() {
        win = win + 1;
        console.log(win);
    }

    return {
        name,
        marker,
        playerClass,
        indexArray,
        winCount,
    }
}
const playerX = Player("Player One","X","cross",[]);
const playerO = Player("Player Two","O","circle",[]);

const gameBoard = (function() {
    let board = ["","","",
                "","","",
                "","",""];
    let changeMarker = true;

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
                displayController.displayResult(player.name,"Win")
                player.winCount();
                break;
            case winCondition(player.indexArray,3,4,5):
                displayController.displayResult(player.name,"Win")
                player.winCount();
                break;
            case winCondition(player.indexArray,6,7,8):
                displayController.displayResult(player.name,"Win")
                break;
            case winCondition(player.indexArray,0,3,6):
                displayController.displayResult(player.name,"Win")
                break;
            case winCondition(player.indexArray,1,4,7):
                displayController.displayResult(player.name,"Win")
                break;
            case winCondition(player.indexArray,2,5,8):
                displayController.displayResult(player.name,"Win")
                break;
            case winCondition(player.indexArray,0,4,8):
                displayController.displayResult(player.name,"Win")
                break;
            case winCondition(player.indexArray,2,4,6):
                displayController.displayResult(player.name,"Win")
                break;
            default:
                break;
        }
    }

    function gameCheck(index,markerPlayer) {
        if(markerPlayer == playerX.marker) {
            playerX.indexArray.push(index)
            winnerCheck(playerX)
        } else if (markerPlayer == playerO.marker) {
            playerO.indexArray.push(index)
            winnerCheck(playerO)
        }
    }

    function addMarker(event,playerOne,playerTwo) {
        let marker = changeMarker ? playerOne.marker : playerTwo.marker;
        let markStyle = changeMarker ? playerOne.playerClass : playerTwo.playerClass;
        board.map((elem,i) => {
        if(event.target.getAttribute("number") == i){
            if(board[i] == playerOne.marker || board[i] == playerTwo.marker){
                return
            } else {
                board[i] = marker;
                gameCheck(i,marker)
                console.log(markStyle);
                displayController.displayMarker(marker,markStyle,event)
                changeMarker = !changeMarker;
                console.log(board);
            }
        }})
    }
    return {board, addMarker}
})()


const displayController = (function() {
    const gameboardGrid = document.querySelector(".gameboard");
    const playerResult = document.querySelector(".playerResult");

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