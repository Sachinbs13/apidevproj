const CATEGORY_KEYWORDS = {
  technology: [
    'tech',
    'software',
    'ai',
    'artificial intelligence',
    'computer',
    'digital',
    'startup',
    'cyber',
    'robot',
    'chip',
    'apple',
    'google',
    'microsoft',
  ],
  business: [
    'business',
    'economy',
    'market',
    'stock',
    'finance',
    'trade',
    'company',
    'corporate',
    'invest',
    'bank',
    'earnings',
    'ceo',
  ],
  politics: [
    'politic',
    'election',
    'government',
    'congress',
    'senate',
    'president',
    'minister',
    'parliament',
    'vote',
    'democrat',
    'republican',
    'policy',
    'war',
  ],
  science: [
    'science',
    'research',
    'study',
    'space',
    'nasa',
    'climate',
    'environment',
    'physics',
    'biology',
    'medical',
    'discovery',
  ],
  health: [
    'health',
    'covid',
    'virus',
    'disease',
    'hospital',
    'doctor',
    'vaccine',
    'mental',
    'fitness',
    'wellness',
    'pandemic',
  ],
  sports: [
    'sport',
    'football',
    'soccer',
    'basketball',
    'baseball',
    'cricket',
    'tennis',
    'olympic',
    'championship',
    'league',
    'match',
    'player',
  ],
  entertainment: [
    'movie',
    'film',
    'music',
    'celebrity',
    'hollywood',
    'tv',
    'series',
    'actor',
    'concert',
    'entertainment',
    'gaming',
  ],
};

export function autoTagCategory(title = '', description = '', existingCategory = 'general') {
  if (existingCategory && existingCategory !== 'general') {
    return { category: existingCategory, autoTagged: false };
  }

  const text = `${title} ${description}`.toLowerCase();
  let bestCategory = 'general';
  let bestScore = 0;

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    const score = keywords.reduce((sum, keyword) => {
      const regex = new RegExp(`\\b${keyword}`, 'i');
      return sum + (regex.test(text) ? 1 : 0);
    }, 0);

    if (score > bestScore) {
      bestScore = score;
      bestCategory = category;
    }
  }

  return {
    category: bestScore > 0 ? bestCategory : existingCategory || 'general',
    autoTagged: bestScore > 0,
  };
}

export default { autoTagCategory };
