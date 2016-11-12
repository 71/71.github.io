(function() {
  var $, $$, all, any, hour, menu, now, ready, scrollTo;

  any = function(el, predicate) {
    return (el != null) && (predicate(el) || any(el.parentElement, predicate));
  };

  all = function(el, predicate) {
    if (el != null) {
      return predicate(el) && any(el.parentElement, predicate);
    } else {
      return true;
    }
  };

  $ = document.querySelector;

  $$ = document.querySelectorAll;

  menu = null;

  now = new Date(Date.now());

  hour = now.getHours();

  document.title = 'Jee - ' + (hour > 16 ? 'Good evening' : hour > 11 ? 'Good afternoon' : hour > 4 ? 'Good morning' : 'Good night');

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
    var currentScroll, currentTime, ease, tick, time;
    if (scrollTarget == null) {
      scrollTarget = 0;
    }
    if (speed == null) {
      speed = 2000;
    }
    currentScroll = window.scrollY;
    currentTime = 0;
    time = Math.max(.1, Math.min(Math.abs(window.scrollY - scrollTarget) / speed, .8));
    ease = function(p) {
      if ((p /= .5) < 1) {
        return .5 * Math.pow(p, 5);
      }
      return 0.5 * (Math.pow(p - 2, 5) + 2);
    };
    tick = function() {
      var p, t;
      currentTime += 1 / 60;
      p = currentTime / time;
      t = ease(p);
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
    var child, clip, el, i, isSub, len, menuClip, ref;
    if (menu === null) {
      menu = document.createElement('div');
      menu.id = 'menu';
      menuClip = document.createElement('div');
      menuClip.id = 'menuclip';
      menu.appendChild(menuClip);
      ref = document.querySelectorAll('[data-title], [data-subtitle]');
      for (i = 0, len = ref.length; i < len; i++) {
        el = ref[i];
        isSub = el.hasAttribute('data-subtitle');
        child = document.createElement('a');
        child.classList.add(isSub ? 'subtitle' : 'title');
        child.innerText = el.getAttribute(isSub ? 'data-subtitle' : 'data-title').toUpperCase();
        child.setAttribute('data-offset', el.offsetTop);
        child.onclick = function() {
          return scrollTo(this.getAttribute('data-offset'));
        };
        menu.appendChild(child);
      }
      document.body.prepend(menu);
    }
    if (menu.classList.contains('shown')) {
      clip = menu.firstChild;
      clip.style.left = e.x + 'px';
      clip.style.top = e.y + 'px';
      return menu.classList.remove('shown');
    } else if (all(e.target, function(_) {
      return ['div', 'section', 'svg', 'body', 'html'].indexOf(_.tagName.toLowerCase()) !== -1 && !_.classList.contains('arrow');
    })) {
      menu.classList.add('shown');
      clip = menu.firstChild;
      clip.style.left = e.x + 'px';
      return clip.style.top = e.y + 'px';
    }
  };

  ready = function() {
    var message, messages, originalMailTo;
    messages = document.getElementById('messages');
    message = document.getElementById('message');
    originalMailTo = document.getElementById('email').href;
    document.getElementById('message').onchange = function(e) {
      return document.getElementById('email').href = e.target.value === '' ? originalMailTo : originalMailTo + '&body=' + encodeURIComponent(e.target.value);
    };
    document.getElementsByClassName('arrow')[0].onclick = function(e) {
      return scrollTo(window.innerHeight, 10);
    };
    document.getElementById('message').oninput = function(e) {
      return document.getElementById('send').disabled = !/\w+/.test(e.target.value);
    };
    return document.getElementById('userinput').onsubmit = function(e) {
      var received, sent, xhr;
      e.preventDefault();
      sent = document.createElement('div');
      sent.className = 'sent';
      sent.innerText = message.value;
      messages.appendChild(sent);
      messages.appendChild(document.createElement('br'));
      received = document.createElement('div');
      received.className = 'received loading';
      received.innerText = 'Loading...';
      messages.appendChild(received);
      messages.appendChild(document.createElement('br'));
      try {
        xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:8080', true);
        xhr.onreadystatechange = function() {
          if (xhr.readyState === XMLHttpRequest.DONE) {
            received.classList.remove('loading');
            if (xhr.status === 200) {
              return received.innerHTML = xhr.responseText;
            } else {
              received.classList.add('failed');
              return received.innerHTML = xhr.responseText !== "" ? "<p>" + xhr.responseText + "</p>" : "<p>Error " + xhr.status + " encountered when trying to talk to the bot.</p>";
            }
          }
        };
        xhr.send(message.value);
      } catch (error) {
        received.classList.add('failed');
        received.innerText = "Error encountered when trying to talk to the bot";
      }
      return message.value = '';
    };
  };

}).call(this);
