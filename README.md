# StreamFlix Premium — Luxury Movie & TV Streaming Platform

StreamFlix Premium is a modern, cinema-grade movie and television streaming web application engineered with Next.js 14 (App Router), TypeScript, Tailwind CSS, and HLS.js. It features a minimalist glassmorphism interface, dark-first cinematic visuals, intelligent discovery rails, persistent user states, and a custom video player.

---

## 1. Key Features

### 🎬 Cinematic Video Player
- **Multi-Source Streaming**: Adaptive HLS master streaming, direct MP4 fallback, and configurable mirror embed servers (ZXC Stream from zxcstream.cc, SuperEmbed).
- **Interactive Scrubber**: Real-time seek timeline with hover timestamp previews.
- **TV Series Guide**: Season selector, episode thumbnails, episode runtimes, and play-indicators.
- **Chapter Markers**: Real-time "Skip Intro", "Skip Recap", and "Skip Credits" actions.
- **Audio & Subtitles**: Multi-language closed captioning with customizable font size (Small, Medium, Large) and background opacity (Transparent, Semi-black, Solid).
- **Playback Controls**: Variable speed (0.5x, 0.75x, 1x, 1.25x, 1.5x, 2x), volume slider with mute memory, picture-in-picture mini-player, and theater mode.
- **Keyboard Shortcuts**: Space/K (play/pause), Left/Right (seek 10s), Up/Down (volume), M (mute), F (fullscreen), T (theater mode), C (captions), ? (shortcuts guide).

### 🔍 Smart Search & Discovery
- **Live Autocomplete**: Real-time debounced API queries as you type.
- **Search History**: Persistent recent search queries with one-click replay and clear options.
- **Advanced Filtering**: Filter by genre, release year, minimum rating (★8.0+ masterpieces, ★7.0+), and sorting (Popularity, Rating, Release Date, Title).
- **Quick Preview Modal**: Instant pop-up preview modal with official YouTube trailer playback, cast details, and quick add-to-list action.
- **"Surprise Me" Random Title**: Shuffles and discovers random catalog gems.

### 💎 Design System: Minimalist Glassmorphism
- **Dark Mode First**:
  - Main background: `#09090B`
  - Secondary background: `#111114`
  - Elevated surfaces: `#18181B`
  - Glass surface: `rgba(255, 255, 255, 0.06)`
  - Glass border: `rgba(255, 255, 255, 0.12)`
  - Accent color: `#A78BFA`
- **Light Mode Support**: High-contrast, clean theme with `#F8FAFC` background, `#7C3AED` violet accent, and translucent glass cards.
- **Sticky Floating Navigation**: Auto-adjusts opacity on scroll with category dropdowns, quick search trigger, theme toggle, and profile badge.

### 💾 Personalization & Persistence
- **My List (Watchlist)**: Add, remove, and filter saved movies and series.
- **Continue Watching**: Automatically saves exact timestamp positions every few seconds; offers seamless resume playback.
- **Watch History**: Complete chronological log of watched titles with percentage completion.
- **Preferences**: Remembers preferred streaming servers, subtitle typography, and autoplay settings in localStorage.

---

## 2. Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (Strict typing)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Video Engine**: HTML5 Video + HLS.js
- **Metadata Provider**: The Movie Database (TMDB v3 API) with fallback showcase catalog

---

## 3. Environment Variables

Create a `.env.local` file in the project root:

```env
# The Movie Database (TMDB) API Key
TMDB_API_KEY=babd261dc0b8f207fe4442292955e654
TMDB_READ_ACCESS_TOKEN=your_read_access_token_here

# Default Streaming Server ("zxcstream" | "zxcstream-embed" | "superembed" | "direct-hls")
NEXT_PUBLIC_DEFAULT_STREAM_SERVER=zxcstream
STREAMING_API_BASE_URL=https://zxcstream.cc

# Application Meta
NEXT_PUBLIC_APP_NAME=StreamFlix Premium
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 4. Getting Started

### Installation
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production
```bash
npm run build
npm run start
```

---

## 5. Project Architecture

```
src/
├── app/
│   ├── api/media/             # Secure server routes for TMDB & streaming
│   │   ├── [id]/route.ts      # Title details API
│   │   ├── discover/route.ts  # Filtering & discovery API
│   │   ├── search/route.ts    # Search API
│   │   ├── trending/route.ts  # Trending catalog API
│   │   └── tv/...             # TV series seasons & episodes API
│   ├── continue-watching/     # In-progress titles
│   ├── genre/[slug]/          # Genre category pages
│   ├── history/               # Watch history management
│   ├── movies/                # Movies catalog with filter bar
│   ├── my-list/               # User watchlist
│   ├── profile/               # User profile & viewing statistics
│   ├── search/                # Full search page
│   ├── series/                # TV series catalog
│   ├── settings/              # Server switcher & preferences
│   ├── title/[id]/            # Title details, trailer & cast
│   ├── watch/[id]/            # Cinematic Video Player
│   ├── globals.css            # Design tokens & glassmorphism utilities
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Homepage with Hero & rails
├── components/
│   ├── home/                  # HeroBanner, ContentRail, ContinueWatchingRail
│   ├── layout/                # Navbar, Footer, MobileNav
│   ├── media/                 # MediaCard, MediaGrid, QuickViewModal
│   ├── player/                # VideoPlayer, EpisodeSelector, MiniPlayer, Shortcuts
│   ├── providers/             # ThemeProvider, MediaContext, PlayerContext
│   ├── search/                # SearchOverlay, FilterBar
│   └── ui/                    # Button, Badge, Modal, GlassCard, Skeleton
├── lib/
│   ├── constants.ts           # Genres, test HLS streams, showcase catalog
│   ├── storage.ts             # LocalStorage persistence manager
│   ├── tmdb.ts                # TMDB API abstraction & response normalizer
│   └── utils.ts               # Formatting & styling utilities
└── types/
    └── media.ts               # TypeScript data models
```

---

## 6. License
Licensed under the MIT License.
