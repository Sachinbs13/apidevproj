export const ROUTES = {
  FEED: '/',
  SEARCH: '/search',
  TRENDING: '/trending',
  COMPARE: '/compare',
  ANALYTICS: '/analytics',
  ALERTS: '/alerts',
  LOGIN: '/login',
  PREFERENCES: '/preferences',
  LOCAL: '/local',
  SCHEMES: '/schemes',
  BRIEF: '/brief',
};

export const NAV_ITEMS = [
  { label: 'Feed', path: ROUTES.FEED },
  { label: 'Morning Brief', path: ROUTES.BRIEF },
  { label: 'Local Heatmap', path: ROUTES.LOCAL },
  { label: 'Gov Schemes', path: ROUTES.SCHEMES },
  { label: 'Search', path: ROUTES.SEARCH },
  { label: 'Trending', path: ROUTES.TRENDING },
  { label: 'Compare', path: ROUTES.COMPARE },
  { label: 'Analytics', path: ROUTES.ANALYTICS },
  { label: 'Alerts', path: ROUTES.ALERTS },
];

export const SOURCE_STATUS = {
  ACTIVE: 'active',
  DEGRADED: 'degraded',
  DOWN: 'down',
};

export const TOKEN_KEY = 'insighthub_token';
export const USER_KEY = 'insighthub_user';
