import { scoreSentiment } from './sentiment.service.js';
import { autoTagCategory } from './categoryTagger.service.js';

export function enrichArticle(article) {
  const text = article.description || article.content || article.title || '';
  const sentiment = scoreSentiment(text);
  const { category, autoTagged } = autoTagCategory(
    article.title,
    article.description,
    article.category,
  );

  return {
    ...article,
    category,
    autoTagged,
    sentiment,
  };
}

export default { enrichArticle };
