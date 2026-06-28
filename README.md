# InsightHub

**Co-authored by Sachin**

India-focused news intelligence platform that aggregates headlines from multiple APIs, deduplicates overlapping stories, enriches articles with regional metadata and sentiment, and delivers them through a REST API, WebSocket live feed, and React dashboard.

## Features

- **Multi-source ingestion** — Currents API, NewsAPI, GNews, The Guardian, NYT, RSS feeds
- **Deduplication engine** — Jaccard + cosine similarity, source merging
- **India intelligence** — Regional tagging, occupation-based briefs, personalized feed, local news by state/city
- **REST API** — Feed, search, trending, local news, article detail, user library (saved/history)
- **WebSockets** — Live news, trending, breaking alerts, brief updates, topic/category subscriptions
- **React dashboard** — Home (brief + local + schemes + feed), trending, search, alerts, article detail
- **Redis caching** — Trending, search, local, brief, and frequent queries
- **Auth & onboarding** — JWT, preferences, occupation/interests chips at registration
- **Docker & CI** — `docker compose` stack, GitHub Actions pipeline

## App navigation

| Route | Description |
|-------|-------------|
| `/` | Home — Today's Brief, local news, personalized/global feed |
| `/trending` | Breaking, top topics, most read, ranked stories |
| `/search` | Full-text search |
| `/alerts` | Topic alert presets with filtered live notifications (auth required) |
| `/news/:id` | Article detail with source comparison and save |
| `/analytics` | Portfolio analytics page (not in main nav) |

Legacy routes redirect: `/brief`, `/local`, `/schemes`, `/compare`, `/preferences`, `/profile` → Home or Search.

**Signed-in utilities:** saved articles (navbar bookmark), subscription alerts (navbar bell, persisted in localStorage/sessionStorage).

## Tech stack

| Layer | Technologies |
|-------|----------------|
| Backend | Node.js 20+, Express, MongoDB, Mongoose, Socket.io, Redis, node-cron |
| Frontend | React 18, Vite, Tailwind CSS, Redux Toolkit, TanStack React Query, Recharts |
| DevOps | Docker, GitHub Actions, Render / Railway / Vercel configs |

## Project structure

```
apidevproj/
├── insighthub/
│   ├── backend/          # Express API + WebSocket server
│   ├── frontend/         # React SPA
│   └── docker-compose.yml
├── .github/workflows/    # CI pipeline
├── project-steps.md      # Build phases & API reference
├── REDESIGN.md           # India-focused UX redesign spec
└── README.md
```

## Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- [Redis](https://redis.io/) (optional — caching degrades gracefully if unavailable)
- API keys (optional for ingestion): Currents API (free tier), NewsAPI, GNews, Guardian, NYT

## Quick start (local)

### 1. Backend

```bash
cd insighthub/backend
cp .env.example .env
# Edit .env — MongoDB URI, JWT_SECRET, API keys

npm install
npm run dev
```

API: **http://localhost:5000**  
Swagger: **http://localhost:5000/api-docs**

### 2. Frontend

```bash
cd insighthub/frontend
cp .env.example .env

npm install
npm run dev
```

App: **http://localhost:5173** (light/dark mode toggle in navbar)

### 3. Docker (backend + MongoDB + Redis)

```bash
cd insighthub
cp backend/.env.example backend/.env

docker compose up --build
```

Start the frontend separately (`npm run dev` in `insighthub/frontend`).

### 4. Seed mock data (optional)

```bash
cd insighthub/backend
node scratch/seedMockArticles.js
```

## Environment variables

### Backend (`insighthub/backend/.env`)

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `REDIS_URL` | Redis URL (default `redis://localhost:6379`) |
| `JWT_SECRET` | Secret for JWT signing |
| `NEWSAPI_KEY` | NewsAPI.org key |
| `CURRENTS_API_KEY` | [Currents API](https://currentsapi.services/en/register) key (free: 1,000 req/day) |
| `GNEWS_API_KEY` | GNews key |
| `GUARDIAN_API_KEY` | Guardian API key |
| `NYT_API_KEY` | New York Times API key |
| `CORS_ORIGIN` | Frontend origin (default `http://localhost:5173`) |

See [`insighthub/backend/.env.example`](insighthub/backend/.env.example) for the full list.

### Frontend (`insighthub/frontend/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend URL (default `http://localhost:5000`) |

## API overview

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/health` | — | Health check |
| GET | `/news` | — | Paginated feed |
| GET | `/news/local` | — | Local news by `state` / `city` |
| GET | `/news/:id` | — | Article detail + source variants |
| GET | `/news/compare?topic=` | — | Multi-source comparison |
| GET | `/news/feed/personalized` | JWT | Occupation/topic-ranked feed |
| GET | `/news/summary/:id` | — | Multilingual summary |
| GET | `/search?q=` | — | Full-text search |
| GET | `/trending` | — | Trending stories |
| GET | `/trending/topics` | — | Top categories from trending |
| GET | `/trending/most-read` | — | Most-read articles |
| GET | `/brief/today` | JWT | Today's brief (2-min / 5-min) |
| GET | `/user/saved` | JWT | Saved articles |
| POST | `/user/saved/:articleId` | JWT | Save article |
| DELETE | `/user/saved/:articleId` | JWT | Unsave article |
| GET | `/user/history` | JWT | Reading history |
| POST | `/user/history/:articleId` | JWT | Record article view |
| GET | `/analytics` | — | Dedup & source stats |
| POST | `/auth/register` | — | Register (optional preferences payload) |
| POST | `/auth/login` | — | Login |
| POST | `/preferences` | JWT | Save preferences |

**WebSocket events:** `live:news_update`, `live:trending`, `live:breaking`, `live:brief`, `live:source_status`, `subscribe:topic`

Full reference: [`project-steps.md`](project-steps.md) and Swagger at `/api-docs`

## Client-side caching

The frontend uses **TanStack React Query** for server-state caching. Feed, trending, local news, brief, search, articles, and user library queries use configurable `staleTime` values so revisiting pages reuses cached data instead of refetching immediately. WebSocket events (`live:news_update`, `live:trending`, `live:brief`) invalidate or update the relevant query cache to stay in sync with the backend.

## Future improvements

- Reading history panel in navbar
- Real machine translation API integration
- Automated test suite (dedup, normalizers, auth)

## Documentation

| Document | Description |
|----------|-------------|
| [`project-steps.md`](project-steps.md) | Build phases, architecture, API & WebSocket reference |
| [`REDESIGN.md`](REDESIGN.md) | India-focused News Intelligence Platform redesign spec |

## Deployment

| Service | Platform | Config |
|---------|----------|--------|
| Backend | [Render](https://render.com) | `insighthub/backend/render.yaml` |
| Backend | [Railway](https://railway.app) | `insighthub/backend/railway.json` |
| Frontend | [Vercel](https://vercel.com) | `insighthub/frontend/vercel.json` |

**Render / Railway:** Root directory `insighthub/backend`, env vars from `.env.example`, MongoDB Atlas + Redis.

**Vercel:** Root `insighthub/frontend`, set `VITE_API_URL` to deployed API URL.

## Scripts

### Backend

```bash
npm start        # Production
npm run dev      # Dev with watch
npm run lint     # ESLint
npm run format   # Prettier
```

### Frontend

```bash
npm run dev      # Dev server
npm run build    # Production build (code-split chunks)
npm run preview  # Preview build
npm run lint     # ESLint
```

## CI

GitHub Actions (`.github/workflows/ci.yml`) on push/PR to `main`/`master`:

- Backend lint + import check
- Frontend lint + build
- Docker image build

## License

This project is for educational and portfolio use.
