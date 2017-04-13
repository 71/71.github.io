function cleanInput(input) {
  return input.trim().replace(/[?.!]/g, '');
}

var Sentence = function Sentence(sentence, followupQuestions, handler) {
  var this$1 = this;

  this.src = cleanInput(sentence);
  this.handler = handler;
  this.followupQuestions = followupQuestions;
  this.indexes = [];

  var rgxStr = '^';
  var isVar = sentence[0] === '{';

  for (var i = 0, list = sentence.split(/{(.+?)}/ig); i < list.length; i += 1) {
    var part = list[i];

    if (part === '')
      continue;

    if (isVar) {
      this$1.indexes.push(part);
      rgxStr += '(.+?)';
    } else {
      rgxStr += part;
    }

    isVar = !isVar;
  }

  this.rgx = new RegExp(rgxStr + '$', 'ig');
};

Sentence.prototype.parse = function parse (input) {
    var this$1 = this;

  var match = this.rgx.exec(cleanInput(input));

  if (match == null)
    return null;

  this.rgx.lastIndex = 0;
  var result = {};

  for (var i = 1; i < match.length; i++) {
    result[this$1.indexes[i - 1]] = match[i];
  }

  return result;
};

Sentence.prototype.handle = function handle (obj) {
  return this.handler(obj);
};

Sentence.prototype.ask = function ask (input) {
  var obj = this.parse(input);
  return obj == null ? null : new Answer(this.handle(obj), this.followupQuestions);
};

var Answer = function Answer(answer, followupQuestions) {
  this.answer = answer;
  this.followupQuestions = followupQuestions;
};

var Bot = function Bot() {
  this.sentences = [];
};

Bot.prototype.register = function register (sentence, followupQuestions, handler) {
    var this$1 = this;

  if (handler == null) {
    handler = followupQuestions;
    followupQuestions = [];
  }

  if (typeof sentence === 'string') {
    this.sentences.push(new Sentence(sentence, followupQuestions, handler));
  } else {
    for (var i = 0, list = sentence; i < list.length; i += 1) {
      var s = list[i];

        this$1.sentences.push(new Sentence(s, followupQuestions, handler));
    }
  }
};

Bot.prototype.ask = function ask (input) {
  for (var i = 0, list = this.sentences; i < list.length; i += 1) {
    var sentence = list[i];

      var answer = sentence.ask(input);

    if (answer != null)
      return answer;
  }

  return null;
};

var __isNewUser = localStorage.getItem('state') == null;
var   __state     = __isNewUser ? {} : JSON.parse(localStorage.getItem('state'));

function state(key, value) {
  // Get the state object
  if (key === undefined)
    return __state;

  // Set a value
  if (value !== undefined) {
    var obj = state();

    obj[key] = value;

    state(obj);
    return value;
  }

  // Get a value
  if (typeof key === 'string')
    return state()[key];

  // Set the state object
  localStorage.setItem('state', JSON.stringify(__state = key));
  return __state;
}

function addInteractions(bot) {
  // Friendly
  bot.register('Hello', ['Who are you?', 'What is this?'], function (_) { return 'Hey there!'; });
  bot.register('Hello again', function (_) { return [("Welcome back, " + (state('name') || 'stranger') + "!"), 'What can I do for you?']; });
  bot.register('Hello {person}', ['Who are you?', 'What is this?'], function (_) { return ("Hey there, " + (_.person) + "!"); });

  // Data
  bot.register('My name is {name}', function (_) { return ("Nice to meet you, " + (state('name', _.name)) + "!"); });
  bot.register('What\'s my name?', function (_) { return ("Your name is " + (state('name') || 'unknown to me') + "."); });
  bot.register('Clear my {name}', function (_) { return state('name', null) || 'Okay, your name has been cleared.'; });
  bot.register('Clear', function (_) { document.getElementById('messages').innerHTML = ''; return []; })

  // Help
  bot.register('What can you do?', ['Who are you?'], function (_) { return 'Quite a few things! Try asking me who I am, for example.'; });
  bot.register('Introduce yourself', function (_) { return ['Hey there!', 'I\'m Greg, and I made this website.', 'Feel free to talk to me through this little bot, and send me your feeback.']; });

  // Unknown
  bot.register('Lorem ipsum', function (_) { return 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut pharetra sagittis ornare. Maecenas bibendum dignissim imperdiet. Cras tellus leo, lobortis quis sagittis fringilla, luctus eget elit. Fusce vel efficitur ex, quis rutrum mi. Pellentesque sagittis congue convallis. Nullam lobortis ornare.'; });
  bot.register('{anything}', ['What can you do?'], function (_) { return 'Sorry, but I didn\'t get that.'; });
}

// Set up bot
var bot = new Bot();
addInteractions(bot);

// Set up events
function isValid(input) {
  return /\w+/.test(input);
}

function ready() {
  var suggestions = document.getElementById('suggestions');
  var messages    = document.getElementById('messages');
  var message     = document.getElementById('message');
  var bottom      = document.getElementById('bottom');
  var email       = document.getElementById('email');
  var form        = document.getElementById('userinput');
  var send        = document.getElementById('send');

  var originalMailTo = email.href;

  var hasBeenIntroduced = false;

  message.onchange = function (e) {
    email.href = (e.target.value == '') ? originalMailTo : (originalMailTo + '&body=' + encodeURIComponent(e.target.value));
  };

  message.oninput = function (e) {
    send.disabled = !isValid(e.target.value);
  };

  form.onsubmit = function (e) {
    if (e != null)
      e.preventDefault();

    if (!isValid(message.value))
      return;

    var reply = bot.ask(message.value);
    var atEnd = document.body.offsetHeight - window.innerHeight - document.body.scrollTop === 0;

    var sent = document.createElement('div');

    sent.className = 'sent';
    sent.innerHTML = "<p>" + (message.value) + "</p>";

    messages.appendChild(sent);

    var answers = (typeof reply.answer === 'string') ? [ reply.answer ] : reply.answer;

    for (var i = 0, list = answers; i < list.length; i += 1) {
      var answer = list[i];

      var received = document.createElement('div');

      received.className = 'received';
      received.innerHTML = answer;

      messages.appendChild(received);
    }

    message.value = '';
    send.disabled = true;

    while (suggestions.lastChild) {
      suggestions.removeChild(suggestions.lastChild);
    }

    var loop = function () {
      var followup = list$1[i$1];

      var suggestion = document.createElement('li');

      suggestion.className = 'suggestion';
      suggestion.innerHTML = followup;

      suggestion.onclick = function (e) {
        message.value = followup;
        form.onsubmit();
      };

      suggestions.appendChild(suggestion);
    };

    for (var i$1 = 0, list$1 = reply.followupQuestions; i$1 < list$1.length; i$1 += 1) loop();

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
  document.onreadystatechange = function () {
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

  var currentScroll = window.scrollY;
  var currentTime   = 0;
  var time          = Math.max(.1, Math.min(Math.abs(currentScroll - scrollTarget) / speed, .8));

  var ease = function (p) { return ((p /= .5) < 1) ? .5 * Math.pow(p, 5) : .5 * (Math.pow((p - 2), 5) + 2); };
  var tick = function ()  {
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
