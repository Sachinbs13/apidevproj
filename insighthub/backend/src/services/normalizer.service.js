export const UNIFIED_ARTICLE_FIELDS = [
  'title',
  'description',
  'content',
  'url',
  'imageUrl',
  'publishedAt',
  'category',
  'author',
];

function normalizeNewsApi(article) {
  return {
    title: article.title || '',
    description: article.description || '',
    content: article.content || article.description || '',
    url: article.url || '',
    imageUrl: article.urlToImage || '',
    publishedAt: article.publishedAt ? new Date(article.publishedAt) : new Date(),
    category: article.source?.name?.toLowerCase() || 'general',
    author: article.author || article.source?.name || '',
  };
}

function normalizeGNews(article) {
  return {
    title: article.title || '',
    description: article.description || '',
    content: article.content || article.description || '',
    url: article.url || '',
    imageUrl: article.image || '',
    publishedAt: article.publishedAt ? new Date(article.publishedAt) : new Date(),
    category: 'general',
    author: article.source?.name || '',
  };
}

function normalizeGuardian(article) {
  const fields = article.fields || {};
  return {
    title: article.webTitle || '',
    description: fields.trailText || article.webTitle || '',
    content: fields.bodyText || fields.trailText || '',
    url: article.webUrl || '',
    imageUrl: fields.thumbnail || '',
    publishedAt: article.webPublicationDate
      ? new Date(article.webPublicationDate)
      : new Date(),
    category: article.sectionName?.toLowerCase() || 'general',
    author: fields.byline || 'The Guardian',
  };
}

function normalizeNyt(article) {
  const image =
    article.multimedia?.find((item) => item.format === 'Super Jumbo') ||
    article.multimedia?.[0];
  const imageUrl = image?.url?.startsWith('http')
    ? image.url
    : image?.url
      ? `https://www.nytimes.com/${image.url}`
      : '';

  return {
    title: article.title || '',
    description: article.abstract || '',
    content: article.abstract || '',
    url: article.url || '',
    imageUrl,
    publishedAt: article.published_date ? new Date(article.published_date) : new Date(),
    category: article.section?.toLowerCase() || 'general',
    author: article.byline || 'The New York Times',
  };
}

function normalizeRss(article) {
  return {
    title: article.title || '',
    description: article.contentSnippet || article.summary || '',
    content: article.content || article.contentSnippet || article.summary || '',
    url: article.link || '',
    imageUrl: article.enclosure?.url || '',
    publishedAt: article.pubDate ? new Date(article.pubDate) : new Date(),
    category: article.categories?.[0]?.toLowerCase() || 'general',
    author: article.creator || article.author || '',
  };
}

const normalizers = {
  newsapi: normalizeNewsApi,
  gnews: normalizeGNews,
  guardian: normalizeGuardian,
  nyt: normalizeNyt,
  rss: normalizeRss,
};

export function normalizeArticle(rawArticle, sourceType) {
  const normalizer = normalizers[sourceType];
  if (!normalizer) {
    throw new Error(`No normalizer registered for source type: ${sourceType}`);
  }

  const normalized = normalizer(rawArticle);

  if (!normalized.title || !normalized.url) {
    return null;
  }

  return normalized;
}

export function registerNormalizer(sourceType, fn) {
  normalizers[sourceType] = fn;
}
