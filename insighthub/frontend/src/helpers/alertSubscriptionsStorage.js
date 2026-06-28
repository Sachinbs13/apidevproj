const STORAGE_PREFIX = 'insighthub_alert_subs';

function storageKey(userId) {
  return `${STORAGE_PREFIX}_${userId}`;
}

export function loadAlertSubscriptions(userId) {
  if (!userId) {
    return { topics: [], categories: [] };
  }

  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) {
      return { topics: [], categories: [] };
    }

    const parsed = JSON.parse(raw);
    return {
      topics: Array.isArray(parsed.topics) ? parsed.topics.map((t) => String(t).toLowerCase().trim()) : [],
      categories: Array.isArray(parsed.categories)
        ? parsed.categories.map((c) => String(c).toLowerCase().trim())
        : [],
    };
  } catch {
    return { topics: [], categories: [] };
  }
}

export function saveAlertSubscriptions(userId, { topics, categories }) {
  if (!userId) return;

  localStorage.setItem(
    storageKey(userId),
    JSON.stringify({
      topics: topics || [],
      categories: categories || [],
    }),
  );
}

export function clearAlertSubscriptions(userId) {
  if (!userId) return;
  localStorage.removeItem(storageKey(userId));
}
