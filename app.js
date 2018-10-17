(function() {
  'use strict'

  var loop = function () {
    var arrow = list[i];

    var targetId = arrow.href.substring(arrow.href.indexOf('#') + 1)
    var target   = document.getElementById(targetId)

    arrow.onclick = function () {
      smoothScrollTo(target.offsetTop, 10)
      return false
    }
  };

  for (var i = 0, list = document.querySelectorAll('.arrow, a.smooth-scroll'); i < list.length; i += 1) loop();

  // Utils

  function smoothScrollTo(scrollTarget, speed) {
    if (typeof scrollTarget !== 'number')
      scrollTarget = 0
    if (typeof speed !== 'number')
      speed = 2000

    var currentScroll = content.scrollTop
    var time          = Math.max(.1, Math.min(Math.abs(currentScroll - scrollTarget) / speed, .8))

    var currentTime     = 0

    var ease = function (p) { return ((p /= .5) < 1) ? .5 * Math.pow(p, 5) : .5 * (Math.pow((p - 2), 5) + 2); }
    var tick = function ( ) {
      currentTime += 1 / 60

      var p = currentTime / time
      var t = ease(p)

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

  var isDarkThemeAtLoad = localStorage.getItem('dark')

  if (isDarkThemeAtLoad == 'true') {
    document.body.classList.add('dark')
  }


  // Scrollbar

  var content  = document.querySelector('.content')

  var track    = document.querySelector('.scrollbar .track')
  var thumb    = document.querySelector('.scrollbar .thumb')
  var sections = document.querySelector('.scrollbar .sections')

  function updateScrollbarStyle() {
    var scrollbarWidth = content.offsetWidth - content.clientWidth

    content.style.overflow = 'auto'
    content.style.right = "-" + scrollbarWidth + "px"

    thumb.style.height = (content.clientHeight / content.scrollHeight) * 100 + '%'
  }

  updateScrollbarStyle()

  window.addEventListener('resize', function () { return updateScrollbarStyle(); })

  // Find sections

  var parts = document.querySelectorAll('[data-title]')

  var ticking = false
  var title   = ''
  var transition = null
  var scrollbarRatio = 0

  function findCurrentPart() {
    for (var i = parts.length - 1; i >= 0; i--) {
      var part = parts[i]
      
      if (part.getBoundingClientRect().top <= 200)
        return part
    }
  }

  function updateScrollbar() {
    if (ticking) return
    
    window.requestAnimationFrame(function () {
      var newPart = findCurrentPart()
      var newTitle = newPart.getAttribute('data-title')

      for (var i = 0, list = document.getElementsByClassName('focused'); i < list.length; i += 1) {
        var element = list[i];

        element.classList.remove('focused')
      }

      newPart.classList.add('focused')


      thumb.style.top = (content.scrollTop / content.scrollHeight) * 100 + '%'

      if (title != newTitle) {
        if (transition) clearTimeout(transition)

        sections.innerHTML = "<span class=\"first\">" + title + "</span><span>" + newTitle + "</span>"
        sections.classList.add('transitioning')

        title = newTitle

        transition = setTimeout(function () {
          sections.classList.remove('transitioning')
          sections.innerHTML = "<span class=\"first\">" + newTitle + "</span><span></span>"
        }, 300)
      }

      ticking = false
    })

    scrollbarRatio = (track.clientHeight / thumb.clientHeight) * (window.innerHeight / track.clientHeight)
    ticking = true
  }

  var scrollStart      = 0
  var scrollThumbStart = 0

  content.addEventListener('scroll', function (_) { return updateScrollbar(); })

  function updateScollPosition(e) {
    content.scrollTo(0, scrollStart + (e.clientY - scrollThumbStart) * scrollbarRatio)
  }

  thumb.addEventListener('mousedown', function (e) {
    scrollStart = content.scrollTop
    scrollThumbStart = e.clientY

    content.style.pointerEvents = 'none'
    window.addEventListener('mousemove', updateScollPosition)
  })

  window.addEventListener('mouseup', function (_) {
    content.style.pointerEvents = 'initial'
    window.removeEventListener('mousemove', updateScollPosition)
  })

  window.addEventListener('mousedown', function (e) {
    if (e.shiftKey)
      toggleTheme()
  })

  updateScrollbar()

})()
