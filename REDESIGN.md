# InsightHub — News Intelligence Platform Redesign Specification

> **Purpose:** Transform InsightHub from a News Analytics Dashboard into a modern, personalized **News Intelligence Platform for Indian users** — without rebuilding the core architecture.

**Status:** Planning document · Integrates with existing codebase as of Phase 6 + partial India extensions

---

## Executive summary

The backend pipeline **must not change**:

```
External APIs → Aggregation → Normalization → Sentiment & Category Tagging
→ Deduplication → MongoDB + Redis → REST + WebSockets → React Frontend
```

This document specifies **frontend consolidation**, **targeted backend extensions** (new services that plug into existing data), and a phased implementation plan. Several India-focused features already exist (`recommendation.service`, `brief.service`, `regional.service`, personalized feed). This spec **unifies** them under one UX vision rather than adding more disconnected pages.

---

## 1. Current state analysis

### Backend (already implemented — do not replace)

| Layer | Files | Status |
|-------|-------|--------|
| Aggregation | `aggregator.service.js`, `fetchScheduler.js`, source services | ✅ Stable |
| Normalization | `normalizer.service.js` | ✅ Stable |
| Enrichment | `articleEnrichment.service.js`, `sentiment.service.js`, `categoryTagger.service.js` | ✅ Stable |
| Regional tagging | `regional.service.js` (ingestion hook) | ✅ Exists |
| Schemes | `scheme.service.js` | ✅ Exists |
| Dedup | `dedup.service.js` | ✅ Stable |
| Cache | `cache.service.js`, Redis | ✅ Stable |
| Trending | `trending.service.js` | ✅ Stable |
| Auth | JWT, API keys, preferences | ✅ Stable |
| WebSockets | `live:news_update`, `live:trending`, `live:breaking`, `live:source_status`, `subscribe:topic` | ✅ Stable |
| **Extensions** | `recommendation.service.js`, `brief.service.js`, `language.service.js` | ✅ Partial |

### Backend routes (current)

| Route | Purpose |
|-------|---------|
| `GET /news` | Paginated feed + category/source filters |
| `GET /news/:id` | Article detail |
| `GET /news/compare` | Multi-source comparison |
| `GET /news/feed/personalized` | Occupation/interest-based feed (JWT) |
| `GET /news/summary/:id` | AI summary by language |
| `GET /search` | Full-text search |
| `GET /trending` | Trending scores |
| `GET /brief/today` | Today's brief |
| `GET /regions/*` | Regional analytics |
| `GET /schemes/recommend` | Scheme recommendations |
| `POST /preferences` | User profile |

### Frontend (current — needs consolidation)

| Page | Route | Issue |
|------|-------|-------|
| Feed | `/` | ✅ Good base; should become **Home** with category tabs |
| Morning Brief | `/brief` | Separate page — **merge into Home card** for logged-in users |
| Local Heatmap | `/local` | Standalone — **merge into Home Local section** |
| Gov Schemes | `/schemes` | Standalone — **merge into personalized Home / Profile** |
| Search | `/search` | ✅ Keep |
| Trending | `/trending` | ✅ Keep, simplify sections |
| Compare | `/compare` | ❌ **Remove page** → move to Article Detail |
| Analytics | `/analytics` | ⚠️ **Dev/portfolio only** — hide from main nav |
| Alerts | `/alerts` | ✅ Keep, simplify presets |
| Preferences | `/preferences` | ✅ Keep, expand onboarding fields |
| Login | `/login` | ✅ Keep |
| **Missing** | `/news/:id` | Article detail page not built |
| **Missing** | Saved / History | No UI or API yet |

### Database (current)

| Model | Notes |
|-------|-------|
| `Article` | Has `regionalInfo`, `schemeDetails`, `aiSummaries`, `sentiment` |
| `User` | Has `occupation`, `state`, `district`, `preferredLanguage`, `topics`, `sources` |
| `MorningBrief` | Daily brief cache |
| **Missing** | `SavedArticle`, `ReadingHistory` (or embedded on User) |

---

## 2. Updated frontend page structure

### Target pages (7 primary + 2 auth)

```
/                     → Home (public + personalized)
/search               → Search
/trending             → Trending
/news/:id             → Article Detail (NEW — includes source comparison)
/alerts               → Alerts (login required)
/profile              → Profile & Preferences (rename from /preferences)
/login                → Login / Register
```

