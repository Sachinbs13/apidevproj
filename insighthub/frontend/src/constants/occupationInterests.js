export const OCCUPATIONS = [
  'Student',
  'Teacher',
  'Government Employee',
  'Software Engineer',
  'Investor',
  'Farmer',
  'General',
];

export const OCCUPATION_INTERESTS = {
  Student: ['placements', 'scholarships', 'exams', 'hackathons', 'ai', 'internships'],
  Teacher: ['education', 'universities', 'research', 'grants', 'curriculum'],
  'Government Employee': ['orders', 'circulars', 'recruitment', 'policies', 'schemes'],
  'Software Engineer': ['ai', 'programming', 'cloud', 'startups', 'developer'],
  Investor: ['stock market', 'ipo', 'rbi', 'economy', 'finance'],
  Farmer: ['agriculture', 'weather', 'crops', 'government schemes', 'monsoon'],
  General: ['technology', 'politics', 'business', 'science', 'health', 'sports'],
};

export const SUGGESTED_TOPICS = [
  'technology',
  'politics',
  'business',
  'science',
  'health',
  'sports',
];

export const SUGGESTED_SOURCES = ['currents', 'newsapi', 'gnews', 'guardian', 'nyt', 'rss-hindu'];

export const LANGUAGES = ['English', 'Hindi', 'Kannada', 'Tamil', 'Telugu', 'Malayalam'];

export function getInterestsForOccupation(occupation) {
  return OCCUPATION_INTERESTS[occupation] || OCCUPATION_INTERESTS.General;
}
