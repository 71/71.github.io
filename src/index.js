// Set up bot
const bot = new Bot();
addInteractions(bot);

// Set up events
function isValid(input) {
  return /\w+/.test(input);
}

function ready() {
  const suggestions = document.getElementById('suggestions');
  const messages    = document.getElementById('messages');
  const message     = document.getElementById('message');
  const bottom      = document.getElementById('bottom');
  const email       = document.getElementById('email');
  const form        = document.getElementById('userinput');
  const send        = document.getElementById('send');

  const originalMailTo = email.href;

  let hasBeenIntroduced = false;

  message.onchange = (e) => {
    email.href = (e.target.value == '') ? originalMailTo : (originalMailTo + '&body=' + encodeURIComponent(e.target.value));
  };

  message.oninput = (e) => {
    send.disabled = !isValid(e.target.value);
  };

  form.onsubmit = (e) => {
    if (e != null)
      e.preventDefault();

    if (!isValid(message.value))
      return;

    let reply = bot.ask(message.value);
    let atEnd = document.body.offsetHeight - window.innerHeight - document.body.scrollTop === 0;

    let sent = document.createElement('div');

    sent.className = 'sent';
    sent.innerHTML = `<p>${message.value}</p>`;

    messages.appendChild(sent);

    let answers = (typeof reply.answer === 'string') ? [ reply.answer ] : reply.answer;

    for (let answer of answers) {
      let received = document.createElement('div');

      received.className = 'received';
      received.innerHTML = answer;

      messages.appendChild(received);
    }

    message.value = '';
    send.disabled = true;

    while (suggestions.lastChild) {
      suggestions.removeChild(suggestions.lastChild);
    }

    for (let followup of reply.followupQuestions) {
      let suggestion = document.createElement('li');

      suggestion.className = 'suggestion';
      suggestion.innerHTML = followup;

      suggestion.onclick = (e) => {
        message.value = followup;
        form.onsubmit();
      };

      suggestions.appendChild(suggestion);
    }

    if (hasBeenIntroduced)
      smoothScrollTo(bottom.offsetTop - innerHeight, 100);
  };

  // Start conversation
  message.value = __isNewUser ? 'Introduce yourself' : 'Hello again';
  form.onsubmit();

  messages.firstChild.remove();
  hasBeenIntroduced = true;
}

if (document.readyState === 'complete') {
  ready();
} else {
  document.onreadystatechange = () => {
    if (document.readyState === 'complete')
      ready();
  };
}

// Utils
function smoothScrollTo(scrollTarget, speed) {
  if (typeof scrollTarget !== 'number')
    scrollTarget = 0;
  if (typeof speed !== 'number')
    speed = 2000;

  let currentScroll = window.scrollY;
  let currentTime   = 0;
  let time          = Math.max(.1, Math.min(Math.abs(currentScroll - scrollTarget) / speed, .8));

  let ease = (p) => ((p /= .5) < 1) ? .5 * Math.pow(p, 5) : .5 * (Math.pow((p - 2), 5) + 2);
  let tick = ()  => {
    currentTime += 1 / 60;
    p = currentTime / time;
    t = ease(p);

    if (p < 1) {
      requestAnimationFrame(tick);
      window.scrollTo(0, currentScroll + ((scrollTarget - currentScroll) * t));
    } else {
      window.scrollTo(0, scrollTarget);
    }
  };

  tick();
}
