function cleanInput(input) {
  return input.trim().replace(/[?.!]/g, '');
}

class Sentence {
  constructor(sentence, followupQuestions, handler) {
    this.src = cleanInput(sentence);
    this.handler = handler;
    this.followupQuestions = followupQuestions;
    this.indexes = [];

    let rgxStr = '^';
    let isVar = sentence[0] === '{';

    for (let part of sentence.split(/{(.+?)}/ig)) {
      if (part === '')
        continue;

      if (isVar) {
        this.indexes.push(part);
        rgxStr += '(.+?)';
      } else {
        rgxStr += part;
      }

      isVar = !isVar;
    }

    this.rgx = new RegExp(rgxStr + '$', 'ig');
  }

  parse(input) {
    let match = this.rgx.exec(cleanInput(input));

    if (match == null)
      return null;

    this.rgx.lastIndex = 0;
    let result = {};

    for (let i = 1; i < match.length; i++) {
      result[this.indexes[i - 1]] = match[i];
    }

    return result;
  }

  handle(obj) {
    return this.handler(obj);
  }

  ask(input) {
    let obj = this.parse(input);
    return obj == null ? null : new Answer(this.handle(obj), this.followupQuestions);
  }
}

class Answer {
  constructor(answer, followupQuestions) {
    this.answer = answer;
    this.followupQuestions = followupQuestions;
  }
}

class Bot {
  constructor() {
    this.sentences = [];
  }

  register(sentence, followupQuestions, handler) {
    if (handler == null) {
      handler = followupQuestions;
      followupQuestions = [];
    }

    if (typeof sentence === 'string') {
      this.sentences.push(new Sentence(sentence, followupQuestions, handler));
    } else {
      for (let s of sentence) {
        this.sentences.push(new Sentence(s, followupQuestions, handler));
      }
    }
  }

  ask(input) {
    for (let sentence of this.sentences) {
      let answer = sentence.ask(input);

      if (answer != null)
        return answer;
    }

    return null;
  }
}
