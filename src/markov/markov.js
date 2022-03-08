const { banned } = require('./words');

const MAX_RETRIES = 100;

function getLetter(stat) {
  const index = fxrand() * stat._total;
  let cumulativeIndex = 0;
  for (const key of Object.keys(stat).filter(k => k !== '_total')) {
    cumulativeIndex += stat[key];
    if (cumulativeIndex > index) return key !== 'undefined' ? key : undefined;
  }
}

export function generate(stats, minLength = 0, maxLength = 100, allowSeedWords = false) {
  let retryCount = 0;
  outerLoop:
  while (retryCount++ < MAX_RETRIES) {
    let output = getLetter(stats.letters['']);
    while (true) {
      const stat = stats.letters[output.slice(-1 * stats.order)];
      if (stat == null) continue outerLoop;
      const nextLetter = getLetter(stat);
      if (nextLetter == null) {
        if (output.length < minLength) continue outerLoop;
        if (
          (!allowSeedWords && stats.seedWords.includes(output)) ||
          banned.find(b => output.toLowerCase().includes(b))
        ) continue outerLoop;
        return output;
      };
      output += nextLetter;

      // n.b. - this may give "unnatural" endings to words as it cuts them off
      // at a point that they wouldn't naturally end.
      // A more involved solution (that, as a trade-off, requires you pre-specifying
      //the length of the word) can be found here: https://github.com/davidminor/markov-words/blob/master/markov.js
      if (output.length > maxLength) continue outerLoop;
    }
  }
}
