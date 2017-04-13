const __isNewUser = localStorage.getItem('state') == null;
let   __state     = __isNewUser ? {} : JSON.parse(localStorage.getItem('state'));

function state(key, value) {
  // Get the state object
  if (key === undefined)
    return __state;

  // Set a value
  if (value !== undefined) {
    let obj = state();

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
  bot.register('Hello', ['Who are you?', 'What is this?'], (_) => 'Hey there!');
  bot.register('Hello again', (_) => [`Welcome back, ${state('name') || 'stranger'}!`, 'What can I do for you?']);
  bot.register('Hello {person}', ['Who are you?', 'What is this?'], (_) => `Hey there, ${_.person}!`);

  // Data
  bot.register('My name is {name}', (_) => `Nice to meet you, ${state('name', _.name)}!`);
  bot.register('What\'s my name?', (_) => `Your name is ${state('name') || 'unknown to me'}.`);
  bot.register('Clear my {name}', (_) => state('name', null) || 'Okay, your name has been cleared.');
  bot.register('Clear', (_) => { document.getElementById('messages').innerHTML = ''; return []; })

  // Help
  bot.register('What can you do?', ['Who are you?'], (_) => 'Quite a few things! Try asking me who I am, for example.');
  bot.register('Introduce yourself', (_) => ['Hey there!', 'I\'m Greg, and I made this website.', 'Feel free to talk to me through this little bot, and send me your feeback.']);

  // Unknown
  bot.register('Lorem ipsum', (_) => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut pharetra sagittis ornare. Maecenas bibendum dignissim imperdiet. Cras tellus leo, lobortis quis sagittis fringilla, luctus eget elit. Fusce vel efficitur ex, quis rutrum mi. Pellentesque sagittis congue convallis. Nullam lobortis ornare.');
  bot.register('{anything}', ['What can you do?'], (_) => 'Sorry, but I didn\'t get that.');
}
