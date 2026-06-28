import { INDIAN_STATES } from '../constants/indianStates.js';

const TOPIC_CATEGORIES = new Set([
  'technology',
  'business',
  'politics',
  'science',
  'health',
  'sports',
  'entertainment',
  'general',
]);

const AGGREGATOR_SOURCES = new Set([
  'currents api',
  'newsapi.org',
  'newsapi',
  'gnews',
]);

const DOMAIN_PUBLISHERS = {
  'thehindu.com': 'The Hindu',
  'indianexpress.com': 'Indian Express',
  'indiatoday.in': 'India Today',
  'timesofindia.indiatimes.com': 'Times of India',
  'hindustantimes.com': 'Hindustan Times',
  'ndtv.com': 'NDTV',
  'bbc.com': 'BBC',
  'bbc.co.uk': 'BBC',
  'reuters.com': 'Reuters',
  'theguardian.com': 'The Guardian',
  'nytimes.com': 'The New York Times',
  'economictimes.indiatimes.com': 'Economic Times',
  'livemint.com': 'Mint',
  'deccanherald.com': 'Deccan Herald',
  'thewire.in': 'The Wire',
  'scroll.in': 'Scroll.in',
};

const AUTHOR_LABELS = {
  thehindu: 'The Hindu',
  indianexpress: 'Indian Express',
  indiatoday: 'India Today',
  hindustantimes: 'Hindustan Times',
  ndtv: 'NDTV',
  bbc: 'BBC',
  reuters: 'Reuters',
};

function normalizeTag(value = '') {
  return value.toLowerCase().replace(/[_-]/g, ' ').replace(/\s+/g, ' ').trim();
}

function matchIndianState(value = '') {
  const normalized = normalizeTag(value);
  return INDIAN_STATES.find((state) => normalizeTag(state) === normalized) || null;
}

function publisherFromUrl(url) {
  if (!url) return null;

  try {
    const host = new URL(url).hostname.replace(/^www\./, '');
    if (DOMAIN_PUBLISHERS[host]) return DOMAIN_PUBLISHERS[host];

    const base = host.split('.').slice(0, -1).join('.');
    if (DOMAIN_PUBLISHERS[base]) return DOMAIN_PUBLISHERS[base];

    const site = host.split('.')[0];
    return formatAuthorLabel(site);
  } catch {
    return null;
  }
}

function formatAuthorLabel(value = '') {
  const key = value.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (AUTHOR_LABELS[key]) return AUTHOR_LABELS[key];

  return value
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
}

function isAggregatorName(name = '') {
  return AGGREGATOR_SOURCES.has(name.toLowerCase().trim());
}

export function resolvePublisherName(article, sourceRef = null) {
  const url = sourceRef?.originalUrl || article.url;
  const fromUrl = publisherFromUrl(url);
  if (fromUrl) return fromUrl;

  const ingestionName = (sourceRef?.sourceName || article.sources?.[0]?.sourceName || '').trim();
  if (ingestionName && !isAggregatorName(ingestionName)) {
    return ingestionName;
  }

  const author = article.author?.trim();
  if (author && !['currents', 'currents api', 'unknown'].includes(author.toLowerCase())) {
    return formatAuthorLabel(author);
  }

  return ingestionName || null;
}

export function resolveLocationLabel(article) {
  const state = article.regionalInfo?.state;
  const city = article.regionalInfo?.city?.trim();

  if (state && state !== 'National') {
    return city ? `${city}, ${state}` : state;
  }

  const stateFromCategory = matchIndianState(article.category);
  if (stateFromCategory) {
    return stateFromCategory;
  }

  return null;
}

export function resolveCategoryLabel(article) {
  const category = article.category;
  if (!category || category === 'general') return null;

  if (matchIndianState(category)) return null;

  const location = resolveLocationLabel(article);
  if (location && normalizeTag(category) === normalizeTag(location.split(',').pop())) {
    return null;
  }

  if (!TOPIC_CATEGORIES.has(normalizeTag(category)) && matchIndianState(category.replace(/\s+/g, ' '))) {
    return null;
  }

  return category;
}

export function getPrimarySourceName(article) {
  return resolvePublisherName(article);
}

export function getPublisherFromSourceRef(article, sourceRef) {
  return resolvePublisherName(article, sourceRef);
}
