function addLetterToStat(prefix, letter, stats) {
  if (stats.letters[prefix] == null) stats.letters[prefix] = {};
  stats.letters[prefix][letter] = (stats.letters[prefix][letter] ?? 0) + 1;
  stats.letters[prefix]._total = (stats.letters[prefix]._total ?? 0) + 1;
}

export function calculateStats(seedWords, order) {
  const stats = { letters: {}, order };
  for (const word of seedWords) {
    addLetterToStat('', word[0], stats);
    for (let i = 1; i <= word.length; i++) addLetterToStat(word.slice(Math.max(0, i - order), i), word[i], stats);
  }
  stats.seedWords = seedWords;
  return stats;
}
