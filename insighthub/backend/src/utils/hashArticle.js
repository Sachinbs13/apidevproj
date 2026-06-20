import { tokenizeTitle } from './tokenizeTitle.js';

export function hashArticle(title = '') {
  return tokenizeTitle(title).sort().join('|');
}

export function buildTitleFingerprint(title = '') {
  const tokens = tokenizeTitle(title);
  return {
    tokens,
    hash: tokens.sort().join('|'),
  };
}
