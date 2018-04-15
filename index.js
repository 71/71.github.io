
var greeting = document.getElementById('greeting')
var projects = document.getElementById('projects')

var hour = new Date(Date.now()).getHours()

if (hour > 16)
  greeting.innerText = 'Good evening'
else if (hour > 11)
  greeting.innerText = 'Good afternoon'
else if (hour > 4)
  greeting.innerText = 'Good morning'
else
  greeting.innerText = 'Good night'

function ready() {
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

  var loop$1 = function () {
    var project = list$1[i$1];

    project.onpointerenter = function () {
      h++
      projects.style.backgroundColor = project.getAttribute('data-accent')
    }
    project.onpointerleave = function () {
      if (--h === 0)
        projects.style.backgroundColor = ''
    }
  };

  for (var i$1 = 0, list$1 = document.getElementsByClassName('project'); i$1 < list$1.length; i$1 += 1) loop$1();

  if (fetch) {
    var count = document.getElementById('projects-count')
    
    fetch("https://api.github.com/users/6A")
      .then(function (res) { return res.json(); })
      .then(function (res) { return count.innerText = 'over ' + res.public_repos; })
  }
}

if (document.readyState === 'complete') {
  ready()
} else {
  document.onreadystatechange = function () {
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
