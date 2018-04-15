
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
