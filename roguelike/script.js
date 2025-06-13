const WIDTH = 20
const HEIGHT = 10
const EMPTY = '.'
const PLAYER = '@'
const ENEMY = 'E'

let map = []
let player = { x: 1, y: 1, hp: 10 }
let enemy = { x: 15, y: 5, hp: 5 }

const mapEl = document.getElementById('map')
const statsEl = document.getElementById('stats')

function genMap() {
  map = []
  for (let y = 0; y < HEIGHT; y++) {
    let row = []
    for (let x = 0; x < WIDTH; x++) {
      row.push(EMPTY)
    }
    map.push(row)
  }
}

function drawMap() {
  genMap()
  map[player.y][player.x] = PLAYER
  if (enemy.hp > 0) map[enemy.y][enemy.x] = ENEMY

  mapEl.textContent = map.map(row => row.join('')).join('\n')
  statsEl.textContent = `HP: ${player.hp} | Enemy HP: ${enemy.hp}`
}

function move(dx, dy) {
  const newX = player.x + dx
  const newY = player.y + dy
  if (newX === enemy.x && newY === enemy.y && enemy.hp > 0) {
    enemy.hp -= 1
    if (enemy.hp <= 0) {
      alert('Enemy defeated!')
    }
  } else if (newX >= 0 && newX < WIDTH && newY >= 0 && newY < HEIGHT) {
    player.x = newX
    player.y = newY
  }
  drawMap()
}

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowUp') move(0, -1)
  if (e.key === 'ArrowDown') move(0, 1)
  if (e.key === 'ArrowLeft') move(-1, 0)
  if (e.key === 'ArrowRight') move(1, 0)
})

drawMap()