### Pages to remove or merge

| Remove / merge | Into |
|----------------|------|
| `/compare` | `/news/:id` → "Sources covering this story" panel |
| `/brief` | Home → "Today's Brief" card (logged-in) |
| `/local` | Home → "Local News" section + state/city picker |
| `/schemes` | Home brief card + Profile occupation section |
| `/analytics` | Footer link or `/admin/analytics` (optional, dev demo) |

### Home page layout (single landing page)

```
┌─────────────────────────────────────────────────────────────┐
│  Navbar: Logo | Home | Trending | Search | Alerts | Sign in │
├─────────────────────────────────────────────────────────────┤
│  [Today's Brief card]              ← logged-in only         │
├─────────────────────────────────────────────────────────────┤
│  Category tabs: Top | National | Intl | Business | Tech ... │
├─────────────────────────────────────────────────────────────┤
│  [Local News]  State ▼  City ▼  [Detect location]         │
├─────────────────────────────────────────────────────────────┤
│  Article grid (reuses GET /news or /feed/personalized)      │
│  + live WS inserts at top when connected                    │
├─────────────────────────────────────────────────────────────┤
│  Pagination                                                 │
└─────────────────────────────────────────────────────────────┘
```

**Guest:** `GET /news` with category tabs.  
**Logged-in:** Same page + Today's Brief card + personalized ranking via `GET /news/feed/personalized` (toggle or auto).

---

## 3. Updated navigation flow

### Primary nav (simplified)

| Label | Path | Guest | Logged-in |
|-------|------|-------|-----------|
| Home | `/` | ✅ | ✅ (personalized) |
| Trending | `/trending` | ✅ | ✅ |
| Search | `/search` | ✅ | ✅ |
| Alerts | `/alerts` | ❌ | ✅ |
| Profile | `/profile` | ❌ | ✅ |

### Secondary / utility

- **Sign in** → `/login` (guest navbar)
- **API Docs** → external link to `/api-docs` (footer)
- **Analytics** → hidden from main nav; optional `/analytics` for portfolio demo

### Mobile

- Bottom tab bar: Home | Trending | Search | Alerts | Profile
- Hamburger only for theme toggle + logout

---

## 4. User flows

### Guest flow

```
Land on Home
  → Browse category tabs (GET /news?category=)
  → View Local News (GET /news/local?state=&city=)
  → Open article → /news/:id
  → Search (GET /search?q=)
  → Trending (GET /trending + WS read-only optional)
  → Prompt to sign in for Alerts / Saved / Brief
```

### Registration / onboarding flow

```
/login (Register tab)
  → Step 1: name, email, password
  → Step 2 (optional modal or /profile): occupation, interests, state, language
  → Redirect to Home (personalized mode ON)
  → Today's Brief card loads (GET /brief/today)
  → Suggest alert presets based on occupation
```

### Logged-in flow

```
Home (personalized)
  → Today's Brief card at top
  → Feed ranked by recommendation.service
  → Local section uses user.preferences.state
  → Save article (POST /user/saved)
  → Reading history auto-recorded on article open
  → Alerts: subscribe via WS subscribe:topic
  → Profile: edit occupation, interests, state, language
```

### Occupation → interest mapping (frontend constants + backend profile)

Reuse `occupationProfiles` in `recommendation.service.js`; expose same map in frontend for onboarding chips:

| Occupation | Suggested interests |
|------------|---------------------|
| Student | placements, scholarships, exams, hackathons, AI |
| Teacher | education, universities, research, grants |
| Government Employee | orders, circulars, recruitment, policies |
| Software Engineer | AI, programming, cloud, startups |
| Investor | stock market, IPO, RBI, economy |
| Farmer | agriculture, weather, crops, government schemes |

---

## 5. Component hierarchy

