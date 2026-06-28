import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    preferences: {
      topics: { type: [String], default: [] },
      sources: { type: [String], default: [] },
      occupation: {
        type: String,
        enum: [
          'Student',
          'Teacher',
          'Government Employee',
          'Software Engineer',
          'Investor',
          'Farmer',
          'General',
        ],
        default: 'General',
      },
      state: { type: String, default: 'National' },
      district: { type: String, default: '' },
      interests: { type: [String], default: [] },
      preferredLanguage: {
        type: String,
        enum: ['English', 'Hindi', 'Kannada', 'Tamil', 'Telugu', 'Malayalam'],
        default: 'English',
      },
      onboardingCompleted: { type: Boolean, default: false },
    },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    library: {
      savedArticles: [
        {
          articleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Article' },
          savedAt: { type: Date, default: Date.now },
        },
      ],
      readingHistory: [
        {
          articleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Article' },
          viewedAt: { type: Date, default: Date.now },
        },
      ],
    },
  },
  { timestamps: true },
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model('User', userSchema);
