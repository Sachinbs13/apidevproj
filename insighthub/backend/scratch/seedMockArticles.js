import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env variables
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

import Article from '../src/models/Article.js';
import Source from '../src/models/Source.js';
import MorningBrief from '../src/models/MorningBrief.js';
import { seedSources } from '../src/config/seedSources.js';
import { generateDailyBriefs } from '../src/services/brief.service.js';

const MOCK_ARTICLES = [
  {
    title: 'Bengaluru Tech Summit 2026 Spotlights AI and Quantum Inventions',
    description: 'Karnataka Chief Minister inaugurated the Bengaluru Tech Summit today, highlighting the state\'s leadership in artificial intelligence startup incubators and quantum coding hackathons. Several tech leaders from across the globe gathered to showcase cloud solutions.',
    content: 'Bengaluru is solidifying its status as the Silicon Valley of Asia. The summit featured hackathons, programming showcases, and seed funding grants for deep-tech software solutions.',
    url: 'https://karnatakatechsummit2026.org/news',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=60',
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    category: 'technology',
    sentiment: { score: 0.8, label: 'positive' },
    regionalInfo: {
      country: 'India',
      state: 'Karnataka',
      district: 'Bengaluru',
      city: 'Bengaluru'
    },
    schemeDetails: {
      isSchemeRelated: false,
      schemeName: '',
      eligibility: '',
      benefits: '',
      officialWebsite: ''
    }
  },
  {
    title: 'Startup India SISFS Grants Over ₹100 Crore in Seed Funding to 150 Tech Incubators',
    description: 'The Government of India has accelerated the Startup India Initiative, offering access to the Startup India Seed Fund Scheme (SISFS) for early-stage software and hardware startups across the country.',
    content: 'The Seed Fund Scheme provides financial grants to startups through approved incubators. Entrepreneurs can apply online for fast-tracked patents, 3-year tax exemptions, and structural credit support.',
    url: 'https://startupindia.gov.in/news/sisfs-2026',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=60',
    publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    category: 'business',
    sentiment: { score: 0.6, label: 'positive' },
    regionalInfo: {
      country: 'India',
      state: 'National',
      district: '',
      city: ''
    },
    schemeDetails: {
      isSchemeRelated: true,
      schemeName: 'Startup India Initiative',
      eligibility: 'DPIIT-recognized early-stage startups and Indian tech entrepreneurs.',
      benefits: 'Access to the ₹945 Crore Startup India Seed Fund (SISFS), 3-year tax exemption, and fast-tracked patent filings.',
      officialWebsite: 'https://www.startupindia.gov.in'
    }
  },
  {
    title: 'Mumbai Stock Exchange Index Nifty Reaches Record High on IT and Banking Rally',
    description: 'Mumbai shares witnessed an unprecedented rally today as market confidence surged following favorable RBI guidelines and GDP growth rates. Investors are highly optimistic about upcoming IPO listings.',
    content: 'The Sensex and Nifty indices surged over 2% today, driven by massive foreign portfolio investment in financial services and tech sectors.',
    url: 'https://mumbaifinancenews.in/nifty-record',
    imageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&auto=format&fit=crop&q=60',
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    category: 'business',
    sentiment: { score: 0.9, label: 'positive' },
    regionalInfo: {
      country: 'India',
      state: 'Maharashtra',
      district: 'Mumbai',
      city: 'Mumbai'
    },
    schemeDetails: {
      isSchemeRelated: false,
      schemeName: '',
      eligibility: '',
      benefits: '',
      officialWebsite: ''
    }
  },
  {
    title: 'PM-Kisan Installment Released: ₹20,000 Crore Disbursed to 10 Crore Indian Farmers',
    description: 'Prime Minister Narendra Modi released the latest installment of the PM Kisan Samman Nidhi scheme today, transferring benefits directly to zero-balance bank accounts of small and marginal landholding farmer families.',
    content: 'The PM-Kisan scheme offers direct income support to agriculture families. Farmers can check eligibility criteria, land registration logs, and payment status on the official welfare portal.',
    url: 'https://pmkisan.gov.in/news/17th-installment',
    imageUrl: 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?w=600&auto=format&fit=crop&q=60',
    publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    category: 'general',
    sentiment: { score: 0.7, label: 'positive' },
    regionalInfo: {
      country: 'India',
      state: 'National',
      district: '',
      city: ''
    },
    schemeDetails: {
      isSchemeRelated: true,
      schemeName: 'PM Kisan Samman Nidhi',
      eligibility: 'Small and marginal landholding farmer families across India.',
      benefits: 'Direct financial benefit of ₹6,000 per year paid in three equal installments of ₹2,000 directly to bank accounts.',
      officialWebsite: 'https://pmkisan.gov.in'
    }
  },
  {
    title: 'Delhi Air Quality Index Deteriorates as Winter Settles In, Government Issues Guidelines',
    description: 'Delhi pollution level hit the severe category today as heavy smog enveloped the NCR region. The Delhi government has advised citizens to wear masks and announced hybrid school schedules.',
    content: 'Stubble burning, low wind speeds, and vehicular emissions have compounded Delhi\'s seasonal pollution crisis. Health advisories have been issued across Connaught Place, Dwarka, and surrounding cities.',
    url: 'https://delhiairquality.in/winter-smog',
    imageUrl: 'https://images.unsplash.com/photo-1543333995-a78aea2eee50?w=600&auto=format&fit=crop&q=60',
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    category: 'general',
    sentiment: { score: -0.7, label: 'negative' },
    regionalInfo: {
      country: 'India',
      state: 'Delhi',
      district: 'Delhi',
      city: 'Delhi'
    },
    schemeDetails: {
      isSchemeRelated: false,
      schemeName: '',
      eligibility: '',
      benefits: '',
      officialWebsite: ''
    }
  },
  {
    title: 'Ayushman Bharat PM-JAY Extends Free Health Insurance to All Seniors Aged 70+',
    description: 'The Cabinet expanded the flagship Ayushman Bharat PM-JAY scheme, offering cashless secondary and tertiary hospitalization healthcare cover of up to ₹5 Lakh per year to all senior citizens regardless of income.',
    content: 'Eligible families identified via socio-economic caste metrics can download cards. The scheme benefits include critical surgeries, pharmacy costs, and diagnostic checkups at empanelled private hospitals.',
    url: 'https://pmjay.gov.in/news/expansion-70-plus',
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&auto=format&fit=crop&q=60',
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    category: 'health',
    sentiment: { score: 0.8, label: 'positive' },
    regionalInfo: {
      country: 'India',
      state: 'National',
      district: '',
      city: ''
    },
    schemeDetails: {
      isSchemeRelated: true,
      schemeName: 'Ayushman Bharat PM-JAY',
      eligibility: 'Low-income and vulnerable families identified via the Socio-Economic Caste Census (SECC).',
      benefits: 'Cashless health cover of up to ₹5 Lakh per family per year for secondary and tertiary care hospitalization.',
      officialWebsite: 'https://pmjay.gov.in'
    }
  },
  {
    title: 'PMAY Urban Allocates ₹40,000 Crore to Build 20 Lakh Houses for Low-Income Families',
    description: 'The Ministry of Housing and Urban Affairs has approved new fund disbursements under the Pradhan Mantri Awas Yojana (PMAY) urban housing scheme to build pucca houses for low-income and EWS families.',
    content: 'Families without permanent structures can apply online for interest subsidies or direct cash assistance. The welfare benefit aims to eradicate urban slum clusters by 2030.',
    url: 'https://pmaymis.gov.in/news/urban-housing-allocation',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=60',
    publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000), // 10 hours ago
    category: 'general',
    sentiment: { score: 0.5, label: 'positive' },
    regionalInfo: {
      country: 'India',
      state: 'National',
      district: '',
      city: ''
    },
    schemeDetails: {
      isSchemeRelated: true,
      schemeName: 'Pradhan Mantri Awas Yojana (PMAY)',
      eligibility: 'Urban and rural families belonging to EWS, LIG, or MIG categories without a pucca house.',
      benefits: 'Interest subsidy on home loans or direct financial assistance of up to ₹1.2 Lakh to build houses.',
      officialWebsite: 'https://pmaymis.gov.in'
    }
  },
  {
    title: 'Hyderabad IT Corridor Faces Stiff Water Scarcity as Summer Heat Hits Telangana Early',
    description: 'Water levels in reservoirs supplying Hyderabad have declined rapidly, triggering shortages across Gachibowli and Madhapur IT parks. Tech firms are rationing usage and implementing water recycling systems.',
    content: 'Telangana municipal bodies are preparing emergency borewells. Tech startups and cloud data centers in Hyderabad are urged to adopt greywater recycling systems.',
    url: 'https://telanganamunicipal.gov.in/news/hyderabad-water',
    imageUrl: 'https://images.unsplash.com/photo-1548247416-ec66f4900b2e?w=600&auto=format&fit=crop&q=60',
    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    category: 'general',
    sentiment: { score: -0.5, label: 'negative' },
    regionalInfo: {
      country: 'India',
      state: 'Telangana',
      district: 'Hyderabad',
      city: 'Hyderabad'
    },
    schemeDetails: {
      isSchemeRelated: false,
      schemeName: '',
      eligibility: '',
      benefits: '',
      officialWebsite: ''
    }
  },
  {
    title: 'Chennai Metro Phase 2 Tunneling Works Progress Speedily in Tamil Nadu',
    description: 'Chennai metro rail corporation reported successful tunnel completion under Chennai central and Maduravoyal. The Tamil Nadu government plans transit-oriented development hubs along the routes.',
    content: 'Tamil Nadu metro connectivity is on track for 2028. Phase 2 tunneling covers major business corridors in Chennai, reducing vehicular emissions and commute times.',
    url: 'https://chennaimetro.tn.gov.in/tunnels',
    imageUrl: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=600&auto=format&fit=crop&q=60',
    publishedAt: new Date(Date.now() - 14 * 60 * 60 * 1000), // 14 hours ago
    category: 'general',
    sentiment: { score: 0.4, label: 'positive' },
    regionalInfo: {
      country: 'India',
      state: 'Tamil Nadu',
      district: 'Chennai',
      city: 'Chennai'
    },
    schemeDetails: {
      isSchemeRelated: false,
      schemeName: '',
      eligibility: '',
      benefits: '',
      officialWebsite: ''
    }
  },
  {
    title: 'Gujarat Semiconductor Facility Near Gandhinagar Ready for Operational Testing',
    description: 'Gujarat semiconductor fab plant, supported by central incentives, is preparing its cleanrooms. Startups and tech leaders hail this development as a key milestone for hardware self-reliance.',
    content: 'Sanand semiconductor hub near Ahmedabad is transforming Gujarat into an electronics manufacturing state. Ingestion of raw silicone chips is expected by mid-year.',
    url: 'https://gujaratindustry.gov.in/semiconductor-ready',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=60',
    publishedAt: new Date(Date.now() - 16 * 60 * 60 * 1000), // 16 hours ago
    category: 'technology',
    sentiment: { score: 0.7, label: 'positive' },
    regionalInfo: {
      country: 'India',
      state: 'Gujarat',
      district: 'Gandhinagar',
      city: 'Gandhinagar'
    },
    schemeDetails: {
      isSchemeRelated: false,
      schemeName: '',
      eligibility: '',
      benefits: '',
      officialWebsite: ''
    }
  },
  {
    title: 'Monsoon Alert: IMD Forecasts Normal Rainfall, Direct Relief to Indian Farmers Expected',
    description: 'Indian Meteorological Department announced positive monsoon forecasts for crop-growing regions, relieving agriculture communities in Uttar Pradesh, Madhya Pradesh, and Punjab.',
    content: 'A normal monsoon ensures optimal crop sowing, boosting rural consumption. Fertilizers and crop seed distributions will be aligned with regional weather projections.',
    url: 'https://weatherforecast.in/monsoon-2026',
    imageUrl: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=600&auto=format&fit=crop&q=60',
    publishedAt: new Date(Date.now() - 18 * 60 * 60 * 1000), // 18 hours ago
    category: 'general',
    sentiment: { score: 0.6, label: 'positive' },
    regionalInfo: {
      country: 'India',
      state: 'Uttar Pradesh',
      district: 'Lucknow',
      city: 'Lucknow'
    },
    schemeDetails: {
      isSchemeRelated: false,
      schemeName: '',
      eligibility: '',
      benefits: '',
      officialWebsite: ''
    }
  },
  {
    title: 'RBI Keeps Repo Rate Unchanged at 6.5%, Focuses on Curbing Inflation Pressures',
    description: 'The Reserve Bank of India governor announced repo rate status quo today, citing stable GDP projections but keeping a close watch on inflation risks. Business organizations react neutrally.',
    content: 'RBI aims to balance credit growth with economic stability. IPO markets are expected to remain stable, while home loan interest rates will persist at current averages.',
    url: 'https://rbinews.org/monetary-policy-june2026',
    imageUrl: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=600&auto=format&fit=crop&q=60',
    publishedAt: new Date(Date.now() - 20 * 60 * 60 * 1000), // 20 hours ago
    category: 'business',
    sentiment: { score: 0.1, label: 'neutral' },
    regionalInfo: {
      country: 'India',
      state: 'National',
      district: '',
      city: ''
    },
    schemeDetails: {
      isSchemeRelated: false,
      schemeName: '',
      eligibility: '',
      benefits: '',
      officialWebsite: ''
    }
  }
];

