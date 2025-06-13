const canvas = document.getElementById('game')
const ctx = canvas.getContext('2d')
const scoreEl = document.getElementById('score')

const player = { x: 140, y: 360, w: 20, h: 20, speed: 15 }
const blocks = []
let score = 0
let frame = 0

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') player.x -= player.speed
  if (e.key === 'ArrowRight') player.x += player.speed
})

function addBlock() {
  const x = Math.floor(Math.random() * (canvas.width - 20))
  blocks.push({ x, y: 0, w: 20, h: 20, speed: 2 + Math.random() * 3 })
}

function update() {
  frame++

  if (frame % 15 === 0) addBlock()

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  ctx.fillStyle = 'cyan'
  ctx.fillRect(player.x, player.y, player.w, player.h)

  ctx.fillStyle = 'red'
  for (let i = blocks.length - 1; i >= 0; i--) {
    const b = blocks[i]
    b.y += b.speed
    ctx.fillRect(b.x, b.y, b.w, b.h)

    if (
      b.x < player.x + player.w &&
      b.x + b.w > player.x &&
      b.y < player.y + player.h &&
      b.y + b.h > player.y
    ) {
      alert(`Game Over! Score: ${score}`)
      document.location.reload()
      return
    }

    if (b.y > canvas.height) {
      blocks.splice(i, 1)
      score++
      scoreEl.textContent = `Score: ${score}`
    }
  }

  requestAnimationFrame(update)
}

update()