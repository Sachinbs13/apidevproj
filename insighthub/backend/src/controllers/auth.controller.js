import User from '../models/User.js';
import ApiKey from '../models/ApiKey.js';
import { signToken } from '../utils/jwt.js';
import { generateApiKey, hashApiKey } from '../utils/generateApiKey.js';

function formatUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    preferences: user.preferences,
  };
}

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    const user = await User.create({ name, email, password });
    const token = signToken({ id: user._id, email: user.email, role: user.role });

    res.status(201).json({
      success: true,
      data: { user: formatUser(user), token },
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = signToken({ id: user._id, email: user.email, role: user.role });

    res.json({
      success: true,
      data: { user: formatUser(user), token },
    });
  } catch (error) {
    next(error);
  }
}

export async function savePreferences(req, res, next) {
  try {
    const { topics, sources, occupation, state, district, preferredLanguage } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (topics !== undefined) {
      if (!Array.isArray(topics)) {
        return res.status(400).json({ success: false, message: 'topics must be an array' });
      }
      user.preferences.topics = topics.map((t) => String(t).trim()).filter(Boolean);
    }

    if (sources !== undefined) {
      if (!Array.isArray(sources)) {
        return res.status(400).json({ success: false, message: 'sources must be an array' });
      }
      user.preferences.sources = sources.map((s) => String(s).trim()).filter(Boolean);
    }

    if (occupation !== undefined) {
      const allowedOccupations = ['Student', 'Software Engineer', 'Investor', 'Farmer', 'General'];
      if (!allowedOccupations.includes(occupation)) {
        return res.status(400).json({ success: false, message: 'Invalid occupation preference' });
      }
      user.preferences.occupation = occupation;
    }

    if (state !== undefined) {
      user.preferences.state = String(state).trim();
    }

    if (district !== undefined) {
      user.preferences.district = String(district).trim();
    }

    if (preferredLanguage !== undefined) {
      const allowedLanguages = ['English', 'Hindi', 'Kannada', 'Tamil', 'Telugu', 'Malayalam'];
      if (!allowedLanguages.includes(preferredLanguage)) {
        return res.status(400).json({ success: false, message: 'Invalid preferred language' });
      }
      user.preferences.preferredLanguage = preferredLanguage;
    }

    await user.save();

    res.json({
      success: true,
      data: { preferences: user.preferences },
    });
  } catch (error) {
    next(error);
  }
}

export async function createApiKey(req, res, next) {
  try {
    const { name } = req.body;
    if (!name?.trim()) {
      return res.status(400).json({ success: false, message: 'API key name is required' });
    }

    const { plainKey, prefix } = generateApiKey();
    const keyHash = await hashApiKey(plainKey);

    const apiKey = await ApiKey.create({
      name: name.trim(),
      keyHash,
      prefix,
      userId: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: {
        id: apiKey._id,
        name: apiKey.name,
        prefix: apiKey.prefix,
        key: plainKey,
        message: 'Store this key securely — it will not be shown again',
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function listApiKeys(req, res, next) {
  try {
    const keys = await ApiKey.find({ userId: req.user.id })
      .select('name prefix isActive lastUsedAt requestCount createdAt')
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, data: keys });
  } catch (error) {
    next(error);
  }
}

export async function revokeApiKey(req, res, next) {
  try {
    const apiKey = await ApiKey.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { isActive: false },
      { new: true },
    );

    if (!apiKey) {
      return res.status(404).json({ success: false, message: 'API key not found' });
    }

    res.json({ success: true, message: 'API key revoked' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid API key ID' });
    }
    next(error);
  }
}

export async function getProfile(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: formatUser(user) });
  } catch (error) {
    next(error);
  }
}
