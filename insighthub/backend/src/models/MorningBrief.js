import mongoose from 'mongoose';

const briefDigestSchema = new mongoose.Schema(
  {
    digest2Min: { type: String, default: '' },
    digest5Min: { type: String, default: '' },
  },
  { _id: false }
);

const morningBriefSchema = new mongoose.Schema(
  {
    dateString: { type: String, required: true, unique: true, index: true }, // Format: "YYYY-MM-DD"
    briefs: {
      Student: { type: briefDigestSchema, default: () => ({}) },
      'Software Engineer': { type: briefDigestSchema, default: () => ({}) },
      Investor: { type: briefDigestSchema, default: () => ({}) },
      Farmer: { type: briefDigestSchema, default: () => ({}) },
      General: { type: briefDigestSchema, default: () => ({}) },
    },
  },
  { timestamps: true }
);

export default mongoose.model('MorningBrief', morningBriefSchema);
