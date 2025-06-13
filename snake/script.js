const canvas = document.getElementById('game')
const ctx = canvas.getContext('2d')
const scoreEl = document.getElementById('score')

const gridSize = 20
const tileCount = canvas.width / gridSize

let snake, direction, nextDirection, food, score, gameOver, intervalId

function resetGame() {
  snake = [{ x: 8, y: 8 }]
  direction = { x: 1, y: 0 }
  nextDirection = { x: 1, y: 0 }
  score = 0
  gameOver = false
  placeFood()
  scoreEl.textContent = `Score: ${score}`
  if (intervalId) clearInterval(intervalId)
  intervalId = setInterval(gameLoop, 120)
}

function placeFood() {
  while (true) {
    food = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount)
    }
    if (!snake.some(seg => seg.x === food.x && seg.y === food.y)) break
  }
}

function drawCell(x, y, color) {
  ctx.fillStyle = color
  ctx.fillRect(x * gridSize, y * gridSize, gridSize - 2, gridSize - 2)
}

function gameLoop() {
  direction = nextDirection

  const head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y
  }

  if (
    head.x < 0 || head.x >= tileCount ||
    head.y < 0 || head.y >= tileCount ||
    snake.some(seg => seg.x === head.x && seg.y === head.y)
  ) {
    gameOver = true
    clearInterval(intervalId)
    ctx.fillStyle = 'rgba(0,0,0,0.7)'
    ctx.fillRect(0, canvas.height / 2 - 30, canvas.width, 60)
    ctx.fillStyle = '#fff'
    ctx.font = '24px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('Game Over - Press R', canvas.width / 2, canvas.height / 2 + 8)
    return
  }

  snake.unshift(head)

  if (head.x === food.x && head.y === food.y) {
    score++
    scoreEl.textContent = `Score: ${score}`
    placeFood()
  } else {
    snake.pop()
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawCell(food.x, food.y, 'red')
  snake.forEach((seg, i) => drawCell(seg.x, seg.y, i === 0 ? 'lime' : 'green'))
}

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowUp' && direction.y !== 1) nextDirection = { x: 0, y: -1 }
  if (e.key === 'ArrowDown' && direction.y !== -1) nextDirection = { x: 0, y: 1 }
  if (e.key === 'ArrowLeft' && direction.x !== 1) nextDirection = { x: -1, y: 0 }
  if (e.key === 'ArrowRight' && direction.x !== -1) nextDirection = { x: 1, y: 0 }
  if (gameOver && (e.key === 'r' || e.key === 'R')) resetGame()
})

resetGame()