import Article from '../models/Article.js';
import { buildTitleFingerprint } from '../utils/hashArticle.js';
import { tokenizeTitle } from '../utils/tokenizeTitle.js';
import { similarityScore } from '../utils/similarityScore.js';
import { env } from '../config/env.js';
import logger from '../utils/logger.js';

function getLookbackDate() {
  const days = env.dedupLookbackDays;
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

export async function findSimilarArticle(normalized) {
  const { tokens, hash } = buildTitleFingerprint(normalized.title);

  const exactMatch = await Article.findOne({ hash });
  if (exactMatch) {
    return { article: exactMatch, score: 1, method: 'hash' };
  }

  const urlMatch = await Article.findOne({ url: normalized.url });
  if (urlMatch) {
    return { article: urlMatch, score: 1, method: 'url' };
  }

  const candidates = await Article.find({
    publishedAt: { $gte: getLookbackDate() },
  })
    .select('title titleTokens hash url sources description content imageUrl')
    .limit(500)
    .lean();

  let bestMatch = null;
  let bestScore = 0;

  for (const candidate of candidates) {
    const candidateTokens =
      candidate.titleTokens?.length > 0 ? candidate.titleTokens : tokenizeTitle(candidate.title);
    const score = similarityScore(tokens, candidateTokens);

    if (score >= env.dedupSimilarityThreshold && score > bestScore) {
      bestMatch = candidate;
      bestScore = score;
    }
  }

  if (bestMatch) {
    const article = await Article.findById(bestMatch._id);
    return { article, score: bestScore, method: 'similarity' };
  }

  return null;
}

function enrichArticleFields(existing, normalized) {
  if (!existing.description && normalized.description) {
    existing.description = normalized.description;
  }
  if (!existing.content && normalized.content) {
    existing.content = normalized.content;
  }
  if (!existing.imageUrl && normalized.imageUrl) {
    existing.imageUrl = normalized.imageUrl;
  }
  if (!existing.author && normalized.author) {
    existing.author = normalized.author;
  }
}

export async function mergeSourceRef(existing, normalized, sourceRef) {
  const alreadyLinked = existing.sources.some(
    (ref) => ref.sourceId.toString() === sourceRef.sourceId.toString(),
  );

  if (alreadyLinked) {
    return { action: 'skipped', reason: 'already_linked' };
  }

  enrichArticleFields(existing, normalized);
  existing.sources.push(sourceRef);

  if (!existing.titleTokens?.length) {
    existing.titleTokens = buildTitleFingerprint(existing.title).tokens;
  }

  await existing.save();
  return { action: 'merged', article: existing };
}

export async function createArticle(normalized, sourceRef) {
  const { tokens, hash } = buildTitleFingerprint(normalized.title);

  const article = await Article.create({
    ...normalized,
    hash,
    titleTokens: tokens,
    sources: [sourceRef],
  });

  return { action: 'created', article };
}

export async function processIncomingArticle(normalized, sourceRef) {
  const match = await findSimilarArticle(normalized);

  if (match) {
    const result = await mergeSourceRef(match.article, normalized, sourceRef);
    if (result.action === 'merged') {
      logger.debug('Dedup merged article', {
        title: normalized.title,
        method: match.method,
        score: match.score,
      });
    }
    return result;
  }

  return createArticle(normalized, sourceRef);
}

export async function deduplicateExistingArticles() {
  const articles = await Article.find().sort({ publishedAt: 1 });
  let merged = 0;
  let skipped = 0;

  for (const article of articles) {
    if (!article.titleTokens?.length) {
      article.titleTokens = buildTitleFingerprint(article.title).tokens;
      article.hash = buildTitleFingerprint(article.title).hash;
      await article.save();
    }
  }

  const sorted = await Article.find().sort({ publishedAt: 1 });

  for (let i = 0; i < sorted.length; i += 1) {
    const current = sorted[i];
    if (!current) continue;

    for (let j = i + 1; j < sorted.length; j += 1) {
      const candidate = sorted[j];
      if (!candidate) continue;

      const score = similarityScore(
        current.titleTokens || tokenizeTitle(current.title),
        candidate.titleTokens || tokenizeTitle(candidate.title),
      );

      if (score >= env.dedupSimilarityThreshold) {
        for (const ref of candidate.sources) {
          const exists = current.sources.some(
            (r) => r.sourceId.toString() === ref.sourceId.toString(),
          );
          if (!exists) {
            current.sources.push(ref);
          }
        }

        enrichArticleFields(current, candidate);
        await current.save();
        await Article.deleteOne({ _id: candidate._id });
        sorted[j] = null;
        merged += 1;
      }
    }
  }

  return { merged, skipped };
}

export default {
  findSimilarArticle,
  mergeSourceRef,
  createArticle,
  processIncomingArticle,
  deduplicateExistingArticles,
};