async function seed() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Database connected.');

    // Seed sources first
    console.log('Seeding sources...');
    await seedSources();

    // Get seeded sources
    const sources = await Source.find();
    if (sources.length === 0) {
      throw new Error('Sources seeding failed.');
    }

    const newsApiSource = sources.find(s => s.slug === 'newsapi') || sources[0];
    const gnewsSource = sources.find(s => s.slug === 'gnews') || sources[0];
    const guardianSource = sources.find(s => s.slug === 'guardian') || sources[0];

    // Clear existing articles
    console.log('Clearing existing articles...');
    await Article.deleteMany({});
    console.log('Existing articles cleared.');

    // Save articles with source references
    console.log('Injecting articles...');
    for (const data of MOCK_ARTICLES) {
      // Map mock sources (some single, some multi-source for dedup test)
      const articleSources = [];
      
      // All articles have NewsAPI as source
      articleSources.push({
        sourceId: newsApiSource._id,
        sourceName: newsApiSource.name,
        originalUrl: data.url,
        fetchedAt: new Date()
      });

      // Business and Tech articles have multiple sources to simulate deduplication aggregation
      if (data.category === 'business' || data.category === 'technology') {
        articleSources.push({
          sourceId: gnewsSource._id,
          sourceName: gnewsSource.name,
          originalUrl: data.url + '?ref=gnews',
          fetchedAt: new Date()
        });

        if (data.title.includes('Bengaluru') || data.title.includes('SISFS')) {
          articleSources.push({
            sourceId: guardianSource._id,
            sourceName: guardianSource.name,
            originalUrl: data.url + '?ref=guardian',
            fetchedAt: new Date()
          });
        }
      }

      // Generate dynamic multilingual summaries based on title/description
      const aiSummaries = {
        English: data.description,
        Hindi: `[हिंदी सारांश] यह समाचार ${data.category} श्रेणी में है। "${data.title.slice(0, 80)}..." अधिक विवरण और पूर्ण लेख के लिए मूल लिंक पर जाएं।`,
        Kannada: `[ಕನ್ನಡ ಸಾರಾಂಶ] ಈ ಸುದ್ದಿ ${data.category} ವಿಭಾಗಕ್ಕೆ ಸಂಬಂಧಿಸಿದೆ. "${data.title.slice(0, 80)}..." ಹೆಚ್ಚಿನ ವಿವರಗಳಿಗಾಗಿ ಮೂಲ ಲಿಂಕ್ ಕ್ಲಿಕ್ ಮಾಡಿ.`,
        Tamil: `[தமிழ் சுருக்கம்] இந்த செய்தி ${data.category} வகையைச் சார்ந்தது. "${data.title.slice(0, 80)}..." மேலும் விவரങ്ങൾക്ക് அசல் இணைப்பைத் தொடர்பு கொள்ளவும்.`,
        Telugu: `[తెలుగు సారాంశం] ఈ వార్త ${data.category} రంగానికి సంబంధించినది. "${data.title.slice(0, 80)}..." మరిన్ని వివరాల కోసం అసలు లింక్ చూడండి.`,
        Malayalam: `[മലയാളം സംഗ്രഹം] ഈ വാർത്ത ${data.category} വിഭാഗത്തിലുള്ളതാണ്. "${data.title.slice(0, 80)}..." കൂടുതൽ വിവരങ്ങൾക്ക് യഥാർത്ഥ ലിങ്ക് സന്ദർശിക്കുക.`
      };

      const hash = Buffer.from(data.title).toString('base64').slice(0, 32);

      await Article.create({
        ...data,
        hash,
        sources: articleSources,
        aiSummaries
      });
    }

    console.log(`Successfully seeded ${MOCK_ARTICLES.length} mock articles.`);

    // Clear morning briefs
    console.log('Clearing old morning briefs...');
    await MorningBrief.deleteMany({});

    // Pre-generate morning briefs for today
    const todayStr = new Date().toISOString().split('T')[0];
    console.log(`Pre-generating morning briefs for date: ${todayStr}...`);
    await generateDailyBriefs(todayStr);
    console.log('Morning briefs generated.');

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
