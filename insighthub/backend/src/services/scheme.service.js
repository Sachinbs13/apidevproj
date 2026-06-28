const preDefinedSchemes = [
  {
    keys: ['pm-kisan', 'kisan samman', 'pmkisan'],
    name: 'PM Kisan Samman Nidhi',
    eligibility: 'Small and marginal landholding farmer families across India.',
    benefits: 'Direct financial benefit of ₹6,000 per year paid in three equal installments of ₹2,000 directly to bank accounts.',
    website: 'https://pmkisan.gov.in'
  },
  {
    keys: ['awas yojana', 'pm-awas', 'pmay', 'housing scheme'],
    name: 'Pradhan Mantri Awas Yojana (PMAY)',
    eligibility: 'Urban and rural families belonging to EWS, LIG, or MIG categories without a pucca house.',
    benefits: 'Interest subsidy on home loans or direct financial assistance of up to ₹1.2 Lakh to build houses.',
    website: 'https://pmaymis.gov.in'
  },
  {
    keys: ['startup india', 'seed fund', 'incubator grant', 'startup scheme'],
    name: 'Startup India Initiative',
    eligibility: 'DPIIT-recognized early-stage startups and Indian tech entrepreneurs.',
    benefits: 'Access to the ₹945 Crore Startup India Seed Fund (SISFS), 3-year tax exemption, and fast-tracked patent filings.',
    website: 'https://www.startupindia.gov.in'
  },
  {
    keys: ['scholarship', 'post-matric', 'pre-matric', 'fellowship', 'nsp scholarship'],
    name: 'National Scholarship Schemes',
    eligibility: 'Students from low-income families, minority groups, or SC/ST/OBC categories pursuing secondary or higher education.',
    benefits: 'Direct tuition fee reimbursement and academic maintenance allowances ranging from ₹1,000 to ₹50,000 per year.',
    website: 'https://scholarships.gov.in'
  },
  {
    keys: ['ayushman bharat', 'pm-jay', 'pmjay', 'health insurance scheme'],
    name: 'Ayushman Bharat PM-JAY',
    eligibility: 'Low-income and vulnerable families identified via the Socio-Economic Caste Census (SECC).',
    benefits: 'Cashless health cover of up to ₹5 Lakh per family per year for secondary and tertiary care hospitalization.',
    website: 'https://pmjay.gov.in'
  },
  {
    keys: ['jan dhan', 'pmjdy', 'zero balance account'],
    name: 'Pradhan Mantri Jan Dhan Yojana (PMJDY)',
    eligibility: 'Any Indian citizen aged 10 years or older who does not already have a bank account.',
    benefits: 'Basic savings account with zero balance requirement, RuPay card, ₹2 Lakh accident insurance, and ₹10,000 overdraft facility.',
    website: 'https://pmjdy.gov.in'
  }
];

export function detectGovernmentScheme(title = '', description = '', content = '') {
  const fullText = `${title} ${description} ${content}`.toLowerCase();

  // Try to match a pre-defined scheme
  for (const scheme of preDefinedSchemes) {
    for (const key of scheme.keys) {
      const regex = new RegExp(`\\b${key}\\b`, 'i');
      if (regex.test(fullText)) {
        return {
          isSchemeRelated: true,
          schemeName: scheme.name,
          eligibility: scheme.eligibility,
          benefits: scheme.benefits,
          officialWebsite: scheme.website
        };
      }
    }
  }

  // Fallback dynamic detection for generic schemes/yojanas
  if (/\byojana\b|\bscheme\b|\bsubsidy\b|\bgrants\b/i.test(fullText)) {
    // Try to extract dynamic scheme name (e.g. words preceding 'Yojana')
    let dynamicName = 'Government Welfare Scheme';
    const yojanaMatch = title.match(/([A-Z][a-z\-]+(?:\s+[A-Z][a-z\-]+)*\s+Yojana)/);
    const schemeMatch = title.match(/([A-Z][a-z\-]+(?:\s+[A-Z][a-z\-]+)*\s+Scheme)/);

    if (yojanaMatch && yojanaMatch[1]) {
      dynamicName = yojanaMatch[1];
    } else if (schemeMatch && schemeMatch[1]) {
      dynamicName = schemeMatch[1];
    }

    return {
      isSchemeRelated: true,
      schemeName: dynamicName,
      eligibility: 'Dependent on scheme specific sector guidelines. Please refer to official government portal.',
      benefits: 'Financial subsidy, resources distribution, or educational scholarship grants support.',
      officialWebsite: 'https://www.india.gov.in/my-government/schemes'
    };
  }

  return {
    isSchemeRelated: false,
    schemeName: '',
    eligibility: '',
    benefits: '',
    officialWebsite: ''
  };
}

export default { detectGovernmentScheme };
