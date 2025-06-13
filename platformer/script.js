const canvas = document.getElementById('game')
const ctx = canvas.getContext('2d')
const WIDTH = canvas.width
const HEIGHT = canvas.height

const gravity = 0.7
const friction = 0.8

const keys = {}

const platforms = [
  { x: 0, y: 280, w: 150, h: 15 },
  { x: 180, y: 220, w: 120, h: 15 },
  { x: 340, y: 160, w: 100, h: 15 },
  { x: 60, y: 100, w: 80, h: 15 },
  { x: 250, y: 60, w: 140, h: 15 }
]

class Player {
  constructor() {
    this.width = 30
    this.height = 50
    this.x = 50
    this.y = HEIGHT - this.height - 10
    this.velX = 0
    this.velY = 0
    this.speed = 3
    this.jumping = false
  }

  update() {
    if (keys['ArrowRight']) {
      if (this.velX < this.speed) this.velX++
    }
    if (keys['ArrowLeft']) {
      if (this.velX > -this.speed) this.velX--
    }
    if (keys['ArrowUp'] && !this.jumping) {
      this.velY = -10
      this.jumping = true
    }

    this.velX *= friction
    this.velY += gravity

    this.x += this.velX
    this.y += this.velY

    if (this.x < 0) this.x = 0
    if (this.x + this.width > WIDTH) this.x = WIDTH - this.width

    let onPlatform = false
    for (const p of platforms) {

      if (
        this.velY >= 0 &&
        this.y + this.height <= p.y + 5 &&
        this.y + this.height + this.velY >= p.y &&
        this.x + this.width > p.x &&
        this.x < p.x + p.w
      ) {
        this.y = p.y - this.height
        this.velY = 0
        this.jumping = false
        onPlatform = true
      }
    }

    if (this.y + this.height > HEIGHT - 10) {
      this.y = HEIGHT - this.height - 10
      this.jumping = false
      this.velY = 0
      onPlatform = true
    }

    if (!onPlatform) {
      this.jumping = true
    }
  }

  draw() {
    ctx.fillStyle = 'red'
    ctx.fillRect(this.x, this.y, this.width, this.height)
  }
}

function drawPlatforms() {
  ctx.fillStyle = '#888'
  for (const p of platforms) {
    ctx.fillRect(p.x, p.y, p.w, p.h)
  }
}

const player = new Player()

function clear() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT)
}

function gameLoop() {
  clear()
  drawPlatforms()
  player.update()
  player.draw()
  requestAnimationFrame(gameLoop)
}

document.addEventListener('keydown', e => {
  keys[e.key] = true
})

document.addEventListener('keyup', e => {
  keys[e.key] = false
})

gameLoop()