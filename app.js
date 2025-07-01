document.addEventListener("DOMContentLoaded", () => {
    const imageMap = {
        2: 'images/char_2.png',
        4: 'images/char_4.png',
        8: 'images/char_8.png',
        16: 'images/char_16.png',
        32: 'images/char_32.png',
        64: 'images/char_64.png',
        128: 'images/char_128.png',
        256: 'images/char_256.png',
        512: 'images/char_512.png',
        1024: 'images/char_1024.png',
        2048: 'images/char_2048.png',
        4096: 'images/char_4096.png'
    }
    
    const gridDisplay = document.querySelector(".grid")
    const scoreDisplay = document.querySelector("#score")
    const resultDisplay = document.querySelector("#result")
    const width = 4
    let squares = []
    let score = 0

    function createBoard() {
        for (let i = 0; i < width * width; i++) {
            const square = document.createElement("div")
            square.dataset.value = 0
            gridDisplay.appendChild(square)
            squares.push(square)
        }
        generate()
        generate()
    }
    createBoard()

    function generate() {
        const randomNumber = Math.floor(Math.random() * squares.length)
        if (squares[randomNumber].dataset.value == 0) {
            squares[randomNumber].dataset.value = 2
            renderTileVisuals()
            checkForGameOver()
        } else generate()
    }

    function moveRight() {
        for (let i = 0; i < 16; i++) {
            if (i % 4 === 0) {
                let row = [0, 1, 2, 3].map(j => parseInt(squares[i + j].dataset.value || "0"))
                let filteredRow = row.filter(num => num)
                let newRow = Array(4 - filteredRow.length).fill(0).concat(filteredRow)
                newRow.forEach((val, j) => squares[i + j].dataset.value = newRow[j])
            }
        }
    }

    function moveLeft() {
        for (let i = 0; i < 16; i++) {
            if (i % 4 === 0) {
                let row = [0, 1, 2, 3].map(j => parseInt(squares[i + j].dataset.value || "0"))
                let filteredRow = row.filter(num => num)
                let newRow = filteredRow.concat(Array(4 - filteredRow.length).fill(0))
                newRow.forEach((val, j) => squares[i + j].dataset.value = newRow[j])
            }
        }
    }

    function moveUp() {
        for (let i = 0; i < 4; i++) {
            let column = [0, 1, 2, 3].map(j => parseInt(squares[i + width * j].dataset.value || "0"))
            let filteredColumn = column.filter(num => num)
            let newColumn = filteredColumn.concat(Array(4 - filteredColumn.length).fill(0))
            newColumn.forEach((val, j) => squares[i + width * j].dataset.value = newColumn[j])
        }
    }

    function moveDown() {
        for (let i = 0; i < 4; i++) {
            let column = [0, 1, 2, 3].map(j => parseInt(squares[i + width * j].dataset.value || "0"))
            let filteredColumn = column.filter(num => num)
            let newColumn = Array(4 - filteredColumn.length).fill(0).concat(filteredColumn)
            newColumn.forEach((val, j) => squares[i + width * j].dataset.value = newColumn[j])
        }
    }

    function combineRow() {
        for (let i = 0; i < 15; i++) {
            if (squares[i].dataset.value === squares[i + 1].dataset.value) {
                let combinedTotal = parseInt(squares[i].dataset.value || "0") + parseInt(squares[i + 1].dataset.value || "0")
                squares[i].dataset.value = combinedTotal
                squares[i + 1].dataset.value = 0
                score += combinedTotal
                scoreDisplay.innerHTML = score
            }
        }
        checkForWin()
    }

    function combineColumn() {
        for (let i = 0; i < 12; i++) {
            if (squares[i].dataset.value === squares[i + width].dataset.value) {
                let combinedTotal = parseInt(squares[i].dataset.value || "0") + parseInt(squares[i + width].dataset.value || "0")
                squares[i].dataset.value = combinedTotal
                squares[i + width].dataset.value = 0
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
        renderTileVisuals()
    }

    function keyRight() {
        moveRight()
        combineRow()
        moveRight()
        generate()
        renderTileVisuals()
    }

    function keyUp() {
        moveUp()
        combineColumn()
        moveUp()
        generate()
        renderTileVisuals()
    }

    function keyDown() {
        moveDown()
        combineColumn()
        moveDown()
        generate()
        renderTileVisuals()
    }

    function checkForWin() {
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].dataset.value == 4096) {
                resultDisplay.innerHTML = "You WIN!"
                document.removeEventListener("keydown", control)
                setTimeout(clear, 3000)
            }
        }
    }

    function checkForGameOver() {
        let zeros = squares.filter(square => square.dataset.value == 0).length
        if (zeros > 0) return
    
        for (let i = 0; i < width * width; i++) {
            let value = parseInt(squares[i].dataset.value)
            // check right
            if (i % width !== width - 1) {
                let right = parseInt(squares[i + 1].dataset.value)
                if (value === right) return
            }
            // check below
            if (i + width < width * width) {
                let below = parseInt(squares[i + width].dataset.value)
                if (value === below) return
            }
        }
    
        resultDisplay.innerHTML = "You LOSE!"
        document.removeEventListener("keydown", control)
        setTimeout(clear, 3000)
    }

    function clear() {
        clearInterval(myTimer)
    }

    function addColours() {
        for (let i = 0; i < squares.length; i++) {
            const val = parseInt(squares[i].dataset.value || "0")
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
    
    function renderTileVisuals() {
    squares.forEach(square => {
            const value = parseInt(square.dataset.value || "0")
            square.textContent = ""
            if (value && imageMap[value]) {
                const img = document.createElement("img")
                img.src = imageMap[value]
                img.alt = value
                img.className = "tile-img fade-in"
                img.onerror = () => { square.textContent = value }
                square.appendChild(img)
            } else {
                square.textContent = ""
            }
        })
    }

    document.addEventListener('touchmove', function(e) {
        // ป้องกัน swipe-down บนจอมือถือ (ที่ยังเหลือรอดบางเบราว์เซอร์)
        if (window.scrollY === 0 && touchStartY < touchEndY) {
            e.preventDefault()
        }
    }, { passive: false })

    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX
        touchStartY = e.changedTouches[0].screenY
    
        // ป้องกัน swipe-down (pull-to-refresh)
        if (window.scrollY === 0 && touchStartY < 50) {
            e.preventDefault()
        }
    }, { passive: false })
})
