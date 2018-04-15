
const greeting = document.getElementById('greeting')
const now  = new Date(Date.now())
const hour = now.getHours()

if (hour > 16)
  greeting.innerText = 'Good evening'
else if (hour > 11)
  greeting.innerText = 'Good afternoon'
else if (hour > 4)
  greeting.innerText = 'Good morning'
else
  greeting.innerText = 'Good night'

function ready() {
  document.getElementById('arrow').onclick = () => smoothScrollTo(window.innerHeight, 10)
}

if (document.readyState === 'complete') {
  ready()
} else {
  document.onreadystatechange = () => {
    if (document.readyState === 'complete')
      ready()
  }
}

// Utils
function smoothScrollTo(scrollTarget, speed) {
  if (typeof scrollTarget !== 'number')
    scrollTarget = 0
  if (typeof speed !== 'number')
    speed = 2000

  let currentScroll = window.scrollY
  let currentTime   = 0
  let time          = Math.max(.1, Math.min(Math.abs(currentScroll - scrollTarget) / speed, .8))

  let ease = (p) => ((p /= .5) < 1) ? .5 * Math.pow(p, 5) : .5 * (Math.pow((p - 2), 5) + 2)
  let tick = ( ) => {
    currentTime += 1 / 60
    p = currentTime / time
    t = ease(p)

    if (p < 1) {
      requestAnimationFrame(tick)
      window.scrollTo(0, currentScroll + ((scrollTarget - currentScroll) * t))
    } else {
      window.scrollTo(0, scrollTarget)
    }
  }

  tick()
}
