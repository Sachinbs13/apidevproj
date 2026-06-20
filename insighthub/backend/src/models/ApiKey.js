import mongoose from 'mongoose';

const apiKeySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    keyHash: { type: String, required: true, select: false },
    prefix: { type: String, required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isActive: { type: Boolean, default: true },
    lastUsedAt: { type: Date },
    requestCount: { type: Number, default: 0 },
    expiresAt: { type: Date },
  },
  { timestamps: true },
);

export default mongoose.model('ApiKey', apiKeySchema);
