export function cosineSimilarity(tokensA, tokensB) {
  if (!tokensA.length || !tokensB.length) return 0;

  const setA = new Set(tokensA);
  const setB = new Set(tokensB);
  const intersection = [...setA].filter((token) => setB.has(token));

  return intersection.length / (Math.sqrt(setA.size) * Math.sqrt(setB.size));
}
