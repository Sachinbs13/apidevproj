import Article from '../models/Article.js';

export async function getTrendingRegions(req, res, next) {
  try {
    const stats = await Article.aggregate([
      {
        $match: {
          'regionalInfo.country': 'India',
          'regionalInfo.state': { $ne: 'National' }
        }
      },
      {
        $group: {
          _id: '$regionalInfo.state',
          articleCount: { $sum: 1 },
          categories: { $push: '$category' }
        }
      }
    ]);

    const formatted = stats.map((item) => {
      // Calculate the most frequent category (trendingTopic) for this state
      const categoryCounts = {};
      let topCategory = 'general';
      let maxCount = 0;
      item.categories.forEach((cat) => {
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
        if (categoryCounts[cat] > maxCount) {
          maxCount = categoryCounts[cat];
          topCategory = cat;
        }
      });

      return {
        state: item._id,
        articleCount: item.articleCount,
        trendingTopic: topCategory.charAt(0).toUpperCase() + topCategory.slice(1)
      };
    });

    res.json({
      success: true,
      data: formatted
    });
  } catch (error) {
    next(error);
  }
}

export async function getRegionalAnalytics(req, res, next) {
  try {
    const analytics = await Article.aggregate([
      {
        $match: {
          'regionalInfo.country': 'India',
          'regionalInfo.state': { $ne: 'National' }
        }
      },
      {
        $group: {
          _id: '$regionalInfo.state',
          articleCount: { $sum: 1 },
          avgSentiment: { $avg: '$sentiment.score' },
          positiveCount: {
            $sum: { $cond: [{ $eq: ['$sentiment.label', 'positive'] }, 1, 0] }
          },
          negativeCount: {
            $sum: { $cond: [{ $eq: ['$sentiment.label', 'negative'] }, 1, 0] }
          },
          neutralCount: {
            $sum: { $cond: [{ $eq: ['$sentiment.label', 'neutral'] }, 1, 0] }
          }
        }
      },
      { $sort: { articleCount: -1 } }
    ]);

    res.json({
      success: true,
      data: analytics.map(a => ({
        state: a._id,
        articleCount: a.articleCount,
        avgSentiment: Math.round((a.avgSentiment || 0) * 100) / 100,
        distribution: {
          positive: a.positiveCount,
          negative: a.negativeCount,
          neutral: a.neutralCount
        }
      }))
    });
  } catch (error) {
    next(error);
  }
}

export default { getTrendingRegions, getRegionalAnalytics };
