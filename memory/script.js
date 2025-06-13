const symbols = ['🍎','🍌','🍇','🍒','🍍','🥝','🍉','🍓']
const deck = [...symbols, ...symbols]
deck.sort(() => Math.random() - 0.5)

const grid = document.getElementById('grid')
const movesEl = document.getElementById('moves')
let first = null
let second = null
let lock = false
let moves = 0
let matched = 0

function resetGame() {
  grid.innerHTML = ''
  moves = 0
  matched = 0
  movesEl.textContent = `Moves: 0`
  first = null
  second = null
  lock = false
  deck.sort(() => Math.random() - 0.5)
  deck.forEach(symbol => {
    const card = document.createElement('div')
    card.classList.add('card')
    card.dataset.symbol = symbol
    card.textContent = ''
    card.addEventListener('click', () => {
      if (lock || card.classList.contains('revealed') || card === first) return
      card.textContent = symbol
      card.classList.add('revealed')
      if (!first) {
        first = card
      } else {
        second = card
        lock = true
        moves++
        movesEl.textContent = `Moves: ${moves}`
        if (first.dataset.symbol === second.dataset.symbol) {
          matched += 2
          first = null
          second = null
          lock = false
          if (matched === deck.length) {
            setTimeout(() => {
              if (window.confirm(`Congratulations! You completed the game in ${moves} moves.\n\nPress OK to play again.`)) {
                resetGame()
              }
            }, 300)
          }
        } else {
          setTimeout(() => {
            first.textContent = ''
            second.textContent = ''
            first.classList.remove('revealed')
            second.classList.remove('revealed')
            first = null
            second = null
            lock = false
          }, 800)
        }
      }
    })
    grid.appendChild(card)
  })
}

resetGame()