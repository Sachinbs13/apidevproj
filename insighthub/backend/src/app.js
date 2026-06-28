import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env.js';
import { swaggerSpec } from './config/swagger.js';
import { apiLimiter, apiKeyLimiter } from './middleware/rateLimiter.js';
import { apiKeyMiddleware } from './middleware/apiKey.middleware.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';
import newsRoutes from './routes/news.routes.js';
import trendingRoutes from './routes/trending.routes.js';
import sourcesRoutes from './routes/sources.routes.js';
import searchRoutes from './routes/search.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import authRoutes from './routes/auth.routes.js';
import preferencesRoutes from './routes/preferences.routes.js';
import briefRoutes from './routes/brief.routes.js';
import schemeRoutes from './routes/scheme.routes.js';
import regionRoutes from './routes/region.routes.js';
import languageRoutes from './routes/language.routes.js';
import userRoutes from './routes/user.routes.js';

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: env.corsOrigin, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(apiKeyMiddleware);
app.use(apiKeyLimiter);
app.use(apiLimiter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-docs.json', (_req, res) => res.json(swaggerSpec));

app.get('/health', (_req, res) => {
  res.json({ success: true, message: 'InsightHub API is running' });
});

app.use('/news', newsRoutes);
app.use('/trending', trendingRoutes);
app.use('/sources', sourcesRoutes);
app.use('/search', searchRoutes);
app.use('/analytics', analyticsRoutes);
app.use('/auth', authRoutes);
app.use('/preferences', preferencesRoutes);
app.use('/brief', briefRoutes);
app.use('/schemes', schemeRoutes);
app.use('/regions', regionRoutes);
app.use('/languages', languageRoutes);
app.use('/user', userRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
