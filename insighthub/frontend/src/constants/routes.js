export const ROUTES = {
  HOME: '/',
  FEED: '/',
  ARTICLE: '/news/:id',
  SEARCH: '/search',
  TRENDING: '/trending',
  ALERTS: '/alerts',
  LOGIN: '/login',
  ANALYTICS: '/analytics',
  COMPARE: '/compare',
  BRIEF: '/brief',
  LOCAL: '/local',
  SCHEMES: '/schemes',
  PREFERENCES: '/preferences',
  PROFILE: '/profile',
};

export function articlePath(id) {
  return `/news/${id}`;
}

export const NAV_ITEMS = [
  { label: 'Home', path: ROUTES.HOME },
  { label: 'Trending', path: ROUTES.TRENDING },
  { label: 'Search', path: ROUTES.SEARCH },
  { label: 'Alerts', path: ROUTES.ALERTS, auth: true },
];

export const SOURCE_STATUS = {
  ACTIVE: 'active',
  DEGRADED: 'degraded',
  DOWN: 'down',
};

export const TOKEN_KEY = 'insighthub_token';
export const USER_KEY = 'insighthub_user';
