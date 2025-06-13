const canvas = document.getElementById('game')
const ctx = canvas.getContext('2d')
const scoreEl = document.getElementById('score')

const COLS = 10
const ROWS = 20
const BLOCK_SIZE = 20

canvas.width = COLS * BLOCK_SIZE
canvas.height = ROWS * BLOCK_SIZE

const colors = [
  null,
  '#00f0f0', // I
  '#0000f0', // J
  '#f0a000', // L
  '#f0f000', // O
  '#00f000', // S
  '#a000f0', // T
  '#f00000'  // Z
]

const SHAPES = [
  [],
  [[1,1,1,1]], // I
  [[2,0,0],[2,2,2]], // J
  [[0,0,3],[3,3,3]], // L
  [[4,4],[4,4]], // O
  [[0,5,5],[5,5,0]], // S
  [[0,6,0],[6,6,6]], // T
  [[7,7,0],[0,7,7]] // Z
]

let board = Array.from({length: ROWS}, () => Array(COLS).fill(0))

let score = 0

function drawBlock(x, y, color) {
  ctx.fillStyle = color
  ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)
  ctx.strokeStyle = '#111'
  ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)
}

function drawBoard() {
  for (let y=0; y<ROWS; y++) {
    for (let x=0; x<COLS; x++) {
      const color = colors[board[y][x]]
      if (color) drawBlock(x, y, color)
      else {
        ctx.fillStyle = '#111'
        ctx.fillRect(x*BLOCK_SIZE, y*BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)
      }
    }
  }
}

function rotate(matrix) {
  return matrix[0].map((_, i) => matrix.map(row => row[i]).reverse())
}

function collide(board, piece, pos) {
  for (let y=0; y<piece.length; y++) {
    for (let x=0; x<piece[y].length; x++) {
      if (piece[y][x] !== 0) {
        let bx = pos.x + x
        let by = pos.y + y
        if (bx < 0 || bx >= COLS || by >= ROWS) return true
        if (by >= 0 && board[by][bx] !== 0) return true
      }
    }
  }
  return false
}

function merge(board, piece, pos) {
  for (let y=0; y<piece.length; y++) {
    for (let x=0; x<piece[y].length; x++) {
      if (piece[y][x] !== 0) {
        board[pos.y + y][pos.x + x] = piece[y][x]
      }
    }
  }
}

function clearLines() {
  let lines = 0
  outer: for (let y=ROWS-1; y>=0; y--) {
    for (let x=0; x<COLS; x++) {
      if (board[y][x] === 0) continue outer
    }
    board.splice(y, 1)
    board.unshift(Array(COLS).fill(0))
    lines++
    y++
  }
  if (lines > 0) {
    score += lines * 100
    scoreEl.textContent = `Score: ${score}`
  }
}

function newPiece() {
  const typeId = Math.floor(Math.random() * (SHAPES.length - 1)) + 1
  return {
    shape: SHAPES[typeId].map(row => [...row]),
    x: Math.floor(COLS/2) - 1,
    y: -1,
    typeId,
  }
}

let currentPiece = newPiece()

function drawPiece(piece) {
  for (let y=0; y<piece.shape.length; y++) {
    for (let x=0; x<piece.shape[y].length; x++) {
      if (piece.shape[y][x] !== 0) {
        drawBlock(piece.x + x, piece.y + y, colors[piece.shape[y][x]])
      }
    }
  }
}

function movePiece(dir) {
  const newPos = { x: currentPiece.x + dir, y: currentPiece.y }
  if (!collide(board, currentPiece.shape, newPos)) {
    currentPiece.x = newPos.x
  }
}

const INITIAL_DROP_INTERVAL = 800
const MIN_DROP_INTERVAL = 80
const DROP_DECREASE = 40

let dropInterval = INITIAL_DROP_INTERVAL
let lastDrop = 0

function dropPiece() {
  const newPos = { x: currentPiece.x, y: currentPiece.y + 1 }
  if (!collide(board, currentPiece.shape, newPos)) {
    currentPiece.y++
  } else {
    if (currentPiece.y < 0) {
      setTimeout(() => {
        alert(`Game Over\nFinal Score: ${score}`)
        board = Array.from({length: ROWS}, () => Array(COLS).fill(0))
        score = 0
        scoreEl.textContent = `Score: ${score}`
        dropInterval = INITIAL_DROP_INTERVAL
        currentPiece = newPiece()
      }, 50)
    } else {
      merge(board, currentPiece.shape, currentPiece)
      clearLines()
      dropInterval = Math.max(MIN_DROP_INTERVAL, dropInterval - DROP_DECREASE)
      currentPiece = newPiece()
    }
  }
}

function rotatePiece() {
  const rotated = rotate(currentPiece.shape)
  if (!collide(board, rotated, { x: currentPiece.x, y: currentPiece.y })) {
    currentPiece.shape = rotated
  }
}

document.addEventListener('keydown', e => {
  switch (e.key) {
    case 'ArrowLeft': movePiece(-1); break
    case 'ArrowRight': movePiece(1); break
    case 'ArrowDown': dropPiece(); break
    case 'ArrowUp': rotatePiece(); break
    case ' ': while (!collide(board, currentPiece.shape, { x: currentPiece.x, y: currentPiece.y + 1 })) { currentPiece.y++ } dropPiece(); break
  }
  draw()
})

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawBoard()
  drawPiece(currentPiece)
}

function loop(time = 0) {
  if (time - lastDrop > dropInterval) {
    dropPiece()
    lastDrop = time
  }
  draw()
  requestAnimationFrame(loop)
}

loop()