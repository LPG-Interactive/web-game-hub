const container = document.getElementById('game-container')
const scoreEl = document.getElementById('score')
const messageEl = document.getElementById('message')

const size = 4
let board = []
let score = 0

function initBoard() {
  board = []
  for (let i = 0; i < size; i++) {
    board[i] = []
    for (let j = 0; j < size; j++) {
      board[i][j] = 0
    }
  }
  addRandomTile()
  addRandomTile()
  score = 0
  scoreEl.textContent = `Score: ${score}`
  messageEl.textContent = ''
  render()
}

function addRandomTile() {
  let empty = []
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (board[i][j] === 0) empty.push({x: i, y: j})
    }
  }
  if (empty.length === 0) return
  let spot = empty[Math.floor(Math.random() * empty.length)]
  board[spot.x][spot.y] = Math.random() < 0.9 ? 2 : 4
}

function render() {
  container.innerHTML = ''
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      let val = board[i][j]
      let tile = document.createElement('div')
      tile.className = 'tile'
      if (val !== 0) tile.classList.add(`tile-${val}`)
      tile.textContent = val === 0 ? '' : val
      container.appendChild(tile)
    }
  }
}

function slide(row) {
  let arr = row.filter(v => v !== 0)
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i+1]) {
      arr[i] *= 2
      score += arr[i]
      arr[i+1] = 0
    }
  }
  arr = arr.filter(v => v !== 0)
  while (arr.length < size) arr.push(0)
  return arr
}

function rotateLeft(matrix) {
  let result = []
  for (let i = 0; i < size; i++) {
    result[i] = []
    for (let j = 0; j < size; j++) {
      result[i][j] = matrix[j][size - 1 - i]
    }
  }
  return result
}

function moveLeft() {
  let changed = false
  for (let i = 0; i < size; i++) {
    let original = board[i].slice()
    let newRow = slide(board[i])
    board[i] = newRow
    if (!changed && newRow.some((v, idx) => v !== original[idx])) changed = true
  }
  return changed
}

function moveRight() {
  board = board.map(row => row.reverse())
  let changed = moveLeft()
  board = board.map(row => row.reverse())
  return changed
}

function moveUp() {
  board = rotateLeft(board)
  let changed = moveLeft()
  board = rotateLeft(rotateLeft(rotateLeft(board)))
  return changed
}

function moveDown() {
  board = rotateLeft(board)
  let changed = moveRight()
  board = rotateLeft(rotateLeft(rotateLeft(board)))
  return changed
}

function canMove() {
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (board[i][j] === 0) return true
      if (j < size - 1 && board[i][j] === board[i][j+1]) return true
      if (i < size - 1 && board[i][j] === board[i+1][j]) return true
    }
  }
  return false
}

function checkWin() {
  for (let row of board) {
    if (row.includes(2048)) return true
  }
  return false
}

window.addEventListener('keydown', e => {
  let moved = false
  switch (e.key) {
    case 'ArrowLeft': moved = moveLeft(); break
    case 'ArrowRight': moved = moveRight(); break
    case 'ArrowUp': moved = moveUp(); break
    case 'ArrowDown': moved = moveDown(); break
  }
  if (moved) {
    addRandomTile()
    scoreEl.textContent = `Score: ${score}`
    render()
    if (checkWin()) {
      messageEl.textContent = 'You win!'
    } else if (!canMove()) {
      messageEl.textContent = 'Game over!'
    }
  }
})

initBoard()
