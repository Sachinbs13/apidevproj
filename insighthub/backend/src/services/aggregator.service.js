import Source from '../models/Source.js';
import { normalizeArticle } from './normalizer.service.js';
import { processIncomingArticle } from './dedup.service.js';
import { enrichArticle } from './articleEnrichment.service.js';
import { recordFetchSuccess, recordFetchFailure } from './sourceHealth.service.js';
import { invalidateFeedCaches } from './cache.service.js';
import { detectBreakingArticle } from './breaking.service.js';
import { emitNewsUpdate, emitBreaking } from '../websocket/handlers.js';
import { fetchNewsApiArticles } from './sources/newsapi.service.js';
import { fetchGNewsArticles } from './sources/gnews.service.js';
import { fetchGuardianArticles } from './sources/guardian.service.js';
import { fetchNytArticles } from './sources/nyt.service.js';
import { fetchCurrentsArticles } from './sources/currents.service.js';
import { fetchRssArticles } from './sources/rss.service.js';
import logger from '../utils/logger.js';

async function fetchArticlesForSource(source) {
  switch (source.type) {
    case 'newsapi':
      return fetchNewsApiArticles();
    case 'gnews':
      return fetchGNewsArticles();
    case 'guardian':
      return fetchGuardianArticles();
    case 'nyt':
      return fetchNytArticles();
    case 'currents':
      return fetchCurrentsArticles();
    case 'rss':
      return fetchRssArticles(source.metadata?.feedUrl);
    default:
      throw new Error(`No fetcher for source type: ${source.type}`);
  }
}

function handleArticleEvents(result, source, savedCounter) {
  if (!result.article || result.action === 'skipped') return;

  emitNewsUpdate(result.article);

  const breaking = detectBreakingArticle(result, result.article, {
    saved: savedCounter,
    sourceName: source.name,
  });

  if (breaking.isBreaking) {
    emitBreaking(result.article, breaking.reason);
  }
}

export async function ingestFromSource(sourceSlug) {
  const source = await Source.findOne({ slug: sourceSlug });
  if (!source) {
    throw new Error(`Source not found: ${sourceSlug}`);
  }

  if (source.status === 'down') {
    logger.warn(`Skipping ingestion for down source: ${source.name}`);
    return { saved: 0, merged: 0, skipped: 0, total: 0, status: 'down' };
  }

  try {
    const { articles: rawArticles, rateLimitRemaining } = await fetchArticlesForSource(source);

    let saved = 0;
    let merged = 0;
    let skipped = 0;

    for (const raw of rawArticles) {
      const normalized = normalizeArticle(raw, source.type);
      if (!normalized) {
        skipped += 1;
        continue;
      }

      const enriched = enrichArticle(normalized);

      const sourceRef = {
        sourceId: source._id,
        sourceName: source.name,
        originalUrl: normalized.url,
        fetchedAt: new Date(),
      };

      const result = await processIncomingArticle(enriched, sourceRef);

      if (result.action === 'created') saved += 1;
      else if (result.action === 'merged') merged += 1;
      else skipped += 1;

      handleArticleEvents(result, source, saved);
    }

    const total = rawArticles.length;
    await recordFetchSuccess(source, {
      total,
      saved,
      merged,
      skipped,
      rateLimitRemaining,
    });

    if (saved > 0 || merged > 0) {
      await invalidateFeedCaches();
    }

    logger.info(`Ingested from ${source.name}`, { saved, merged, skipped, total });
    return { saved, merged, skipped, total, dedupRatio: source.dedupRatio };
  } catch (error) {
    await recordFetchFailure(source, error);
    logger.error(`Ingestion failed for ${source.name}`, { error: error.message });
    throw error;
  }
}

export async function ingestAll() {
  const sources = await Source.find({ status: { $ne: 'down' } });
  const results = {};

  for (const source of sources) {
    try {
      results[source.slug] = await ingestFromSource(source.slug);
    } catch (error) {
      results[source.slug] = { error: error.message };
    }
  }

  return results;
}

export default { ingestFromSource, ingestAll };
