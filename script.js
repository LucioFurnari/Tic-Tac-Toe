const gameBoard = (function() {
    let board = ["","","",
                "","","",
                "","",""];
    function addMarker(event) {
        board.map((elem,i) => {
        if(this.getAttribute("number") == i){
            if(board[i] == "X") {
                console.log("Ya tiene x");
                return
            } else {
                board[i] = "X";
                console.log(board);
            }
        }
    })
    }
    return {board, addMarker}
})()


const displayController = (function() {
    const gameboardGrid = document.querySelector(".gameboard");
    function displayMarker() {

    }
    function displayBoard (board) {
        board.map((elem,i) => {
            let square = document.createElement("div");
            square.classList.add("square");
            square.setAttribute("number",i);
            square.addEventListener("click",gameBoard.addMarker )
            gameboardGrid.appendChild(square);
        })
    }
    return {displayBoard}
})()

displayController.displayBoard(gameBoard.board)