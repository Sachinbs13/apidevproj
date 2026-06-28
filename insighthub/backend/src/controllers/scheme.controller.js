import Article from '../models/Article.js';

export async function getRecommendedSchemes(req, res, next) {
  try {
    // Find recent articles with scheme intelligence
    const articles = await Article.find({ 'schemeDetails.isSchemeRelated': true })
      .sort({ publishedAt: -1 })
      .limit(100)
      .lean();

    // Group unique schemes to avoid displaying duplicate scheme descriptions
    const uniqueSchemes = new Map();
    articles.forEach((art) => {
      const { schemeName, eligibility, benefits, officialWebsite } = art.schemeDetails;
      if (schemeName && !uniqueSchemes.has(schemeName)) {
        uniqueSchemes.set(schemeName, {
          schemeName,
          eligibility,
          benefits,
          officialWebsite,
          category: art.category,
          latestNewsTitle: art.title,
          latestNewsId: art._id,
          publishedAt: art.publishedAt
        });
      }
    });

    const schemeList = Array.from(uniqueSchemes.values());

    // Sort: prioritize schemes matching user occupation/categories if user profile is available
    // Otherwise, return standard sorted by publication date
    res.json({
      success: true,
      data: schemeList
    });
  } catch (error) {
    next(error);
  }
}

export default { getRecommendedSchemes };
