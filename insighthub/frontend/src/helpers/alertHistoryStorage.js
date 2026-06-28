const STORAGE_PREFIX = 'insighthub_alert_history';

function storageKey(userId) {
  return `${STORAGE_PREFIX}_${userId}`;
}

export function loadAlertHistory(userId) {
  if (!userId) return [];

  try {
    const raw = sessionStorage.getItem(storageKey(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveAlertHistory(userId, alerts) {
  if (!userId) return;
  sessionStorage.setItem(storageKey(userId), JSON.stringify(alerts.slice(0, 30)));
}

export function clearAlertHistory(userId) {
  if (!userId) return;
  sessionStorage.removeItem(storageKey(userId));
}
