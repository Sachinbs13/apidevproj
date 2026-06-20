import natural from 'natural';

const tokenizer = new natural.WordTokenizer();

const STOP_WORDS = new Set([
  'a',
  'an',
  'the',
  'and',
  'or',
  'but',
  'in',
  'on',
  'at',
  'to',
  'for',
  'of',
  'with',
  'by',
  'from',
  'is',
  'are',
  'was',
  'were',
  'be',
  'been',
  'has',
  'have',
  'had',
  'will',
  'would',
  'could',
  'should',
  'may',
  'might',
  'that',
  'this',
  'it',
  'as',
  'not',
  'no',
  's',
  't',
]);

export function tokenizeTitle(title = '') {
  return tokenizer
    .tokenize(title.toLowerCase())
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token) && /^[a-z0-9]+$/.test(token));
}
