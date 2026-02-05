# Carbon Footprint Calculator

A web app that estimates your annual CO2 emissions through a short survey covering transportation, energy, food, and waste. View your results on a personal dashboard and compare them with other users and global averages by country and continent.

## Tech Stack

- **Next.js** (TypeScript, App Router, Tailwind CSS)
- **Supabase** (PostgreSQL)
- **Recharts** (charts)
- **Vercel** (hosting)

## Setup

1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and fill in your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

3. Run the SQL in `supabase/setup.sql` in your Supabase dashboard (SQL Editor).

4. Start the dev server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
  config/         Survey questions and emission factors (edit these to change the survey)
  data/           Reference CO2 averages by country/continent
  lib/            Calculator, Supabase client, validation, rate limiting
  components/     UI, survey form, charts, layout
  app/            Pages and API routes
```

## Customizing the Survey

Edit `src/config/survey-questions.ts` to add, remove, or modify questions. Update `src/config/emission-factors.ts` with the corresponding CO2 conversion factors.