```
src/
├── components/
│   ├── layout/
│   │   ├── AppLayout.jsx          # shell
│   │   ├── Navbar.jsx             # simplified nav
│   │   ├── MobileTabBar.jsx       # NEW
│   │   └── Footer.jsx             # NEW (optional)
│   ├── home/                      # NEW folder
│   │   ├── TodaysBriefCard.jsx    # from MorningBriefPage
│   │   ├── CategoryTabs.jsx       # extract from Feed
│   │   ├── LocalNewsSection.jsx   # from LocalIntelligence
│   │   └── HomeFeed.jsx           # feed list + pagination
│   ├── article/                   # NEW folder
│   │   ├── ArticleDetail.jsx      # full page
│   │   ├── SourceComparison.jsx   # from Compare page
│   │   ├── ArticleSummary.jsx     # aiSummaries / GET summary
│   │   └── SaveButton.jsx         # NEW
│   ├── trending/
│   │   ├── BreakingSection.jsx
│   │   ├── TrendingTopics.jsx
│   │   └── MostReadList.jsx
│   ├── search/
│   │   └── SearchFilters.jsx      # category, source filters
│   ├── alerts/
│   │   └── AlertPresets.jsx       # simplified subscribe chips
│   ├── profile/
│   │   ├── OnboardingForm.jsx
│   │   ├── SavedList.jsx
│   │   └── HistoryList.jsx
│   └── ui/                        # existing atoms
│       ├── ArticleCard.jsx        # enhance: skeleton, theme
│       ├── SkeletonCard.jsx       # NEW
│       ├── EmptyState.jsx         # NEW
│       └── ThemeToggle.jsx        # NEW
├── pages/
│   ├── Home.jsx                   # replaces Feed.jsx (rename/refactor)
│   ├── ArticlePage.jsx            # NEW
│   ├── Trending.jsx               # refactor sections
│   ├── Search.jsx
│   ├── Alerts.jsx
│   ├── Profile.jsx                # merge Preferences
│   └── Login.jsx
```

**Principle:** Extract sections from `Feed.jsx`, `MorningBriefPage.jsx`, `LocalIntelligence.jsx` into `components/home/*` — do not delete logic, **relocate**.

---

## 6. Backend service changes (extensions only)

### Keep unchanged

- `aggregator.service.js`
- `dedup.service.js`
- `normalizer.service.js`
- `sourceHealth.service.js`
- `cache.service.js`
- `trending.service.js`
- All `sources/*.service.js`
- WebSocket handlers (existing events)

### Extend (already exist — wire better)

| Service | Change |
|---------|--------|
| `recommendation.service.js` | Add `Teacher`, `Government Employee` profiles; expose `GET /recommendations` alias |
| `brief.service.js` | Ensure `GET /brief/today` returns 2-min digest; cache in Redis |
| `regional.service.js` | No pipeline change — used at ingest + query filter |

### New services (plug into existing data)

#### `userLibrary.service.js` (NEW)

```js
// saveArticle(userId, articleId)
// unsaveArticle(userId, articleId)
// getSavedArticles(userId, page, limit)
// recordHistory(userId, articleId)  // on article view
// getReadingHistory(userId, page, limit)
```

Reads/writes `User.library` or separate collections — **no new ingestion**.

#### `localNews.service.js` (NEW — thin wrapper)

```js
// getLocalNews({ state, city, page, limit })
// → Article.find({ 'regionalInfo.state': state, 'regionalInfo.city': city })
// → fallback: text search on state/city keywords via existing articles
// → cache key: local:{state}:{city}:{page}
```

Does **not** fetch new APIs — filters MongoDB articles already tagged by `regional.service` at ingest.

#### `recommendation.service.js` (extend)

- Add `GET /recommendations?limit=10` as lightweight alias for home sidebar "For You"

### WebSocket extensions (optional Phase 2)

| Event | When | Data |
|-------|------|------|
| `live:brief` | Brief regenerated | `{ brief, occupation }` — **already may exist via `emitBrief`** |
| `live:local_news` | Article ingested matching user's state | Filter client-side or server room `region:{state}` |
| `live:recommendation` | New high-score article for user occupation | Optional; can defer |

**Do not remove** existing WS events.

---

## 7. Route updates

### Frontend routes (`constants/routes.js`)

