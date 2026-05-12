# GullyGuide

A premium travel platform connecting tourists with local student guides across India.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 14 (App Router) |
| **Styling** | Tailwind CSS |
| **Maps** | Leaflet + OpenStreetMap (via `react-leaflet`) |
| **Geocoding** | Nominatim (OpenStreetMap) |
| **Backend** | Firebase (Firestore + Auth) |
| **Animations** | Framer Motion |
| **UI Components** | shadcn/ui |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

> **Note:** Hardcoded fallbacks exist for development. Production deployments should use proper environment variables.

## API Rate Limits

### Nominatim (OpenStreetMap Geocoding)
- **Policy:** Maximum 1 request per second
- **No API key required** — but must include a `User-Agent` header
- **Implementation:** Rate-limited via `lib/LocationContext.js` with 1100ms minimum interval
- **Fallback:** 20 hardcoded Indian cities used when API fails or is rate-limited
- **Caching:** In-memory cache prevents duplicate geocode requests

### Firebase (Firestore)
- **Spark (Free) Plan:** 50K reads/day, 20K writes/day, 20K deletes/day
- **Guides cache:** 5-minute TTL via `lib/guidesCache.js` — reduces Explore page reads by ~90%
- **Trips:** Real-time via `onSnapshot` in shared `useTrips` hook — single listener per user

## Architecture

```
app/
├── auth/           # Combined sign-in / create account (PublicRoute)
├── login/          # Legacy login page
├── signup/         # Legacy signup page  
├── onboarding/     # Role selection + profile setup
├── dashboard/
│   ├── tourist/    # Tourist dashboard (summary, calendar, trips)
│   ├── guide/      # Guide dashboard (bookings, earnings)
│   ├── trips/      # Trip manager (list + create)
│   ├── trips/[id]/ # Trip planner (itinerary + map)
│   ├── explore/    # Browse guides
│   ├── chat/[id]/  # Messaging
│   └── settings/   # Profile settings
lib/
├── firebase.js     # Firebase init (singleton, long polling)
├── auth.js         # AuthProvider context (onAuthStateChanged + onSnapshot)
├── LocationContext.js  # Geocoding + location management
├── guidesCache.js  # Guides Firestore cache (5-min TTL)
├── animations.js   # Reusable Framer Motion variants
components/
├── map/            # Leaflet map (MapClient.js with error fallback)
├── dashboard/      # TouristView, GuideView
├── copilot/        # AI Co-pilot (mocked)
├── ProtectedRoute.js
└── PublicRoute.js
```
