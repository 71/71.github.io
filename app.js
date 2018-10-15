(function() {
  var h = 0

  var loop = function () {
    var arrow = list[i];

    var targetId = arrow.href.substring(arrow.href.indexOf('#') + 1)
    var target   = document.getElementById(targetId)

    arrow.onclick = function () {
      smoothScrollTo(target.offsetTop, 10)
      return false
    }
  };

  for (var i = 0, list = document.getElementsByClassName('arrow'); i < list.length; i += 1) loop();

  // Utils
  function smoothScrollTo(scrollTarget, speed) {
    if (typeof scrollTarget !== 'number')
      scrollTarget = 0
    if (typeof speed !== 'number')
      speed = 2000

    var currentScroll = window.scrollY
    var currentTime   = 0
    var time          = Math.max(.1, Math.min(Math.abs(currentScroll - scrollTarget) / speed, .8))

    var ease = function (p) { return ((p /= .5) < 1) ? .5 * Math.pow(p, 5) : .5 * (Math.pow((p - 2), 5) + 2); }
    var tick = function ( ) {
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

  function findCurrentPart() {
    for (var i = parts.length - 1; i >= 0; i--) {
      var part = parts[i]
      
      if (part.getBoundingClientRect().top <= 0)
        return part
    }
  }

  function updateScrollbar() {
    if (ticking) return
    
    window.requestAnimationFrame(function () {
      thumb.style.top = (content.scrollTop / content.scrollHeight) * 100 + '%'
      sections.textContent = findCurrentPart().getAttribute('data-title')

      ticking = false
    })

    ticking = true
  }

  content.addEventListener('scroll', function (e) { return updateScrollbar(); })

  updateScrollbar()
})()
