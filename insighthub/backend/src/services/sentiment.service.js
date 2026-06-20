import natural from 'natural';

const tokenizer = new natural.WordTokenizer();
const analyzer = new natural.SentimentAnalyzer('English', natural.PorterStemmer, 'afinn');

const POSITIVE_THRESHOLD = 0.5;
const NEGATIVE_THRESHOLD = -0.5;

function labelFromScore(score) {
  if (score >= POSITIVE_THRESHOLD) return 'positive';
  if (score <= NEGATIVE_THRESHOLD) return 'negative';
  return 'neutral';
}

export function scoreSentiment(text = '') {
  if (!text.trim()) {
    return { score: 0, label: 'neutral' };
  }

  const tokens = tokenizer.tokenize(text.toLowerCase());
  if (!tokens?.length) {
    return { score: 0, label: 'neutral' };
  }

  const score = Number(analyzer.getSentiment(tokens).toFixed(4));
  return { score, label: labelFromScore(score) };
}

export default { scoreSentiment };