```js
export const ROUTES = {
  HOME: '/',
  TRENDING: '/trending',
  SEARCH: '/search',
  ARTICLE: '/news/:id',
  ALERTS: '/alerts',
  PROFILE: '/profile',
  LOGIN: '/login',
  // deprecated redirects
  BRIEF: '/brief',      // → redirect to /
  LOCAL: '/local',      // → redirect to /?section=local
  COMPARE: '/compare',  // → redirect to /search or remove
  SCHEMES: '/schemes',  // → redirect to /profile?tab=schemes
  ANALYTICS: '/analytics', // keep, hidden nav
};

export const NAV_ITEMS = [
  { label: 'Home', path: '/' },
  { label: 'Trending', path: '/trending' },
  { label: 'Search', path: '/search' },
  { label: 'Alerts', path: '/alerts', auth: true },
  { label: 'Profile', path: '/profile', auth: true },
];
```

### Backend routes (additions only)

| Method | Endpoint | Auth | Service |
|--------|----------|------|---------|
| GET | `/news/local` | Optional | `localNews.service` |
| GET | `/recommendations` | JWT | `recommendation.service` |
| GET | `/brief/today` | JWT | `brief.service` (exists) |
| GET | `/user/saved` | JWT | `userLibrary.service` |
| POST | `/user/saved/:articleId` | JWT | `userLibrary.service` |
| DELETE | `/user/saved/:articleId` | JWT | `userLibrary.service` |
| GET | `/user/history` | JWT | `userLibrary.service` |
| POST | `/user/history/:articleId` | JWT | `userLibrary.service` |

**Existing routes unchanged:** `/news`, `/search`, `/trending`, `/auth/*`, `/preferences` (or alias to `/user/profile`).

### Extend `GET /news` query params (no breaking change)

| Param | Example | Behavior |
|-------|---------|----------|
| `category` | `technology` | Already exists |
| `region` | `national` | Map to category filter or `regionalInfo.state` |
| `state` | `Karnataka` | Filter `regionalInfo.state` |
| `city` | `Bengaluru` | Filter `regionalInfo.city` |

Prefer dedicated `GET /news/local` for clarity; internally same query builder.

---

## 8. Database changes (minimal)

### Option A — Embed on User (recommended for MVP)

```js
// User schema additions
library: {
  savedArticles: [{ articleId, savedAt }],
  readingHistory: [{ articleId, viewedAt }],
}
```

Cap history at 100 entries (FIFO trim on save).

### Option B — Separate collections (scale later)

- `SavedArticle` — `{ userId, articleId, savedAt }` + index `(userId, savedAt)`
- `ReadingHistory` — `{ userId, articleId, viewedAt }` + TTL index 90 days

### User schema additions (onboarding)

```js
preferences: {
  // existing fields...
  interests: [String],        // explicit chips from onboarding
  city: String,               // alias district if needed
  onboardingCompleted: Boolean,
}
```

Expand `occupation` enum:

```js
enum: ['Student', 'Teacher', 'Government Employee', 'Software Engineer', 'Investor', 'Farmer', 'General']
```

**Article model:** No change required — `regionalInfo` already supports local filtering.

---

## 9. Updated folder structure (delta only)

```
insighthub/
├── backend/src/
│   ├── services/
│   │   ├── userLibrary.service.js    # NEW
│   │   └── localNews.service.js      # NEW
│   ├── controllers/
│   │   └── userLibrary.controller.js # NEW
│   └── routes/
│       └── user.routes.js            # NEW (/user/saved, /user/history)
│
└── frontend/src/
    ├── components/
    │   ├── home/                     # NEW (extract from pages)
    │   ├── article/                  # NEW
    │   ├── profile/                  # NEW
    │   └── layout/MobileTabBar.jsx   # NEW
    ├── pages/
    │   ├── Home.jsx                  # refactor Feed.jsx
    │   ├── ArticlePage.jsx           # NEW
    │   └── Profile.jsx               # merge Preferences
    ├── constants/
    │   ├── routes.js                 # simplify
    │   ├── categories.js             # NEW — India home tabs
    │   ├── indianStates.js           # NEW — state/city picker
    │   └── occupationInterests.js    # NEW — onboarding map
    └── hooks/
        ├── useLocalNews.js           # NEW
        ├── useSavedArticles.js       # NEW
        └── useTheme.js               # NEW — dark/light
```

**Remove after migration:** `pages/Compare.jsx`, `pages/MorningBriefPage.jsx`, `pages/LocalIntelligence.jsx`, `pages/SchemesIntelligence.jsx` (logic moved to components).

---

## 10. UI/UX design system

### Visual direction

