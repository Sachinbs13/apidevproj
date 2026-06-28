import { getIO } from '../config/socket.js';
import { categoryRoomName, topicRoomName, getSubscribedTopics } from './rooms.js';

const occupationProfiles = {
  Student: { categories: ['technology', 'general', 'science'], keywords: ['exam', 'placement', 'scholarship', 'education'] },
  'Software Engineer': { categories: ['technology', 'business'], keywords: ['programming', 'software', 'ai', 'cloud', 'startup'] },
  Investor: { categories: ['business'], keywords: ['stock', 'market', 'rbi', 'ipo', 'economy', 'finance'] },
  Farmer: { categories: ['general', 'business'], keywords: ['weather', 'agriculture', 'crop', 'farmer', 'monsoon'] }
};

function checkOccupationMatch(article, occupation, text) {
  const profile = occupationProfiles[occupation];
  if (!profile) return false;
  const hasCategory = profile.categories.includes(article.category);
  const hasKeyword = profile.keywords.some((kw) => text.includes(kw));
  return hasCategory || hasKeyword;
}

function articleMatchesTopic(article, topic) {
  const regex = new RegExp(topic, 'i');
  return (
    regex.test(article.title || '') ||
    regex.test(article.description || '') ||
    regex.test(article.category || '')
  );
}

function serializeArticle(article) {
  const doc = article?.toObject ? article.toObject() : article;
  return {
    _id: doc._id,
    title: doc.title,
    description: doc.description,
    url: doc.url,
    imageUrl: doc.imageUrl,
    category: doc.category,
    author: doc.author,
    publishedAt: doc.publishedAt,
    sourceCount: doc.sources?.length || 0,
    sources: doc.sources,
    regionalInfo: doc.regionalInfo,
    schemeDetails: doc.schemeDetails,
    aiSummaries: doc.aiSummaries
  };
}

function serializeSource(source) {
  const doc = source?.toObject ? source.toObject() : source;
  return {
    slug: doc.slug,
    name: doc.name,
    status: doc.status,
    lastError: doc.lastError,
    rateLimitRemaining: doc.rateLimitRemaining,
    lastFetchedAt: doc.lastFetchedAt,
    dedupRatio: doc.dedupRatio,
  };
}

export function emitNewsUpdate(article) {
  const io = getIO();
  if (!io || !article) return;

  const payload = { article: serializeArticle(article), timestamp: new Date().toISOString() };

  io.emit('live:news_update', payload);

  if (article.category) {
    io.to(categoryRoomName(article.category)).emit('live:news_update', payload);
  }

  // 1. Regional state room broadcasts
  if (article.regionalInfo?.state && article.regionalInfo.state !== 'National') {
    io.to(`state:${article.regionalInfo.state}`).emit('live:regional', {
      state: article.regionalInfo.state,
      article: serializeArticle(article),
      timestamp: new Date().toISOString()
    });
  }

  // 2. Occupation recommendation broadcasts
  const text = `${article.title} ${article.description}`.toLowerCase();
  Object.keys(occupationProfiles).forEach((occ) => {
    if (checkOccupationMatch(article, occ, text)) {
      io.to(`occupation:${occ}`).emit('live:recommendations', {
        matchingOccupation: occ,
        article: serializeArticle(article),
        timestamp: new Date().toISOString()
      });
    }
  });

  // 3. Government Scheme updates
  if (article.schemeDetails?.isSchemeRelated) {
    io.emit('live:scheme_updates', {
      schemeName: article.schemeDetails.schemeName,
      articleId: article._id,
      timestamp: new Date().toISOString()
    });
  }

  for (const topic of getSubscribedTopics(io)) {
    if (articleMatchesTopic(article, topic)) {
      io.to(topicRoomName(topic)).emit('live:news_update', payload);
    }
  }
}

export function emitTrending(articles) {
  const io = getIO();
  if (!io) return;

  io.emit('live:trending', {
    articles: articles.map(serializeArticle),
    timestamp: new Date().toISOString(),
  });
}

export function emitBreaking(article, reason) {
  const io = getIO();
  if (!io || !article) return;

  io.emit('live:breaking', {
    article: serializeArticle(article),
    reason,
    timestamp: new Date().toISOString(),
  });
}

export function emitSourceStatus(source) {
  const io = getIO();
  if (!io || !source) return;

  io.emit('live:source_status', {
    source: serializeSource(source),
    timestamp: new Date().toISOString(),
  });
}

export function emitBrief(brief) {
  const io = getIO();
  if (!io || !brief) return;

  io.emit('live:brief', {
    dateString: brief.dateString,
    briefs: brief.briefs,
    timestamp: new Date().toISOString(),
  });
}

export default {
  emitNewsUpdate,
  emitTrending,
  emitBreaking,
  emitSourceStatus,
  emitBrief,
};
