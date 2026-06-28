# InsightHub — Multi-API News Analytics System
> MERN Stack · REST API + WebSockets · Project Reference

---

## Architecture overview

```
[ External News Sources ]
  NewsAPI.org · GNews · The Guardian · NYT · RSS Feeds
          |
          v
[ Aggregation Engine — Node.js ]
  Fetch Scheduler (node-cron)
  Normalizer (unified schema)
  Dedup Engine (cosine similarity / Jaccard hashing)
          |
          v
[ MongoDB ]
  Articles · Sources · Users · Analytics Events
          |
        /   \
       v     v
[ REST API ]     [ WebSocket Layer ]
  Express.js       Socket.io
  CRUD endpoints   Real-time push events
       \         /
        v       v
     [ React Frontend ]
  Feed · Search · Trending · Analytics · Alerts
```

---

## Tech stack

| Category       | Technology                          |
|----------------|-------------------------------------|
| Runtime        | Node.js 20+                         |
| Framework      | Express.js                          |
| Database       | MongoDB + Mongoose ODM              |
| Real-time      | Socket.io                           |
| Scheduling     | node-cron                           |
| Frontend       | React 18 + Vite + Tailwind CSS      |
| Routing        | React Router v6                     |
| State          | Redux Toolkit                       |
| HTTP client    | Axios                               |
| Auth           | jsonwebtoken + bcryptjs             |
| Caching        | Redis (ioredis)                     |
| Docs           | Swagger UI + swagger-jsdoc          |
| DevOps         | Docker + GitHub Actions             |

---

## Backend packages

| Package                  | Purpose                                  |
|--------------------------|------------------------------------------|
| `express`                | REST API framework                       |
| `mongoose`               | MongoDB ODM                              |
| `socket.io`              | WebSocket server                         |
| `node-cron`              | Fetch scheduling                         |
| `axios`                  | HTTP requests to news APIs               |
| `rss-parser`             | RSS feed ingestion                       |
| `natural`                | NLP tokenizer for dedup similarity       |
| `jsonwebtoken`           | JWT auth                                 |
| `bcryptjs`               | Password hashing                         |
| `express-rate-limit`     | API rate limiting                        |
| `ioredis`                | Redis client for caching                 |
| `swagger-jsdoc`          | OpenAPI spec generation                  |
| `swagger-ui-express`     | API docs UI                              |
| `dotenv`                 | Env config                               |
| `winston`                | Structured logging                       |
| `cors`                   | Cross-origin headers                     |
| `helmet`                 | Security headers                         |

## Frontend packages

| Package                  | Purpose                                  |
|--------------------------|------------------------------------------|
| `react`                  | UI library                               |
| `react-dom`              | DOM renderer                             |
| `react-router-dom`       | Client-side routing                      |
| `@reduxjs/toolkit`       | State management                         |
| `react-redux`            | React Redux bindings                     |
| `socket.io-client`       | WebSocket client                         |
| `axios`                  | REST API calls                           |
| `recharts`               | Analytics charts                         |
| `tailwindcss`            | Utility CSS                              |
| `vite`                   | Build tool                               |
| `react-hot-toast`        | Live event notifications                 |

---

## File structure

### Backend — `insighthub/backend/`

```
src/
├── config/
│   ├── db.js                  # Mongoose connection
│   ├── env.js                 # Validated env vars
│   └── socket.js              # Socket.io init
│
├── controllers/
│   ├── news.controller.js
│   ├── search.controller.js
│   ├── analytics.controller.js
│   └── auth.controller.js
│
├── models/
│   ├── Article.js             # Unified article schema
│   ├── Source.js              # Source health + metadata
│   └── User.js                # Preferences + JWT
│
├── routes/
│   ├── news.routes.js
│   ├── search.routes.js
│   ├── analytics.routes.js
│   └── auth.routes.js
│
├── services/
│   ├── sources/
│   │   ├── newsapi.service.js
│   │   ├── gnews.service.js
│   │   ├── guardian.service.js
│   │   ├── nyt.service.js
│   │   └── rss.service.js
│   ├── aggregator.service.js  # Orchestrates all sources
│   ├── dedup.service.js       # Similarity hashing + merge
│   ├── normalizer.service.js  # Unified schema mapping
│   ├── trending.service.js
│   └── sentiment.service.js
│
├── jobs/
│   └── fetchScheduler.js      # node-cron entry point
│
├── middleware/
│   ├── auth.middleware.js
│   ├── rateLimiter.js
│   └── errorHandler.js
│
├── websocket/
│   ├── handlers.js            # Event emit helpers
│   └── rooms.js               # Topic room management
│
├── utils/
│   ├── hashArticle.js
│   ├── cosineSimilarity.js
│   └── logger.js
│
├── app.js                     # Express setup
└── server.js                  # HTTP + WS listen

.env
package.json
```

### Frontend — `insighthub/frontend/`

