# Ì¥• RoastURL.xyz

> Drop your startup URL. Get a brutal AI audit in seconds.

Built by [@mojeebeth](https://x.com/mojeebeth) ¬∑ [BlindspotLab](https://blindspotlab.xyz)

## Stack
- **Frontend**: Next.js 15 + TypeScript + Tailwind
- **AI**: Gemini 2.5 Flash Lite
- **DB**: Supabase (PostgreSQL)
- **Hosting**: Vercel (Serverless)

## Setup

1. Clone and install:
```bash
npm install
```

2. Configure `.env.local`:
```env
GEMINI_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=https://roasturl.xyz
```

3. Run Supabase migration (`supabase/migrations/001_create_roasts.sql`)

4. Dev:
```bash
npm run dev
```

5. Deploy:
```bash
vercel --prod
```

## Features
- Ì¥• Brutal AI startup roast via Gemini 2.5
- Ì≥ä Roast Score (0‚Äì100) with visual meter
- Ì≤æ Shareable + downloadable card
- ‚ö° 1hr result caching via Supabase
- Ìª°Ô∏è Edge case handling (unreachable, empty pages)
