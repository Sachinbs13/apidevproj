export const STALE_TIME = {
  NEWS: 60 * 1000,
  TRENDING: 2 * 60 * 1000,
  BRIEF: 5 * 60 * 1000,
  LOCAL: 90 * 1000,
  SEARCH: 60 * 1000,
  ANALYTICS: 3 * 60 * 1000,
  ARTICLE: 2 * 60 * 1000,
  USER: 30 * 1000,
};

export const queryKeys = {
  news: {
    all: ['news'],
    feed: (params) => ['news', 'feed', params],
  },
  trending: {
    all: ['trending'],
    list: (limit) => ['trending', 'list', limit],
    topics: (limit) => ['trending', 'topics', limit],
    mostRead: (limit) => ['trending', 'mostRead', limit],
  },
  brief: {
    all: ['brief'],
    today: (lang, occupation) => ['brief', 'today', lang, occupation],
  },
  local: {
    all: ['local'],
    news: (state, city, page, limit) => ['local', state, city, page, limit],
  },
  search: {
    all: ['search'],
    query: (q, page, limit) => ['search', q, page, limit],
  },
  article: {
    all: ['article'],
    detail: (id) => ['article', 'detail', id],
    compare: (topic) => ['article', 'compare', topic],
    summary: (id, lang) => ['article', 'summary', id, lang],
  },
  user: {
    all: ['user'],
    saved: (page, limit) => ['user', 'saved', page, limit],
    history: (page, limit) => ['user', 'history', page, limit],
    savedStatus: (articleId) => ['user', 'savedStatus', articleId],
  },
  analytics: {
    all: ['analytics'],
    summary: () => ['analytics', 'summary'],
  },
};
