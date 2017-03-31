// Set title
const now  = new Date(Date.now());
const hour = now.getHours();

let title = 'Grégoire GEIS - ';

if (hour > 16)
  title += 'Good evening';
else if (hour > 11)
  title += 'Good afternoon';
else if (hour > 4)
  title += 'Good morning';
else
  title += 'Good night';

document.title = title;

// Set up bot
const bot = new Bot();
addInteractions(bot);

// Set up events
function isValid(input) {
  return /\w+/.test(input);
}

function ready() {
  const messages = document.getElementById('messages');
  const message  = document.getElementById('message');
  const email    = document.getElementById('email');
  const form     = document.getElementById('userinput');
  const send     = document.getElementById('send');

  const originalMailTo = email.href;

  message.onchange = (e) => {
    email.href = (e.target.value == '') ? originalMailTo : (originalMailTo + '&body=' + encodeURIComponent(e.target.value));
  };

  message.oninput = (e) => {
    send.disabled = !isValid(e.target.value);
  };

  form.onsubmit = (e) => {
    e.preventDefault();

    if (!isValid(message.value))
      return;

    let atEnd = document.body.offsetHeight - window.innerHeight - document.body.scrollTop === 0;

    let sent = document.createElement('div');
    let received = document.createElement('div');

    sent.className = 'sent';
    sent.innerHTML = `<p>${message.value}</p>`;

    received.className = 'received loading';
    received.innerHTML = '<p>Loading...</p>';

    messages.appendChild(sent);
    messages.appendChild(received);

    try {
      let xhr = new XMLHttpRequest();

      xhr.open('POST', 'https://jeebot.herokuapp.com/api/ask', true);

      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          received.classList.remove('loading');

          if (xhr.status === 200) {
            received.innerHTML = xhr.responseText;
          } else {
            received.classList.add('failed');
            received.innerHTML = (xhr.responseText != "") ? `<p>${xhr.responseText}</p>` : `<p>Error ${xhr.status} encountered when trying to talk to the bot.</p>`;
          }

          if (atEnd) {
            messages.scrollTop = messages.offsetHeight;
            smoothScrollTo(document.body.offsetHeight - window.innerHeight, 10);
          }
        }
      };

      xhr.send(message.value);
    } catch (e) {
        received.classList.add('failed');
        received.innerHTML = '<p>Error encountered when trying to talk to the bot.</p>';
    }

    message.value = '';
    send.disabled = true;
  };
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
