import MorningBrief from '../models/MorningBrief.js';
import Article from '../models/Article.js';
import { translateText } from './language.service.js';
import { emitBrief } from '../websocket/handlers.js';
import logger from '../utils/logger.js';

// Assembles an AI-style text block summarizing articles
function compileDigest(articles, lengthType = '2min') {
  if (articles.length === 0) {
    return 'No updates available for this section today.';
  }

  let digestText = '';
  if (lengthType === '2min') {
    digestText = 'Here is your 2-minute morning brief:\n\n';
    articles.slice(0, 3).forEach((art, idx) => {
      digestText += `${idx + 1}. **${art.title}** - ${art.description || 'Key developments reported.'}\n`;
    });
    digestText += '\n*Fast Tip: Keep an eye on regional trends for deeper analysis.*';
  } else {
    // 5-minute digest
    digestText = 'Your comprehensive 5-minute news intelligence brief:\n\n';
    articles.slice(0, 5).forEach((art, idx) => {
      digestText += `### [Update ${idx + 1}] ${art.title}\n`;
      digestText += `**Context:** ${art.description || 'An ongoing story with significant implications.'}\n`;
      if (art.schemeDetails?.isSchemeRelated) {
        digestText += `> **Government Scheme Identified:** ${art.schemeDetails.schemeName}. Benefits include: ${art.schemeDetails.benefits}\n`;
      }
      digestText += `**Insight:** This impacts active sectors under category ${art.category.toUpperCase()} and has a sentiment rating of ${art.sentiment?.label || 'neutral'}.\n\n`;
    });
    digestText += 'This concludes your morning digest. Keep updated via the real-time stream.';
  }

  return digestText;
}

export async function generateDailyBriefs(dateString) {
  logger.info(`Generating daily morning briefs for date: ${dateString}`);

  // Fetch articles from the last 24 hours
  const pastDay = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recentArticles = await Article.find({
    publishedAt: { $gte: pastDay }
  }).lean();

  const briefsPayload = {};
  const occupations = ['Student', 'Software Engineer', 'Investor', 'Farmer', 'General'];

  // Categories & keywords mapping to filter relevant news
  const filters = {
    Student: { categories: ['technology', 'general', 'science'], keywords: ['exam', 'placement', 'scholarship', 'education'] },
    'Software Engineer': { categories: ['technology', 'business'], keywords: ['programming', 'software', 'ai', 'cloud', 'startup'] },
    Investor: { categories: ['business'], keywords: ['stock', 'market', 'rbi', 'ipo', 'economy', 'finance'] },
    Farmer: { categories: ['general', 'business'], keywords: ['weather', 'agriculture', 'crop', 'farmer', 'monsoon'] },
    General: { categories: [], keywords: [] }
  };

  for (const occ of occupations) {
    const profile = filters[occ];
    // Filter articles based on occupation profile
    let filtered = recentArticles;
    if (profile.categories.length > 0 || profile.keywords.length > 0) {
      filtered = recentArticles.filter((art) => {
        const hasCategory = profile.categories.includes(art.category);
        const text = `${art.title} ${art.description}`.toLowerCase();
        const hasKeyword = profile.keywords.some((kw) => text.includes(kw));
        return hasCategory || hasKeyword;
      });
    }

    // Fallback if not enough articles are filtered
    if (filtered.length < 3) {
      filtered = recentArticles;
    }

    briefsPayload[occ] = {
      digest2Min: compileDigest(filtered, '2min'),
      digest5Min: compileDigest(filtered, '5min')
    };
  }

  // Update or insert morning brief
  const brief = await MorningBrief.findOneAndUpdate(
    { dateString },
    { briefs: briefsPayload },
    { new: true, upsert: true }
  );

  emitBrief(brief);

  return brief;
}

export async function getMorningBriefForUser(user, dateString, lang = 'English') {
  const occupation = user.preferences?.occupation || 'General';
  
  // Try to find the pre-generated brief
  let dailyBrief = await MorningBrief.findOne({ dateString });

  // If not generated, trigger generation on-the-fly
  if (!dailyBrief) {
    dailyBrief = await generateDailyBriefs(dateString);
  }

  const userBrief = dailyBrief.briefs[occupation] || dailyBrief.briefs.General;

  // Translate if required
  if (lang !== 'English') {
    return {
      dateString,
      occupation,
      language: lang,
      digest2Min: translateText(userBrief.digest2Min, lang),
      digest5Min: translateText(userBrief.digest5Min, lang)
    };
  }

  return {
    dateString,
    occupation,
    language: 'English',
    digest2Min: userBrief.digest2Min,
    digest5Min: userBrief.digest5Min
  };
}

export default { generateDailyBriefs, getMorningBriefForUser };
