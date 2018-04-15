
let h = 0

for (const arrow of document.getElementsByClassName('arrow')) {
  const targetId = arrow.href.substring(arrow.href.indexOf('#') + 1)
  const target   = document.getElementById(targetId)

  arrow.onclick = () => {
    smoothScrollTo(target.offsetTop, 10)
    return false
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
