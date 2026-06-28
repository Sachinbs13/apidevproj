import mongoose from 'mongoose';

const sourceRefSchema = new mongoose.Schema(
  {
    sourceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Source', required: true },
    sourceName: { type: String, required: true },
    originalUrl: { type: String, required: true },
    fetchedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    content: { type: String, default: '' },
    url: { type: String, required: true },
    imageUrl: { type: String, default: '' },
    publishedAt: { type: Date, required: true },
    category: { type: String, default: 'general', index: true },
    autoTagged: { type: Boolean, default: false },
    author: { type: String, default: '' },
    sentiment: {
      score: { type: Number, default: 0 },
      label: { type: String, enum: ['positive', 'negative', 'neutral'], default: 'neutral' },
    },
    hash: { type: String, index: true },
    titleTokens: { type: [String], default: [] },
    sources: [sourceRefSchema],
    regionalInfo: {
      country: { type: String, default: 'India' },
      state: { type: String, default: 'National', index: true },
      district: { type: String, default: '' },
      city: { type: String, default: '' }
    },
    schemeDetails: {
      isSchemeRelated: { type: Boolean, default: false, index: true },
      schemeName: { type: String, default: '' },
      eligibility: { type: String, default: '' },
      benefits: { type: String, default: '' },
      officialWebsite: { type: String, default: '' }
    },
    aiSummaries: {
      English: { type: String, default: '' },
      Hindi: { type: String, default: '' },
      Kannada: { type: String, default: '' },
      Tamil: { type: String, default: '' },
      Telugu: { type: String, default: '' },
      Malayalam: { type: String, default: '' }
    }
  },
  { timestamps: true },
);

articleSchema.index({ title: 'text', description: 'text', content: 'text' });
articleSchema.index({ publishedAt: -1 });
articleSchema.index({ url: 1 }, { unique: true });

export default mongoose.model('Article', articleSchema);
