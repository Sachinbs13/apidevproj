export const HOME_CATEGORIES = [
  { id: 'top', label: 'Top Headlines', params: {} },
  { id: 'national', label: 'National', params: { state: 'National' } },
  { id: 'international', label: 'International', searchQuery: 'international world global' },
  { id: 'business', label: 'Business', params: { category: 'business' } },
  { id: 'technology', label: 'Technology', params: { category: 'technology' } },
  { id: 'sports', label: 'Sports', params: { category: 'sports' } },
  { id: 'entertainment', label: 'Entertainment', params: { category: 'entertainment' } },
  { id: 'health', label: 'Health', params: { category: 'health' } },
  { id: 'science', label: 'Science', params: { category: 'science' } },
];

export function getCategoryById(id) {
  return HOME_CATEGORIES.find((c) => c.id === id) || HOME_CATEGORIES[0];
}
