import { jaccardSimilarity } from './jaccardSimilarity.js';
import { cosineSimilarity } from './cosineSimilarity.js';

export function similarityScore(tokensA, tokensB) {
  const jaccard = jaccardSimilarity(tokensA, tokensB);
  const cosine = cosineSimilarity(tokensA, tokensB);
  return Math.max(jaccard, cosine);
}
