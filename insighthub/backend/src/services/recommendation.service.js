import Article from '../models/Article.js';

const occupationProfiles = {
  Student: {
    categories: ['technology', 'general', 'science'],
    keywords: ['exam', 'placement', 'scholarship', 'education', 'ai', 'hackathon', 'college', 'university', 'syllabus', 'career', 'internship']
  },
  'Software Engineer': {
    categories: ['technology', 'business'],
    keywords: ['programming', 'software', 'ai', 'cloud', 'startup', 'developer', 'crypto', 'saas', 'coding', 'tech', 'openai', 'llm', 'github']
  },
  Investor: {
    categories: ['business', 'general'],
    keywords: ['stock', 'market', 'rbi', 'ipo', 'economy', 'investment', 'finance', 'nifty', 'sensex', 'budget', 'gdp', 'inflation', 'fed']
  },
  Farmer: {
    categories: ['general', 'business'],
    keywords: ['weather', 'agriculture', 'crop', 'scheme', 'fertilizer', 'farmer', 'monsoon', 'rural', 'irrigation', 'farming', 'subsidy', 'harvest']
  },
  General: {
    categories: [],
    keywords: []
  }
};

export async function getPersonalizedFeed(user, limit = 20, page = 1) {
  const skip = (page - 1) * limit;

  // Retrieve user preferences
  const { occupation = 'General', state = 'National', topics = [], sources = [] } = user.preferences || {};
  const profile = occupationProfiles[occupation] || occupationProfiles.General;

  // Build query
  const query = {};

  // If user selected preferred sources, we can filter or boost them (let's do filtering/boosting based on DB contents)
  if (sources.length > 0) {
    // Optional: filter by sources if selected
  }

  // Fetch recent articles (e.g. past 7 days or simply last 150 articles to score)
  const articles = await Article.find(query)
    .sort({ publishedAt: -1 })
    .limit(150)
    .lean();

  // Score each article based on user preference profile
  const scoredArticles = articles.map((article) => {
    let score = 0;

    // 1. Occupation Category match
    if (profile.categories.includes(article.category)) {
      score += 4;
    }

    // 2. Occupation Keyword match
    const text = `${article.title} ${article.description}`.toLowerCase();
    profile.keywords.forEach((keyword) => {
      if (text.includes(keyword)) {
        score += 2;
      }
    });

    // 3. User explicit topics (interests) match
    if (topics.length > 0) {
      topics.forEach((topic) => {
        if (article.category === topic.toLowerCase()) {
          score += 5;
        }
        if (text.includes(topic.toLowerCase())) {
          score += 3;
        }
      });
    }

    // 4. Regional preference match (highly prioritized)
    if (state !== 'National' && state !== 'All') {
      if (article.regionalInfo?.state === state) {
        score += 8; // Heavy boost for state local news
      } else if (article.regionalInfo?.state === 'National') {
        score += 2; // Moderate boost for national news
      }
    }

    return {
      ...article,
      relevanceScore: score
    };
  });

  // Sort by relevance score descending, then by publication date descending
  scoredArticles.sort((a, b) => {
    if (b.relevanceScore !== a.relevanceScore) {
      return b.relevanceScore - a.relevanceScore;
    }
    return new Date(b.publishedAt) - new Date(a.publishedAt);
  });

  // Paginated slice
  const paginated = scoredArticles.slice(skip, skip + limit);

  return {
    articles: paginated,
    total: scoredArticles.length,
    page,
    limit
  };
}

export default { getPersonalizedFeed };
