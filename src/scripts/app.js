(function() {
  'use strict'


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

    const currentScroll = content.scrollTop
    const time          = Math.max(.1, Math.min(Math.abs(currentScroll - scrollTarget) / speed, .8))

    let currentTime     = 0

    let ease = (p) => ((p /= .5) < 1) ? .5 * Math.pow(p, 5) : .5 * (Math.pow((p - 2), 5) + 2)
    let tick = ( ) => {
      currentTime += 1 / 60
      p = currentTime / time
      t = ease(p)

      if (p < 1) {
        requestAnimationFrame(tick)
        content.scrollTo(0, currentScroll + ((scrollTarget - currentScroll) * t))
      } else {
        content.scrollTo(0, scrollTarget)
      }
    }

    tick()
  }


  // Scrollbar

  const content  = document.querySelector('.content')

  const track    = document.querySelector('.scrollbar .track')
  const thumb    = document.querySelector('.scrollbar .thumb')
  const sections = document.querySelector('.scrollbar .sections')

  function updateScrollbarStyle() {
    const scrollbarWidth = content.offsetWidth - content.clientWidth

    content.style.overflow = 'auto'
    content.style.right = `-${scrollbarWidth}px`

    thumb.style.height = (content.clientHeight / content.scrollHeight) * 100 + '%'
  }

  updateScrollbarStyle()

  window.addEventListener('resize', () => updateScrollbarStyle())

  // Find sections

  const parts = document.querySelectorAll('[data-title]')

  let ticking = false
  let title   = ''
  let transition = null

  function findCurrentPart() {
    for (let i = parts.length - 1; i >= 0; i--) {
      const part = parts[i]
      
      if (part.getBoundingClientRect().top <= 0)
        return part
    }
  }

  function updateScrollbar() {
    if (ticking) return
    
    window.requestAnimationFrame(() => {
      const newTitle = findCurrentPart().getAttribute('data-title')

      thumb.style.top = (content.scrollTop / content.scrollHeight) * 100 + '%'

      if (title != newTitle) {
        if (transition) clearTimeout(transition)

        sections.innerHTML = `<span class="first">${title}</span><span>${newTitle}</span>`
        sections.classList.add('transitioning')

        title = newTitle

        transition = setTimeout(() => {
          sections.classList.remove('transitioning')
          sections.innerHTML = `<span class="first">${newTitle}</span><span></span>`
        }, 300)
      }

      ticking = false
    })

    ticking = true
  }

  content.addEventListener('scroll', e => updateScrollbar())

  updateScrollbar()

})()