- **Base:** Keep slate dark theme; add light mode via `class` on `<html>`
- **Accent:** Sky blue primary → add India saffron subtle accent for CTAs (optional)
- **Typography:** `Inter` or `DM Sans` via Google Fonts
- **Cards:** Rounded-xl, subtle border, hover lift (`transition-transform`)
- **Density:** More whitespace on mobile; 1-column feed, 2-column tablet, 3-column desktop

### Design tokens (`index.css` + Tailwind extend)

```js
// tailwind.config.js extend
colors: {
  brand: { 50: '...', 500: '#0ea5e9', 600: '#0284c7' },
  surface: { DEFAULT: '#0f172a', card: '#1e293b' },
}
```

### Required UX patterns (per page)

| Pattern | Where |
|---------|-------|
| Skeleton loaders | Home feed, Trending, Search results |
| Empty states | No local news, no saved articles, no search results |
| Error boundaries | Per-section on Home (brief fails ≠ feed fails) |
| Toast | Save article, subscribe alert, WS reconnect |
| Sticky category tabs | Home horizontal scroll on mobile |

### Dark / light mode

- `useTheme` hook → `localStorage` + `document.documentElement.classList`
- Toggle in Navbar
- Update `Toaster` styles dynamically

---

## 11. Step-by-step implementation plan

### Phase R1 — Navigation & Home consolidation (3–4 days)

1. Create `constants/categories.js` with India home tabs:
   `top, national, international, business, technology, sports, entertainment, health, science`
2. Refactor `Feed.jsx` → `Home.jsx`:
   - Extract `CategoryTabs`, `HomeFeed`
   - Map tabs → `GET /news?category=` (map `top` → no filter, `national` → `regionalInfo.state=National` or keyword)
3. Simplify `NAV_ITEMS` (5 items)
4. Add redirects: `/brief`, `/local`, `/schemes` → `/`
5. Add `SkeletonCard`, `EmptyState`, `ThemeToggle`

**Backend changes:** None  
**Integration:** Pure frontend reuse of existing APIs

---

### Phase R2 — Article detail + Compare merge (2 days)

1. Create `pages/ArticlePage.jsx` → route `/news/:id`
2. `GET /news/:id` — already exists
3. Port `Compare.jsx` logic into `SourceComparison.jsx` using article's `sources[]` + optional `GET /news/compare?topic=` for related
4. `POST /user/history/:articleId` on mount (logged-in)
5. `SaveButton` → wire in Phase R3

**Backend changes:** `userLibrary.service` history endpoint  
**Integration:** No pipeline change; read-only + one write on view

---

### Phase R3 — Saved articles & Profile (2–3 days)

1. Add `library` fields to User model
2. Implement `userLibrary.service.js` + `user.routes.js`
3. Create `Profile.jsx` — merge `Preferences.jsx` + Saved + History tabs
4. Expand registration onboarding (occupation + interests chips)
5. Update `auth.controller` register to accept preferences payload

**Backend changes:** User schema + new routes  
**Integration:** Library reads `Article` collection by ID — no ingestion change

---

### Phase R4 — Local news section (2 days)

1. Create `localNews.service.js` — filter by `regionalInfo`
2. `GET /news/local?state=&city=&page=`
3. `LocalNewsSection.jsx` on Home — state/city dropdowns from `indianStates.js`
4. Optional: browser geolocation → reverse geocode stub or manual state guess
5. Redis cache `local:{state}:{city}`

**Backend changes:** Thin query service + route  
**Integration:** Uses articles already tagged by `regional.service` during `articleEnrichment` / ingest

---

### Phase R5 — Today's Brief on Home (1–2 days)

1. Move `MorningBriefPage` content into `TodaysBriefCard.jsx`
2. Logged-in only; calls existing `GET /brief/today`
3. Remove `/brief` route (redirect `/`)
4. Optional WS: listen for `live:brief` if `emitBrief` already fires

**Backend changes:** None (maybe Redis cache brief response)  
**Integration:** `brief.service` already reads from `Article` collection

---

### Phase R6 — Trending & Alerts simplification (2 days)

1. **Trending page** sections:
   - Breaking → `live:breaking` from Redux + initial `GET /trending`
   - Top topics → aggregate from trending article categories
   - Most read → `GET /user/history` global aggregate (new analytics query) OR viewCount field later
