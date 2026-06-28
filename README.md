# InsightHub

**Co-authored by Sachin**

Multi-API news analytics platform that aggregates headlines from several external sources, deduplicates overlapping stories, and exposes them through a REST API, WebSocket live feed, and React dashboard.

Built as a MERN-stack portfolio project with production-oriented patterns: caching, Docker, CI/CD, and deployment configs.

## Features

- **Multi-source ingestion** — NewsAPI, GNews, The Guardian, NYT, RSS feeds
- **Deduplication engine** — Jaccard + cosine similarity, source merging
- **REST API** — Paginated feed, search, trending, analytics, auth, API keys
- **WebSockets** — Live news, trending, breaking alerts, topic subscriptions
- **React dashboard** — Feed, search, trending, compare, analytics, alerts
- **Redis caching** — Trending, search, and frequent queries
- **Sentiment & auto-tagging** — AFINN sentiment scoring, keyword category tagging
- **Docker & CI** — `docker compose` stack, GitHub Actions pipeline

## Tech stack

| Layer | Technologies |
|-------|----------------|
| Backend | Node.js 20+, Express, MongoDB, Mongoose, Socket.io, Redis, node-cron |
| Frontend | React 18, Vite, Tailwind CSS, Redux Toolkit, Recharts |
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
└── README.md
```

## Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- [Redis](https://redis.io/) (optional — caching degrades gracefully if unavailable)
- API keys (optional for ingestion):
  - [NewsAPI](https://newsapi.org)
  - [GNews](https://gnews.io)
  - [Guardian Open Platform](https://open-platform.theguardian.com)
  - [NYT Developer](https://developer.nytimes.com)

## Quick start (local)

### 1. Backend

```bash
cd insighthub/backend
cp .env.example .env
# Edit .env — add MongoDB URI, JWT_SECRET, and API keys

npm install
npm run dev
```

API runs at **http://localhost:5000**  
Swagger docs at **http://localhost:5000/api-docs**

### 2. Frontend

```bash
cd insighthub/frontend
cp .env.example .env

npm install
npm run dev
```

App runs at **http://localhost:5173**

### 3. Docker (backend + MongoDB + Redis)

```bash
cd insighthub
cp backend/.env.example backend/.env
# Set JWT_SECRET and API keys in backend/.env

docker compose up --build
```

Then start the frontend separately (`npm run dev` in `insighthub/frontend`).

## Environment variables

### Backend (`insighthub/backend/.env`)

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `REDIS_URL` | Redis URL (default `redis://localhost:6379`) |
| `JWT_SECRET` | Secret for JWT signing |
| `NEWSAPI_KEY` | NewsAPI.org key |
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

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/news` | Paginated feed |
| GET | `/news/:id` | Single article |
| GET | `/news/compare?topic=` | Multi-source comparison |
| GET | `/search?q=` | Full-text search |
| GET | `/trending` | Trending stories |
| GET | `/analytics` | Dedup & source stats |
| GET | `/sources` | Source health |
| POST | `/auth/register` | Register |
| POST | `/auth/login` | Login |
| POST | `/preferences` | Save preferences (JWT) |

WebSocket events: `live:news_update`, `live:trending`, `live:breaking`, `live:source_status`, `subscribe:topic`

Full reference: [`project-steps.md`](project-steps.md)

## Roadmap

See [`ROADMAP.md`](ROADMAP.md) for planned improvements, technical debt, and future feature ideas.

## Deployment

| Service | Platform | Config |
|---------|----------|--------|
| Backend | [Render](https://render.com) | `insighthub/backend/render.yaml` |
| Backend | [Railway](https://railway.app) | `insighthub/backend/railway.json` |
| Frontend | [Vercel](https://vercel.com) | `insighthub/frontend/vercel.json` |

**Render / Railway:** Set root directory to `insighthub/backend`, add env vars from `.env.example`, use MongoDB Atlas + Redis (Upstash or similar).

**Vercel:** Set root to `insighthub/frontend`, add `VITE_API_URL` pointing to your deployed API.

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
npm run build    # Production build
npm run preview  # Preview build
npm run lint     # ESLint
```

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs on push/PR to `main`/`master`:

- Backend lint + import check
- Frontend lint + build
- Docker image build

## License

This project is for educational and portfolio use.
