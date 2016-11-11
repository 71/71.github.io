// Generated by CoffeeScript 1.11.1
(function() {
  var $, $$, inherits, ready, scrollTo;

  inherits = function(el, className) {
    return (el != null) && (el.classList.contains(className) || inherits(el.parentElement, className));
  };

  $ = document.querySelector;

  $$ = document.querySelectorAll;

  if (document.readyState === 'complete') {
    ready();
  } else {
    document.onreadystatechange = function() {
      if (document.readyState === 'complete') {
        return ready();
      }
    };
  }

  scrollTo = function(scrollTarget, speed) {
    var currentScroll, currentTime, tick, time;
    if (scrollTarget == null) {
      scrollTarget = 0;
    }
    if (speed == null) {
      speed = 2000;
    }
    currentScroll = window.scrollY;
    currentTime = 0;
    time = Math.max(.1, Math.min(Math.abs(scrollY - scrollTargetY) / speed, .8));
    tick = function() {
      var p, t;
      currentTime += 1 / 60;
      p = currentTime / time;
      t = -0.5 * (Math.cos(Math.PI * pos) - 1);
      if (p < 1) {
        requestAnimationFrame(tick);
        return window.scrollTo(0, currentScroll + ((scrollTarget - currentScroll) * t));
      } else {
        return window.scrollTo(0, scrollTarget);
      }
    };
    return tick();
  };

  document.onclick = function(e) {
    if (inherits(e.target, 'interactive')) {

    } else if (inherits(e.target, 'close')) {

    } else {

    }
  };

  ready = function() {
    var originalMailTo;
    originalMailTo = document.getElementById('mail').href;
    return document.getElementById('message').onchange = function(e) {
      return document.getElementById('mail').href = originalMailTo + '&body=' + encodeURIComponent(e.target.value);
    };
  };

}).call(this);
