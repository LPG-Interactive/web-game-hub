const canvas = document.getElementById('game')
const ctx = canvas.getContext('2d')
const scoreEl = document.getElementById('score')

const WIDTH = canvas.width
const HEIGHT = canvas.height

const bird = {
  x: 50,
  y: HEIGHT / 2,
  width: 30,
  height: 25,
  gravity: 0.6,
  lift: -10,
  velocity: 0
}

const pipeWidth = 50
const pipeGap = 130
const pipeSpeed = 3

let pipes = []
let frame = 0
let score = 0
let gameOver = false

function reset() {
  bird.y = HEIGHT / 2
  bird.velocity = 0
  pipes = []
  score = 0
  gameOver = false
  scoreEl.textContent = `Score: ${score}`
}

function drawBird() {
  ctx.fillStyle = 'yellow'
  ctx.fillRect(bird.x, bird.y, bird.width, bird.height)
}

function drawPipe(pipe) {
  ctx.fillStyle = 'green'

  ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top)

  ctx.fillRect(pipe.x, pipe.top + pipeGap, pipeWidth, HEIGHT - pipe.top - pipeGap)
}

function updateBird() {
  bird.velocity += bird.gravity
  bird.y += bird.velocity
  if (bird.y + bird.height > HEIGHT) {
    bird.y = HEIGHT - bird.height
    gameOver = true
  }
  if (bird.y < 0) {
    bird.y = 0
    bird.velocity = 0
  }
}

function updatePipes() {
  if (frame % 90 === 0) {
    const top = Math.floor(Math.random() * (HEIGHT - pipeGap - 40)) + 20
    pipes.push({ x: WIDTH, top })
  }
  for (let i = pipes.length - 1; i >= 0; i--) {
    pipes[i].x -= pipeSpeed

    if (pipes[i].x + pipeWidth < 0) {
      pipes.splice(i, 1)
      score++
      scoreEl.textContent = `Score: ${score}`
    }
  }
}

function checkCollision() {
  for (const pipe of pipes) {
    if (
      bird.x < pipe.x + pipeWidth &&
      bird.x + bird.width > pipe.x &&
      (bird.y < pipe.top || bird.y + bird.height > pipe.top + pipeGap)
    ) {
      gameOver = true
      break
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT)
  drawBird()
  pipes.forEach(drawPipe)
}

function loop() {
  if (gameOver) {
    ctx.fillStyle = 'white'
    ctx.font = '24px monospace'
    ctx.fillText('Game Over - Press R', 20, HEIGHT / 2)
    requestAnimationFrame(loop)
    return
  }
  frame++
  updateBird()
  updatePipes()
  checkCollision()
  draw()
  requestAnimationFrame(loop)
}

window.addEventListener('keydown', e => {
  if (e.code === 'Space' || e.code === 'ArrowUp') {
    bird.velocity = bird.lift
  }
  if (gameOver && e.code === 'KeyR') {
    reset()
  }
})

reset()
loop()
