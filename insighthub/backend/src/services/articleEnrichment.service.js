import { scoreSentiment } from './sentiment.service.js';
import { autoTagCategory } from './categoryTagger.service.js';
import { extractRegionalInfo } from './regional.service.js';
import { detectGovernmentScheme } from './scheme.service.js';

export function enrichArticle(article) {
  const text = article.description || article.content || article.title || '';
  const sentiment = scoreSentiment(text);
  const { category, autoTagged } = autoTagCategory(
    article.title,
    article.description,
    article.category,
  );

  const regionalInfo = extractRegionalInfo(article.title, article.description, article.content);
  const schemeDetails = detectGovernmentScheme(article.title, article.description, article.content);

  // Initialize basic default summaries
  const aiSummaries = {
    English: article.description || article.title || 'No description available.',
    Hindi: '',
    Kannada: '',
    Tamil: '',
    Telugu: '',
    Malayalam: ''
  };

  return {
    ...article,
    category,
    autoTagged,
    sentiment,
    regionalInfo,
    schemeDetails,
    aiSummaries
  };
}

export default { enrichArticle };
