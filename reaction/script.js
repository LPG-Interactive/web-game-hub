const screen = document.getElementById('screen')
const result = document.getElementById('result')

let state = 'idle'
let timeoutId = null
let goTimeoutId = null
let startTime = null

function reset(message) {
  state = 'idle'
  screen.className = ''
  screen.textContent = 'Click to start'
  result.textContent = message || ''
  clearTimeout(timeoutId)
  clearTimeout(goTimeoutId)
}

screen.addEventListener('click', () => {
  if (state === 'idle') {
    screen.textContent = 'Wait for green...'
    screen.classList.add('ready')
    state = 'waiting'
    const waitTime = 800 + Math.random() * 4200
    timeoutId = setTimeout(() => {
      screen.classList.remove('ready')
      screen.classList.add('go')
      screen.textContent = 'CLICK!'
      startTime = Date.now()
      state = 'go'
      const reactionWindow = 400 + Math.random() * 500
      goTimeoutId = setTimeout(() => {
        if (state === 'go') {
          reset('Too slow! Try again.')
        }
      }, reactionWindow)
    }, waitTime)
  } else if (state === 'waiting') {
    clearTimeout(timeoutId)
    reset('Too soon. Click to try again.')
  } else if (state === 'go') {
    clearTimeout(goTimeoutId)
    const reactionTime = Date.now() - startTime
    reset(`Your reaction time: ${reactionTime} ms`)
  }
})

reset()