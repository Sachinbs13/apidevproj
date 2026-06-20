import mongoose from 'mongoose';

const SOURCE_TYPES = ['newsapi', 'gnews', 'guardian', 'nyt', 'rss'];
const SOURCE_STATUSES = ['active', 'degraded', 'down'];

const sourceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true, index: true },
    type: { type: String, enum: SOURCE_TYPES, required: true },
    baseUrl: { type: String, default: '' },
    status: { type: String, enum: SOURCE_STATUSES, default: 'active' },
    lastFetchedAt: { type: Date },
    pollingIntervalMinutes: { type: Number, default: 15 },
    cronExpression: { type: String, default: '*/15 * * * *' },
    rateLimitRemaining: { type: Number },
    dedupRatio: { type: Number, default: 0 },
    articlesFetched: { type: Number, default: 0 },
    lastError: { type: String, default: '' },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true },
);

export { SOURCE_TYPES, SOURCE_STATUSES };
export default mongoose.model('Source', sourceSchema);
