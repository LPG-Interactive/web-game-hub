const canvas = document.getElementById('game')
const ctx = canvas.getContext('2d')
const scoreEl = document.getElementById('score')
const speedEl = document.getElementById('speed')

const WIDTH = canvas.width
const HEIGHT = canvas.height

const paddleWidth = 10
const paddleHeight = 80
const ballSize = 12

let player = { x: 0, y: HEIGHT / 2 - paddleHeight / 2, score: 0 }
let computer = { x: WIDTH - paddleWidth, y: HEIGHT / 2 - paddleHeight / 2, score: 0 }
let ball = {
  x: WIDTH / 2,
  y: HEIGHT / 2,
  vx: 2 * (Math.random() > 0.5 ? 1 : -1),
  vy: 1.5 * (Math.random() > 0.5 ? 1 : -1),
  speed: 5,
  speedIncrement: 0.4,
  maxSpeed: 50
}

let lastTime = performance.now()

function resetBall() {
  ball.x = WIDTH / 2
  ball.y = HEIGHT / 2
  ball.speed = 5
  let angle = (Math.random() * Math.PI / 2) - Math.PI / 4
  let dir = Math.random() > 0.5 ? 1 : -1
  ball.vx = Math.cos(angle) * ball.speed * dir
  ball.vy = Math.sin(angle) * ball.speed
}

function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color
  ctx.fillRect(x, y, w, h)
}

function drawCircle(x, y, r, color) {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.fill()
}

document.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect()
  let mouseY = e.clientY - rect.top
  player.y = mouseY - paddleHeight / 2
  if (player.y < 0) player.y = 0
  if (player.y + paddleHeight > HEIGHT) player.y = HEIGHT - paddleHeight
})

function update(currentTime) {
  let dt = (currentTime - lastTime) / 1000
  lastTime = currentTime

  if (ball.speed < ball.maxSpeed) {
    ball.speed += ball.speedIncrement * dt
    let norm = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy)
    ball.vx = (ball.vx / norm) * ball.speed
    ball.vy = (ball.vy / norm) * ball.speed
  }

  ball.x += ball.vx
  ball.y += ball.vy

  if (ball.y < 0 || ball.y > HEIGHT - ballSize) {
    ball.vy = -ball.vy
    ball.y = Math.max(0, Math.min(ball.y, HEIGHT - ballSize))
  }

  if (
    ball.x < player.x + paddleWidth &&
    ball.y + ballSize > player.y &&
    ball.y < player.y + paddleHeight
  ) {

    let relativeIntersectY = (player.y + paddleHeight / 2) - (ball.y + ballSize / 2)
    let normalized = relativeIntersectY / (paddleHeight / 2)
    let bounceAngle = normalized * (Math.PI / 3)

    let direction = 1

    let randomAngle = (Math.random() - 0.5) * (Math.PI / 4)
    let finalAngle = bounceAngle + randomAngle

    let randomSpeedFactor = 1 + (Math.random() - 0.5) * 0.3

    ball.vx = Math.cos(finalAngle) * ball.speed * direction * randomSpeedFactor
    ball.vy = -Math.sin(finalAngle) * ball.speed * randomSpeedFactor

    ball.vy += (Math.random() - 0.5) * 2

    ball.x = player.x + paddleWidth
  }

  if (
    ball.x + ballSize > computer.x &&
    ball.y + ballSize > computer.y &&
    ball.y < computer.y + paddleHeight
  ) {
    let relativeIntersectY = (computer.y + paddleHeight / 2) - (ball.y + ballSize / 2)
    let normalized = relativeIntersectY / (paddleHeight / 2)
    let bounceAngle = normalized * (Math.PI / 3)

    let direction = -1

    let randomAngle = (Math.random() - 0.5) * (Math.PI / 4)
    let finalAngle = bounceAngle + randomAngle

    let randomSpeedFactor = 1 + (Math.random() - 0.5) * 0.3

    ball.vx = Math.cos(finalAngle) * ball.speed * direction * randomSpeedFactor
    ball.vy = -Math.sin(finalAngle) * ball.speed * randomSpeedFactor

    ball.vy += (Math.random() - 0.5) * 2

    ball.x = computer.x - ballSize
  }

  if (ball.x < 0) {
    computer.score++
    resetBall()
  } else if (ball.x > WIDTH) {
    player.score++
    resetBall()
  }

  if (computer.y + paddleHeight / 2 < ball.y) {
    computer.y += 4
  } else {
    computer.y -= 4
  }
  if (computer.y < 0) computer.y = 0
  if (computer.y + paddleHeight > HEIGHT) computer.y = HEIGHT - paddleHeight

  ctx.clearRect(0, 0, WIDTH, HEIGHT)
  drawRect(player.x, player.y, paddleWidth, paddleHeight, 'white')
  drawRect(computer.x, computer.y, paddleWidth, paddleHeight, 'white')
  drawCircle(ball.x, ball.y, ballSize / 2, 'white')

  scoreEl.textContent = `You: ${player.score} | Bot: ${computer.score} | Ball Speed: ${ball.speed.toFixed(2)}`

  requestAnimationFrame(update)
}

resetBall()
requestAnimationFrame(update)