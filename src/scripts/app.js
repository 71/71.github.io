(function() {
  'use strict'

  for (const arrow of document.querySelectorAll('.arrow, a.smooth-scroll')) {
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

      const p = currentTime / time
      const t = ease(p)

      if (p < 1) {
        requestAnimationFrame(tick)
        content.scrollTo(0, currentScroll + ((scrollTarget - currentScroll) * t))
      } else {
        content.scrollTo(0, scrollTarget)
      }
    }

    tick()
  }


  // Dark / light theme

  function toggleTheme() {
    document.body.classList.toggle('dark')

    localStorage.setItem('dark', document.body.classList.contains('dark'))
  }

  const isDarkThemeAtLoad = localStorage.getItem('dark')

  if (isDarkThemeAtLoad == 'true') {
    document.body.classList.add('dark')
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
  let scrollbarRatio = 0

  function findCurrentPart() {
    for (let i = parts.length - 1; i >= 0; i--) {
      const part = parts[i]
      
      if (part.getBoundingClientRect().top <= 200)
        return part
    }
  }

  function updateScrollbar() {
    if (ticking) return
    
    window.requestAnimationFrame(() => {
      const newPart = findCurrentPart()
      const newTitle = newPart.getAttribute('data-title')

      for (const element of document.getElementsByClassName('focused')) {
        element.classList.remove('focused')
      }

      newPart.classList.add('focused')


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

    scrollbarRatio = (track.clientHeight / thumb.clientHeight) * (window.innerHeight / track.clientHeight)
    ticking = true
  }

  let scrollStart      = 0
  let scrollThumbStart = 0

  content.addEventListener('scroll', _ => updateScrollbar())

  function updateScollPosition(e) {
    content.scrollTo(0, scrollStart + (e.clientY - scrollThumbStart) * scrollbarRatio)
  }

  thumb.addEventListener('mousedown', e => {
    scrollStart = content.scrollTop
    scrollThumbStart = e.clientY

    content.style.pointerEvents = 'none'
    window.addEventListener('mousemove', updateScollPosition)
  })

  window.addEventListener('mouseup', _ => {
    content.style.pointerEvents = 'initial'
    window.removeEventListener('mousemove', updateScollPosition)
  })

  window.addEventListener('mousedown', e => {
    if (e.shiftKey)
      toggleTheme()
  })

  updateScrollbar()

})()
