# InsightHub — Improvements & Future Features

A prioritized backlog of enhancements, fixes, and new features for the current codebase. Use this as a roadmap for portfolio iteration, academic extension, or production hardening.

**Legend:** 🟢 Quick win · 🟡 Medium effort · 🔴 Large effort

---

## Table of contents

1. [Improvements to existing code](#improvements-to-existing-code)
2. [Additional features](#additional-features)
3. [Suggested priority order](#suggested-priority-order)

---

## Improvements to existing code

### Testing & quality

| # | Item | Effort | Notes |
|---|------|--------|-------|
| 1 | **Add unit tests (backend)** | 🔴 | No tests exist today. Start with `dedup.service`, `normalizer`, `sentiment`, `categoryTagger`, `trending` score logic using Vitest or Jest. |
| 2 | **Add integration tests (API)** | 🔴 | Supertest for `/news`, `/search`, `/auth/register`, `/auth/login`. Use `mongodb-memory-server` in CI. |
| 3 | **Add frontend component tests** | 🟡 | Vitest + React Testing Library for `ArticleCard`, `Feed`, auth flows. |
| 4 | **E2E tests** | 🔴 | Playwright or Cypress: login → feed → search → subscribe to topic alert. |
| 5 | **Pre-commit hooks** | 🟢 | Husky + lint-staged to run ESLint/Prettier before commits. |
| 6 | **Stricter TypeScript migration** | 🔴 | Optional but strong portfolio signal — migrate backend/frontend to `.ts` incrementally. |

### Performance & scalability

| # | Item | Effort | Notes |
|---|------|--------|-------|
| 7 | **Optimize dedup candidate lookup** | 🟡 | `findSimilarArticle` loads up to 500 articles per incoming item. Replace with indexed hash lookup + optional vector/LSH index, or narrow by date + category first. |
| 8 | **Batch article inserts** | 🟡 | Ingestion loops one `processIncomingArticle` at a time. Use bulk writes where safe to cut Mongo round-trips. |
| 9 | **Redis cache stampede protection** | 🟡 | Add lock key or stale-while-revalidate when trending/analytics cache expires under load. |
| 10 | **Frontend code splitting** | 🟢 | Vite build warns about 700KB+ bundle. Lazy-load `Analytics`, `Compare`, Recharts routes with `React.lazy`. |
| 11 | **Pagination cursor-based API** | 🟡 | Replace offset pagination on `/news` with cursor (`publishedAt` + `_id`) for large datasets. |
| 12 | **WebSocket room scan optimization** | 🟡 | `getSubscribedTopics` iterates all Socket.io rooms on every `emitNewsUpdate`. Maintain an in-memory topic registry updated on subscribe/unsubscribe. |
| 13 | **MongoDB connection pooling tuning** | 🟢 | Explicit pool size, retry writes, and index review (compound indexes for common feed filters). |

### Security & reliability

| # | Item | Effort | Notes |
|---|------|--------|-------|
| 14 | **Input validation layer** | 🟡 | Add `zod` or `joi` schemas for all POST/query params instead of ad-hoc checks in controllers. |
| 15 | **Refresh tokens + token rotation** | 🟡 | JWT-only auth with long expiry; add refresh token flow and httpOnly cookie option. |
| 16 | **Password reset / email verification** | 🟡 | Nodemailer or SendGrid for forgot-password and verify-email flows. |
| 17 | **Rate limit by API key tier** | 🟡 | `ApiKey` model could store `rateLimit` per key; enforce in middleware. |
| 18 | **Helmet + CSP for production** | 🟢 | CSP is disabled for Swagger; split prod vs dev helmet config. |
| 19 | **Graceful shutdown** | 🟢 | Handle `SIGTERM` — close HTTP server, Socket.io, MongoDB, Redis, stop cron jobs cleanly. |
| 20 | **Secrets in production** | 🟢 | Document use of Render/Railway secret managers; never rely on `.env` in Docker prod without override. |

### Architecture & code health

| # | Item | Effort | Notes |
|---|------|--------|-------|
| 21 | **Service layer consistency** | 🟡 | Move DB logic out of controllers (`search`, `news`) into dedicated services mirroring `analytics.service`. |
| 22 | **Centralized API response format** | 🟢 | Wrapper helper `{ success, data, meta, error }` to reduce duplication. |
| 23 | **Error codes enum** | 🟢 | Standard error codes (`AUTH_INVALID`, `SOURCE_DOWN`) for frontend handling. |
| 24 | **Analytics Events model** | 🟡 | Mentioned in original architecture (`project-steps.md`) but never implemented — track page views, searches, WS connects. |
| 25 | **Structured request logging** | 🟢 | Morgan or pino-http middleware with request ID correlation. |
| 26 | **OpenAPI completeness** | 🟡 | WebSocket events are in YAML extension only; add request/response schemas and auth examples to Swagger. |

### DevOps & deployment

| # | Item | Effort | Notes |
|---|------|--------|-------|
| 27 | **Docker Compose full stack** | 🟡 | Add frontend service to `docker-compose.yml` with nginx or serve built `dist`. |
| 28 | **Health check depth** | 🟢 | `/health` should report MongoDB + Redis status (ready vs degraded). |
| 29 | **CI: run tests + Mongo/Redis services** | 🟡 | Extend `.github/workflows/ci.yml` once tests exist. |
| 30 | **Staging environment** | 🟡 | Separate Render/Vercel preview deployments per PR. |
| 31 | **Database migrations** | 🟡 | Use `migrate-mongo` for schema changes instead of ad-hoc Mongoose updates. |
| 32 | **Monitoring & alerting** | 🔴 | Sentry for errors, Uptime Robot / Better Stack for `/health`, optional Datadog metrics. |

### Frontend UX polish

| # | Item | Effort | Notes |
|---|------|--------|-------|
| 33 | **Article detail page** | 🟢 | Route `/news/:id` in frontend — API exists, UI does not. |
| 34 | **Dark/light theme toggle** | 🟢 | Tailwind `dark` class toggle persisted in localStorage. |
| 35 | **Skeleton loaders** | 🟢 | Replace spinner-only states with content skeletons on Feed/Trending. |
| 36 | **Empty & error states** | 🟢 | Illustrations or consistent empty-state components across pages. |
| 37 | **Mobile navigation** | 🟡 | Sidebar hidden on mobile; hamburger drawer would improve UX. |
| 38 | **Preferences → Alerts sync** | 🟡 | Auto-subscribe WS topics from saved user preferences on login. |
| 39 | **API key management UI** | 🟡 | Backend has `/auth/api-keys`; no frontend page to create/revoke keys. |
| 40 | **Offline / reconnect banner** | 🟢 | Show persistent banner when WebSocket disconnects with retry status. |

### Data & ingestion

| # | Item | Effort | Notes |
|---|------|--------|-------|
| 41 | **Article TTL / archival** | 🟡 | Cron job to archive or delete articles older than N days to control DB size. |
| 42 | **Retry queue for failed fetches** | 🟡 | BullMQ or simple Mongo queue when source ingestion fails instead of only logging. |
| 43 | **Per-source fetch metrics dashboard** | 🟢 | Expose `metadata.lastFetchStats` in `/sources` health response on frontend. |
| 44 | **Smarter category tagging** | 🟡 | Replace keyword lists with TF-IDF or a lightweight ML classifier trained on labeled headlines. |
| 45 | **Improved sentiment** | 🟡 | AFINN is basic; consider VADER or a small transformer model for better accuracy. |
| 46 | **Image proxy / fallback** | 🟢 | Many article images break due to hotlinking; proxy or store thumbnails in S3/Cloudinary. |

---

## Additional features

### User & personalization

| Feature | Description | Effort |
|---------|-------------|--------|
| **Saved articles / bookmarks** | Let users bookmark articles; `User.savedArticles[]` + UI on Feed. | 🟡 |
| **Personalized feed** | Rank feed by user `preferences.topics` and `preferences.sources`. | 🟡 |
| **Email digest** | Daily/weekly email of top stories matching user topics (SendGrid + cron). | 🔴 |
| **Notification history** | Log breaking alerts and topic matches per user in DB; Alerts page history tab. | 🟡 |
| **OAuth login** | Google / GitHub sign-in via Passport.js alongside email/password. | 🟡 |
| **User roles & admin panel** | Admin dashboard to manage sources, users, API keys, force re-fetch. | 🔴 |

### News & analytics

| Feature | Description | Effort |
|---------|-------------|--------|
| **Topic clusters** | Group similar articles into "story clusters" with a cluster ID and timeline view. | 🔴 |
| **Entity extraction** | Extract people, places, organizations from titles (compromise / spaCy microservice). | 🔴 |
| **Trend comparison over time** | Chart how a topic's article volume changed over 7/30 days. | 🟡 |
| **Source bias / coverage comparison** | Show which sources cover a topic most and sentiment split per source. | 🟡 |
| **Word cloud / keyword trends** | Top keywords in trending window, updated live. | 🟡 |
| **Geographic filtering** | Tag articles by region; filter feed by country/region. | 🔴 |
| **Export data** | CSV/JSON export of search results or analytics for a date range. | 🟢 |
| **Public embed widget** | Embeddable iframe or JS widget showing trending headlines for external sites. | 🟡 |

### Real-time & alerts

| Feature | Description | Effort |
|---------|-------------|--------|
| **Push notifications (browser)** | Web Push API for breaking news when tab is inactive. | 🟡 |
| **Slack / Discord webhooks** | Send breaking or topic alerts to a configured webhook URL per user. | 🟡 |
| **Alert rules engine** | Complex rules: "notify if topic X AND sentiment negative AND 3+ sources". | 🔴 |
| **Source spike dashboard** | Visualize when a single source publishes unusually many articles. | 🟡 |
| **Read receipts / live reader count** | Show how many users are viewing a trending story (Socket.io presence). | 🟡 |

### API & integrations

| Feature | Description | Effort |
|---------|-------------|--------|
| **GraphQL API** | Apollo Server layer over existing services for flexible client queries. | 🔴 |
| **Webhook subscriptions for developers** | External apps register URLs to receive `news_update` POST payloads. | 🟡 |
| **API usage dashboard** | Per API key: requests/day, rate limit graph, top endpoints. | 🟡 |
| **More news sources** | Reuters, AP, Bing News, MediaStack, custom RSS manager UI. | 🟡 |
| **RSS source manager UI** | CRUD for RSS feeds without editing env vars or DB directly. | 🟡 |
| **OpenAPI client SDK** | Auto-generate TypeScript SDK from Swagger for third-party consumers. | 🟢 |

### AI & advanced NLP

| Feature | Description | Effort |
|---------|-------------|--------|
| **AI article summary** | Summarize long articles via OpenAI / Gemini API on ingest or on demand. | 🟡 |
| **Duplicate detection v2** | Embedding-based similarity (OpenAI embeddings + cosine) instead of token Jaccard. | 🔴 |
| **Chat with your news** | RAG pipeline: embed articles, answer natural language questions over the corpus. | 🔴 |
| **Auto-generated tags** | Multi-label tags (e.g. `ai`, `startup`, `regulation`) beyond single category. | 🟡 |
| **Misinformation flagging** | Cross-source consistency score; flag single-source sensational headlines. | 🔴 |

### Mobile & PWA

| Feature | Description | Effort |
|---------|-------------|--------|
| **Progressive Web App** | Service worker, manifest, install prompt, offline cached feed. | 🟡 |
| **React Native / Expo app** | Mobile client reusing existing REST + WS API. | 🔴 |
| **Responsive images** | Srcset and lazy loading for article thumbnails across devices. | 🟢 |

### Infrastructure

| Feature | Description | Effort |
|---------|-------------|--------|
| **Kubernetes manifests** | Helm chart for backend, MongoDB, Redis — beyond Docker Compose. | 🔴 |
| **Horizontal scaling** | Socket.io Redis adapter for multi-instance WS; sticky sessions on load balancer. | 🔴 |
| **Read replicas** | MongoDB read preference for search/analytics; write primary for ingestion. | 🔴 |
| **CDN for frontend** | CloudFront / Cloudflare in front of Vercel or S3 static hosting. | 🟡 |
| **Backup & restore scripts** | Automated MongoDB backups to S3 with documented restore procedure. | 🟡 |

---

## Suggested priority order

If you want maximum impact for a portfolio or viva demo, tackle in this order:

### Phase A — Quick wins (1–2 days)
1. Article detail page (`/news/:id` UI)
2. Frontend lazy loading / code split
3. Graceful shutdown + deep health check
4. Husky pre-commit hooks
5. API key management UI
6. Export search results as JSON

### Phase B — Quality & credibility (1 week)
7. Backend unit tests for dedup + normalizer
8. Input validation with Zod
9. Service layer refactor for controllers
10. Preferences → Alerts auto-subscribe
11. Docker Compose with frontend included

### Phase C — Stand-out features (2+ weeks)
12. Topic clusters / story timeline view
13. Personalized feed from user preferences
14. Webhook subscriptions for developers
15. AI summaries on demand
16. Browser push notifications for breaking news

### Phase D — Production grade (ongoing)
17. Integration + E2E test suite
18. Socket.io Redis adapter for scaling
19. Monitoring (Sentry + uptime)
20. Analytics Events pipeline
21. Embedding-based dedup v2

---

## Gaps in current implementation (fix vs feature)

These are incomplete relative to the original spec or best practice — worth fixing before adding new scope:

- **Analytics Events** collection referenced in architecture diagram but not built
- **No automated tests** in CI (lint + import check only)
- **`requireApiKeyOrAuth`** middleware exists but is not wired to any route
- **Frontend** does not use `/news/:id` despite backend support
- **Recharts v2** is deprecated — plan upgrade to v3
- **Dedup** may miss duplicates when >500 candidates exist in the lookback window
- **NewsAPI free tier** cannot run on cloud IP — document limitation or use RSS-only in deployed demo

---

## Contributing ideas

When picking items, label PRs/issues with:

- `improvement` — refactor, perf, security, tests
- `feature` — new user-facing capability
- `infra` — Docker, CI, deployment, monitoring

Update this file as items are completed or reprioritized.
