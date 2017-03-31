class Sentence {
  constructor(sentence, followupQuestions, handler) {
    this.src = sentence;
    this.handler = handler;
    this.followupQuestions = followupQuestions;
    this.indexes = [];

    let rgxStr = '^';
    let isVar = sentence[0] === '{';

    for (let part of sentence.split(/{(.+?)}/ig)) {
      if (isVar) {
        this.indexes.push(part);
        this.rgxStr += '(.+?)';
      } else {
        this.rgxStr += part;
      }

      isVar = !isVar;
    }

    this.rgx = new RegExp(rgxStr + '$', 'ig');
  }

  parse(input) {
    let match = this.rgx.exec(input);

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
    if (handler == null)
      handler = followupQuestions;

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
