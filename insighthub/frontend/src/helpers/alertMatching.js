function capitalize(value) {
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function articleMatchesTopic(article, topic) {
  if (!topic) return false;
  const regex = new RegExp(topic, 'i');
  return (
    regex.test(article.title || '') ||
    regex.test(article.description || '') ||
    regex.test(article.category || '')
  );
}

export function articleMatchesCategory(article, category) {
  if (!category) return false;
  return (article.category || '').toLowerCase() === category.toLowerCase();
}

export function getSubscriptionMatches(article, topics, categories, { isBreakingEvent = false } = {}) {
  const matches = [];
  const seen = new Set();

  for (const category of categories) {
    if (articleMatchesCategory(article, category)) {
      const key = `category:${category}`;
      if (!seen.has(key)) {
        seen.add(key);
        matches.push({ type: 'category', value: category, label: capitalize(category) });
      }
    }
  }

  for (const topic of topics) {
    if (topic === 'breaking' && isBreakingEvent) {
      const key = 'topic:breaking';
      if (!seen.has(key)) {
        seen.add(key);
        matches.push({ type: 'topic', value: 'breaking', label: 'Breaking' });
      }
      continue;
    }

    if (articleMatchesTopic(article, topic)) {
      const key = `topic:${topic}`;
      if (!seen.has(key)) {
        seen.add(key);
        matches.push({ type: 'topic', value: topic, label: capitalize(topic) });
      }
    }
  }

  return matches;
}

export function formatBreakingReason(reason) {
  if (!reason) return null;

  if (reason.startsWith('source_spike:')) {
    const source = reason.replace('source_spike:', '').trim();
    return `Trending on ${source}`;
  }

  const labels = {
    multi_source_coverage: 'Covered by multiple sources',
    cross_source_story: 'Picked up across outlets',
    breaking_keyword: 'Breaking headline',
  };

  return labels[reason] || reason.replace(/_/g, ' ');
}

export function formatSubscriptionAlertReason({ matches, breakingReason }) {
  const matchText = matches.map((match) => match.label).join(', ');

  if (breakingReason && matchText) {
    return `${formatBreakingReason(breakingReason)} · Matched ${matchText}`;
  }

  if (breakingReason) {
    return formatBreakingReason(breakingReason);
  }

  if (matchText) {
    return `Matched ${matchText}`;
  }

  return null;
}

export function hasActiveSubscriptions(topics, categories) {
  return topics.length > 0 || categories.length > 0;
}