```
src/
├── api/
│   ├── newsApi.js             # Axios REST wrappers
│   └── socket.js              # Socket.io client singleton
│
├── components/
│   ├── ui/
│   │   ├── ArticleCard.jsx
│   │   ├── SourceBadge.jsx
│   │   └── StatusPill.jsx
│   └── layout/
│       ├── Navbar.jsx
│       └── Sidebar.jsx
│
├── pages/
│   ├── Feed.jsx               # Main news feed
│   ├── Search.jsx
│   ├── Trending.jsx           # Live WS dashboard
│   ├── Compare.jsx            # Multi-source view
│   ├── Analytics.jsx
│   ├── Alerts.jsx             # Topic subscriptions
│   └── Login.jsx
│
├── hooks/
│   ├── useNews.js
│   ├── useSocket.js
│   └── useTrending.js
│
├── context/
│   ├── AuthContext.jsx
│   └── SocketContext.jsx
│
├── store/
│   ├── newsSlice.js           # Redux Toolkit slice
│   └── authSlice.js
│
├── App.jsx
└── main.jsx

index.html
vite.config.js
package.json
```

---

## Feature phases

Status legend: `[ ]` = To do · `[~]` = In progress · `[x]` = Done

---

### Phase 1 — Foundation & core ingestion

- [x] Project scaffolding (MERN boilerplate, ESLint, Prettier, env setup)
- [x] MongoDB schema design — Article, Source, User models
- [x] NewsAPI.org integration (fetch + normalize)
- [x] GNews API integration (fetch + normalize)
- [x] The Guardian API integration (fetch + normalize)
- [x] Unified article schema normalizer
- [x] node-cron scheduler (configurable polling interval per source)
- [x] Basic REST: GET /news (paginated), GET /sources

---

### Phase 2 — Deduplication engine

- [x] Title similarity hashing (Jaccard / cosine on token sets)
- [x] Dedup pipeline — compare incoming article against stored hashes
- [x] Source merging — one article record, multiple source refs
- [x] Dedup ratio tracking per source stored in DB
- [x] NYT API integration + dedup pass
- [x] RSS feed parser (rss-parser) for generic feeds
- [x] Source health tracker (status, rate-limit remaining, last fetched)

---

### Phase 3 — Full REST API

- [x] GET /news/:id — single article with all source variants
- [x] GET /search?q= — full-text search (MongoDB text index)
- [x] GET /trending — top stories by score in rolling time window
- [x] GET /analytics — dedup rate, category breakdown, source stats
- [x] GET /news/compare?topic= — same story from multiple sources
- [x] POST /preferences — save user topic/source preferences
- [x] JWT auth middleware (register, login, protected routes)
- [x] API key system for external consumers
- [x] Request rate limiting (express-rate-limit)
- [x] Swagger / OpenAPI docs (swagger-jsdoc + swagger-ui-express)

---

### Phase 4 — WebSocket layer

- [x] Socket.io server setup integrated with Express
- [x] live:news_update — push new articles on ingestion
- [x] live:trending — trending score push every N minutes
- [x] live:breaking — high-priority articles (source spike detection)
- [x] subscribe:topic — per-client keyword/category subscriptions
- [x] live:source_status — push on source down / rate-limited
- [x] WS auth via JWT handshake on connect
- [x] Room-based broadcasting (one room per topic/category)

---

### Phase 5 — React frontend (portfolio demo)

- [x] Vite + React setup, Tailwind, React Router
- [x] News feed page with category filters and pagination
- [x] Full-text search page
- [x] Trending dashboard with live WS updates
- [x] Source comparison view (same story, multiple sources)
- [x] Analytics dashboard (dedup rate, source health, category charts)
- [x] Topic alert subscription UI (WS subscribe:topic)
- [x] Auth pages (login, register, preferences)

---

### Phase 6 — Polish & deployment

- [x] Redis caching for trending scores and frequent queries
- [x] Sentiment scoring on article descriptions (natural / compromise)
- [x] Category auto-tagging pipeline
- [x] Dockerize backend + MongoDB
- [x] CI/CD pipeline (GitHub Actions)
- [x] Deploy backend to Railway / Render, frontend to Vercel
- [x] Environment secrets management (.env, dotenv-safe)

---

## REST API endpoints reference

| Method | Endpoint                   | Description                              |
|--------|----------------------------|------------------------------------------|
| GET    | `/news`                    | Paginated feed (filter by category, date, source) |
| GET    | `/news/:id`                | Single article with all source variants  |
| GET    | `/search?q=`               | Full-text search                         |
| GET    | `/trending`                | Top stories by score in time window      |
| GET    | `/sources`                 | Active sources + health status           |
| GET    | `/analytics`               | Dedup rate, category breakdown, stats    |
| GET    | `/news/compare?topic=`     | Same story from multiple sources         |
| POST   | `/preferences`             | Save user topic/source preferences       |
| POST   | `/auth/register`           | Register new user                        |
| POST   | `/auth/login`              | Login, returns JWT                       |

---

## WebSocket events reference

| Event                | Direction      | Description                              |
|----------------------|----------------|------------------------------------------|
| `live:news_update`   | Server → Client | New article pushed on ingestion          |
| `live:trending`      | Server → Client | Trending score update every N minutes    |
| `live:breaking`      | Server → Client | High-priority article detected           |
| `live:source_status` | Server → Client | Source went down or hit rate limit       |
| `subscribe:topic`    | Client → Server | Subscribe to a keyword or category       |
| `unsubscribe:topic`  | Client → Server | Unsubscribe from a topic                 |

---

## Future improvements

- **TanStack React Query** — Implemented in `frontend/src/queries/`. See README “Client-side caching” for details.
- Persist query cache across tab reloads via `sessionStorage` (optional enhancement).
