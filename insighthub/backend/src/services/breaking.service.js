import { env } from '../config/env.js';

export function detectBreakingArticle(result, article, fetchContext) {
  const { saved, sourceName } = fetchContext;
  const sourceCount = article?.sources?.length || 0;

  if (result.action === 'merged' && sourceCount >= 3) {
    return { isBreaking: true, reason: 'multi_source_coverage' };
  }

  if (result.action === 'created' && sourceCount >= 2) {
    return { isBreaking: true, reason: 'cross_source_story' };
  }

  if (saved >= env.breakingSpikeThreshold) {
    return { isBreaking: true, reason: `source_spike:${sourceName}` };
  }

  const keywords = env.breakingKeywords;
  const title = (article?.title || '').toLowerCase();
  if (keywords.some((kw) => title.includes(kw))) {
    return { isBreaking: true, reason: 'breaking_keyword' };
  }

  return { isBreaking: false };
}

export default { detectBreakingArticle };
