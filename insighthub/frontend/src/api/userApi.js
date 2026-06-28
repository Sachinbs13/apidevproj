import client from './newsApi.js';

export async function recordReadingHistory(articleId) {
  const { data } = await client.post(`/user/history/${articleId}`);
  return data;
}

export async function fetchReadingHistory(params = {}) {
  const { data } = await client.get('/user/history', { params });
  return data;
}

export async function saveArticle(articleId) {
  const { data } = await client.post(`/user/saved/${articleId}`);
  return data;
}

export async function unsaveArticle(articleId) {
  const { data } = await client.delete(`/user/saved/${articleId}`);
  return data;
}

export async function fetchSavedArticles(params = {}) {
  const { data } = await client.get('/user/saved', { params });
  return data;
}

export async function fetchSavedStatus(articleId) {
  const { data } = await client.get(`/user/saved/${articleId}/status`);
  return data;
}
