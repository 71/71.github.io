
const greeting = document.getElementById('greeting')
const projects = document.getElementById('projects')

const hour = new Date(Date.now()).getHours()

if (hour > 16)
  greeting.innerText = 'Good evening'
else if (hour > 11)
  greeting.innerText = 'Good afternoon'
else if (hour > 4)
  greeting.innerText = 'Good morning'
else
  greeting.innerText = 'Good night'

function ready() {
  let h = 0

  for (const arrow of document.getElementsByClassName('arrow')) {
    const targetId = arrow.href.substring(arrow.href.indexOf('#') + 1)
    const target   = document.getElementById(targetId)

    arrow.onclick = () => {
      smoothScrollTo(target.offsetTop, 10)
      return false
    }
  }

  for (const project of document.getElementsByClassName('project')) {
    project.onpointerenter = () => {
      h++
      projects.style.backgroundColor = project.getAttribute('data-accent')
    }
    project.onpointerleave = () => {
      if (--h === 0)
        projects.style.backgroundColor = ''
    }
  }

  if (fetch) {
    const count = document.getElementById('projects-count')
    
    fetch("https://api.github.com/users/6A")
      .then(res => res.json())
      .then(res => count.innerText = 'over ' + res.public_repos)
  }
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
