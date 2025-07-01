document.addEventListener("DOMContentLoaded", () => {
    const gridDisplay = document.querySelector(".grid")
    const scoreDisplay = document.querySelector("#score")
    const resultDisplay = document.querySelector("#result")
    const width = 4
    let squares = []
    let score = 0

    function createBoard() {
        for (let i = 0; i < width * width; i++) {
            const square = document.createElement("div")
            square.innerHTML = 0
            gridDisplay.appendChild(square)
            squares.push(square)
        }
        generate()
        generate()
    }
    createBoard()

    function generate() {
        const randomNumber = Math.floor(Math.random() * squares.length)
        if (squares[randomNumber].innerHTML == 0) {
            squares[randomNumber].innerHTML = 2
            checkForGameOver()
        } else generate()
    }

    function moveRight() {
        for (let i = 0; i < 16; i++) {
            if (i % 4 === 0) {
                let row = [0, 1, 2, 3].map(j => parseInt(squares[i + j].innerHTML))
                let filteredRow = row.filter(num => num)
                let newRow = Array(4 - filteredRow.length).fill(0).concat(filteredRow)
                newRow.forEach((val, j) => squares[i + j].innerHTML = newRow[j])
            }
        }
    }

    function moveLeft() {
        for (let i = 0; i < 16; i++) {
            if (i % 4 === 0) {
                let row = [0, 1, 2, 3].map(j => parseInt(squares[i + j].innerHTML))
                let filteredRow = row.filter(num => num)
                let newRow = filteredRow.concat(Array(4 - filteredRow.length).fill(0))
                newRow.forEach((val, j) => squares[i + j].innerHTML = newRow[j])
            }
        }
    }

    function moveUp() {
        for (let i = 0; i < 4; i++) {
            let column = [0, 1, 2, 3].map(j => parseInt(squares[i + width * j].innerHTML))
            let filteredColumn = column.filter(num => num)
            let newColumn = filteredColumn.concat(Array(4 - filteredColumn.length).fill(0))
            newColumn.forEach((val, j) => squares[i + width * j].innerHTML = newColumn[j])
        }
    }

    function moveDown() {
        for (let i = 0; i < 4; i++) {
            let column = [0, 1, 2, 3].map(j => parseInt(squares[i + width * j].innerHTML))
            let filteredColumn = column.filter(num => num)
            let newColumn = Array(4 - filteredColumn.length).fill(0).concat(filteredColumn)
            newColumn.forEach((val, j) => squares[i + width * j].innerHTML = newColumn[j])
        }
    }

    function combineRow() {
        for (let i = 0; i < 15; i++) {
            if (squares[i].innerHTML === squares[i + 1].innerHTML) {
                let combinedTotal = parseInt(squares[i].innerHTML) + parseInt(squares[i + 1].innerHTML)
                squares[i].innerHTML = combinedTotal
                squares[i + 1].innerHTML = 0
                score += combinedTotal
                scoreDisplay.innerHTML = score
            }
        }
        checkForWin()
    }

    function combineColumn() {
        for (let i = 0; i < 12; i++) {
            if (squares[i].innerHTML === squares[i + width].innerHTML) {
                let combinedTotal = parseInt(squares[i].innerHTML) + parseInt(squares[i + width].innerHTML)
                squares[i].innerHTML = combinedTotal
                squares[i + width].innerHTML = 0
                score += combinedTotal
                scoreDisplay.innerHTML = score
            }
        }
        checkForWin()
    }

    function control(e) {
        if (e.key === "ArrowLeft") keyLeft()
        else if (e.key === "ArrowRight") keyRight()
        else if (e.key === "ArrowUp") keyUp()
        else if (e.key === "ArrowDown") keyDown()
    }
    document.addEventListener("keydown", control)

    function keyLeft() {
        moveLeft()
        combineRow()
        moveLeft()
        generate()
    }

    function keyRight() {
        moveRight()
        combineRow()
        moveRight()
        generate()
    }

    function keyUp() {
        moveUp()
        combineColumn()
        moveUp()
        generate()
    }

    function keyDown() {
        moveDown()
        combineColumn()
        moveDown()
        generate()
    }

    function checkForWin() {
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].innerHTML == 2048) {
                resultDisplay.innerHTML = "You WIN!"
                document.removeEventListener("keydown", control)
                setTimeout(clear, 3000)
            }
        }
    }

    function checkForGameOver() {
        let zeros = squares.filter(square => square.innerHTML == 0).length
        if (zeros === 0) {
            resultDisplay.innerHTML = "You LOSE!"
            document.removeEventListener("keydown", control)
            setTimeout(clear, 3000)
        }
    }

    function clear() {
        clearInterval(myTimer)
    }

    function addColours() {
        for (let i = 0; i < squares.length; i++) {
            const val = parseInt(squares[i].innerHTML)
            squares[i].style.backgroundColor = {
                0: "#afa192",
                2: "#eee4da",
                4: "#ede0c8",
                8: "#f2b179",
                16: "#ffcea4",
                32: "#e8c064",
                64: "#ffab6e",
                128: "#fd9982",
                256: "#ead79c",
                512: "#76daff",
                1024: "#beeaa5",
                2048: "#d7d4f0"
            }[val] || "#afa192"
        }
    }
    let myTimer = setInterval(addColours, 50)

    // Swipe gesture support
    let touchStartX = 0
    let touchStartY = 0
    let touchEndX = 0
    let touchEndY = 0

    document.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX
        touchStartY = e.changedTouches[0].screenY
    }, false)

    document.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX
        touchEndY = e.changedTouches[0].screenY
        handleGesture()
    }, false)

    function handleGesture() {
        const diffX = touchEndX - touchStartX
        const diffY = touchEndY - touchStartY
        const absX = Math.abs(diffX)
        const absY = Math.abs(diffY)

        if (Math.max(absX, absY) < 30) return

        if (absX > absY) {
            if (diffX > 0) keyRight()
            else keyLeft()
        } else {
            if (diffY > 0) keyDown()
            else keyUp()
        }
    }
})