2. **Alerts page** — preset chips:
   `Breaking | Technology | Sports | Government | Local`
   - Maps to `subscribe:topic` / `subscribe:category`
3. Remove complex free-text as primary UX; keep advanced input collapsed

**Backend changes:** Optional `GET /trending/topics` — aggregate from cached trending  
**Integration:** Reuses trending service + existing WS

---

### Phase R7 — Polish & responsive (2–3 days)

1. `MobileTabBar.jsx`
2. Light mode
3. Page transitions (CSS `fade-in`)
4. Hide Analytics from nav; keep route for portfolio
5. Update `README.md` + Swagger for new endpoints
6. Lighthouse pass (mobile performance)

---

## 12. Integration guarantee — core logic untouched

| Concern | Guarantee |
|---------|-----------|
| Aggregation pipeline | No changes to `ingestFromSource` flow except existing enrichment hooks |
| Normalization | `normalizeArticle` per source type unchanged |
| Dedup | `processIncomingArticle` unchanged |
| Sentiment / category | `enrichArticle` still runs pre-save |
| Regional tagging | `regional.service` still runs at ingest — local news only **queries** result |
| Redis | New cache keys for local/brief; same invalidation on ingest |
| Auth | JWT middleware unchanged; new routes use same `authMiddleware` |
| WebSockets | Existing events preserved; new events are additive |
| Frontend data | All UI reads from same MongoDB articles — no parallel data source |

### Data flow for new features (example: Local News)

```
[Ingestion — UNCHANGED]
  raw article → normalize → enrichArticle (regional.service tags state/city)
  → dedup → MongoDB

[Local News — NEW READ PATH ONLY]
  GET /news/local?state=Karnataka&city=Bengaluru
  → localNews.service queries Article.regionalInfo
  → Redis cache → JSON response
  → Home LocalNewsSection renders ArticleCard
```

### Data flow for Personalized Home

```
[Login — UNCHANGED]
  JWT → user.preferences

[Home — READ PATH]
  GET /news/feed/personalized
  → recommendation.service scores existing articles
  → NO new external API calls
```

---

## 13. API mapping cheat sheet (frontend → backend)

| UI feature | API | WS event |
|------------|-----|----------|
| Home category tabs | `GET /news?category=` | — |
| Home personalized | `GET /news/feed/personalized` | `live:news_update` |
| Today's Brief card | `GET /brief/today` | `live:brief` |
| Local section | `GET /news/local?state&city` | `live:local_news` (optional) |
| Article detail | `GET /news/:id` | — |
| Source comparison | Article `sources[]` + `GET /news/compare` | — |
| Search | `GET /search?q=&category=&source=` | — |
| Trending | `GET /trending` | `live:trending`, `live:breaking` |
| Alerts presets | — | `subscribe:topic` |
| Save article | `POST /user/saved/:id` | — |
| History | `POST /user/history/:id`, `GET /user/history` | — |
| Profile | `POST /preferences`, `GET /auth/me` | — |
| Schemes (profile tab) | `GET /schemes/recommend` | — |

---

## 14. Success criteria

- [ ] Guest can browse Home by category without login
- [ ] Logged-in user sees Today's Brief + personalized feed on same Home page
- [ ] Local news filters by state/city without new ingestion sources
- [ ] Compare lives on article detail, not standalone page
- [ ] Nav has ≤ 5 primary items
- [ ] Saved articles + reading history work
- [ ] All existing REST + WS endpoints still functional
- [ ] Swagger updated for new `/user/*` and `/news/local` routes
- [ ] Mobile-responsive with bottom tab bar
- [ ] Dark + light mode

---

## 15. What NOT to do

- ❌ Rebuild backend from scratch
- ❌ Add new external news APIs for local/personalized features
- ❌ Replace MongoDB with another DB
- ❌ Move dedup before normalization
- ❌ Create a separate logged-in dashboard route
- ❌ Remove Swagger, auth, API keys, or analytics backend code
- ❌ Break existing WebSocket clients

---

## 16. Post-redesign improvements

- **TanStack React Query cache layer (frontend)** — Implemented. Server-state hooks live under `frontend/src/queries/` with cache invalidation wired to WebSocket events in `SocketContext`.

---

*This document should be used as the single source of truth for the redesign sprint. Implement phase-by-phase; each phase is independently shippable.*
