import axios from 'axios';
import { TOKEN_KEY } from '../constants/routes.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const client = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function fetchNews(params = {}) {
  const { data } = await client.get('/news', { params });
  return data;
}

export async function fetchArticleById(id) {
  const { data } = await client.get(`/news/${id}`);
  return data;
}

export async function fetchSources() {
  const { data } = await client.get('/sources');
  return data;
}

export async function searchNews(params = {}) {
  const { data } = await client.get('/search', { params });
  return data;
}

export async function fetchTrending(params = {}) {
  const { data } = await client.get('/trending', { params });
  return data;
}

export async function fetchAnalytics() {
  const { data } = await client.get('/analytics');
  return data;
}

export async function compareByTopic(topic) {
  const { data } = await client.get('/news/compare', { params: { topic } });
  return data;
}

export async function registerUser(payload) {
  const { data } = await client.post('/auth/register', payload);
  return data;
}

export async function loginUser(payload) {
  const { data } = await client.post('/auth/login', payload);
  return data;
}

export async function savePreferences(payload) {
  const { data } = await client.post('/preferences', payload);
  return data;
}

export async function fetchProfile() {
  const { data } = await client.get('/auth/me');
  return data;
}

export async function fetchPersonalizedFeed(params = {}) {
  const { data } = await client.get('/news/feed/personalized', { params });
  return data;
}

export async function fetchTodayBrief(params = {}) {
  const { data } = await client.get('/brief/today', { params });
  return data;
}

export async function fetchTrendingRegions() {
  const { data } = await client.get('/regions/trending');
  return data;
}

export async function fetchRegionalAnalytics() {
  const { data } = await client.get('/regions/analytics');
  return data;
}

export async function fetchRecommendedSchemes() {
  const { data } = await client.get('/schemes/recommend');
  return data;
}

export async function fetchArticleSummary(id, lang) {
  const { data } = await client.get(`/news/summary/${id}`, { params: { lang } });
  return data;
}

export default client;
