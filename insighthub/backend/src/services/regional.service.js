// Mapping of Indian states and their prominent cities/districts for NLP keyword matching.
const stateKeywords = {
  Karnataka: ['karnataka', 'bengaluru', 'bangalore', 'mysore', 'mysuru', 'hubli', 'mangaluru', 'belagavi', 'dharwad'],
  Maharashtra: ['maharashtra', 'mumbai', 'pune', 'nagpur', 'thane', 'nasik', 'nashik', 'aurangabad', 'solapur'],
  'Tamil Nadu': ['tamil nadu', 'chennai', 'coimbatore', 'madurai', 'trichy', 'salem', 'tirunelveli'],
  Telangana: ['telangana', 'hyderabad', 'warangal', 'nizamabad', 'karimnagar'],
  Kerala: ['kerala', 'kochi', 'cochin', 'trivandrum', 'thiruvananthapuram', 'calicut', 'kozhikode', 'thrissur'],
  Delhi: ['delhi', 'new delhi', 'ncr', 'dwarka', 'connaught place'],
  Gujarat: ['gujarat', 'ahmedabad', 'surat', 'vadodara', 'gandhinagar', 'rajkot'],
  'Andhra Pradesh': ['andhra pradesh', 'visakhapatnam', 'vizag', 'vijayawada', 'guntur', 'tirupati'],
  'Uttar Pradesh': ['uttar pradesh', 'lucknow', 'noida', 'kanpur', 'ghaziabad', 'agra', 'varanasi', 'prayagraj'],
  'West Bengal': ['west bengal', 'kolkata', 'calcutta', 'howrah', 'darjeeling', 'durgapur'],
  Bihar: ['bihar', 'patna', 'gaya', 'muzaffarpur', 'bhagalpur'],
  Haryana: ['haryana', 'gurugram', 'gurgaon', 'faridabad', 'panipat', 'ambala'],
  Punjab: ['punjab', 'ludhiana', 'amritsar', 'jalandhar', 'patiala', 'chandigarh'],
  Rajasthan: ['rajasthan', 'jaipur', 'jodhpur', 'udaipur', 'kota', 'ajmer'],
  'Madhya Pradesh': ['madhya pradesh', 'indore', 'bhopal', 'jabalpur', 'gwalior'],
};

// Sub-mapping to extract specific cities/districts
const cityKeywords = {
  bengaluru: 'Bengaluru',
  bangalore: 'Bengaluru',
  mysore: 'Mysore',
  mangaluru: 'Mangaluru',
  belagavi: 'Belagavi',
  mumbai: 'Mumbai',
  pune: 'Pune',
  nagpur: 'Nagpur',
  chennai: 'Chennai',
  coimbatore: 'Coimbatore',
  hyderabad: 'Hyderabad',
  kochi: 'Kochi',
  trivandrum: 'Thiruvananthapuram',
  thiruvananthapuram: 'Thiruvananthapuram',
  delhi: 'Delhi',
  'new delhi': 'Delhi',
  ahmedabad: 'Ahmedabad',
  surat: 'Surat',
  gandhinagar: 'Gandhinagar',
  visakhapatnam: 'Visakhapatnam',
  vizag: 'Visakhapatnam',
  lucknow: 'Lucknow',
  noida: 'Noida',
  kolkata: 'Kolkata',
  patna: 'Patna',
  gurugram: 'Gurugram',
  gurgaon: 'Gurugram',
  jaipur: 'Jaipur',
  indore: 'Indore',
  bhopal: 'Bhopal',
};

export function extractRegionalInfo(title = '', description = '', content = '') {
  const fullText = `${title} ${description} ${content}`.toLowerCase();

  let matchedState = 'National';
  let matchedCity = '';

  // Check state & city keywords
  for (const [state, keywords] of Object.entries(stateKeywords)) {
    for (const word of keywords) {
      // Use boundary-aware search to prevent partial matching (e.g., matching "in" to "India" or "delhi" in some words)
      const regex = new RegExp(`\\b${word}\\b`, 'i');
      if (regex.test(fullText)) {
        matchedState = state;
        // Search if we can match a specific city from the text
        for (const [cityKey, cityVal] of Object.entries(cityKeywords)) {
          if (new RegExp(`\\b${cityKey}\\b`, 'i').test(fullText)) {
            matchedCity = cityVal;
            break;
          }
        }
        break;
      }
    }
    if (matchedState !== 'National') break;
  }

  // Fallback check: if specific state keywords weren't hit, but general Indian news markers are hit
  const isIndiaRelated = 
    matchedState !== 'National' || 
    /\bindia\b|\bindian\b|\bbharat\b/i.test(fullText);

  return {
    country: isIndiaRelated ? 'India' : 'International',
    state: matchedState,
    district: matchedCity, // Store city as district for local intelligence
    city: matchedCity,
  };
}

export default { extractRegionalInfo };
