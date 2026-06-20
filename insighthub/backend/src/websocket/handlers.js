import { getIO } from '../config/socket.js';
import { categoryRoomName, topicRoomName, getSubscribedTopics } from './rooms.js';

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

export default {
  emitNewsUpdate,
  emitTrending,
  emitBreaking,
  emitSourceStatus,
};
