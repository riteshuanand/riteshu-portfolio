# Riteshu Anand — PM Portfolio

Minimal portfolio with a 3D hero (particles + interactive wireframe + scroll depth), dynamic projects via Supabase, and a hidden admin panel for publishing new work without redeploying.

Built with Next.js 14, React Three Fiber, Tailwind, and Supabase. Deploys free on Vercel.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. Without Supabase configured, the site renders bundled demo projects so you can see everything working immediately.

## Connect Supabase (makes /admin work)

1. Create a free project at https://supabase.com
2. In the dashboard, open **SQL Editor**, paste the contents of `supabase/schema.sql`, and run it. This creates the `projects` table, security policies, and the `covers` + `docs` storage buckets.
3. Still in the SQL Editor, paste and run `supabase/seed.sql`. This inserts the four launch projects (PlanSmart, Zenith, dictation app, Telegram agent) into the database, so everything on the site becomes editable from `/admin` immediately, no retyping.
4. Create your admin login: **Authentication > Users > Add user**. Use your email + a strong password. (Also turn off public signups under Authentication > Sign In / Up settings so only you can log in.)
5. Copy `.env.local.example` to `.env.local` and fill in the values from **Settings > API**:
   - `NEXT_PUBLIC_SUPABASE_URL` = Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon public key
6. Restart the dev server. Go to `/admin`, log in, and edit or publish projects. Changes appear on the site instantly.

Project types map to site sections: **Case study** → Case studies, **Teardown / build** → Teardowns & builds, **Writing** → Writing. The body field supports Markdown. For case studies and teardowns, the External URL renders as an "Open the working prototype" button on the detail page; for Writing posts it makes the card link out directly. The PDF upload renders as an inline viewer on the detail page.

## Deploy to Vercel

1. Push this folder to a GitHub repo
2. Go to https://vercel.com, import the repo (defaults are fine, it auto-detects Next.js)
3. In project settings, add the two `NEXT_PUBLIC_SUPABASE_*` environment variables
4. Deploy. Add a custom domain later under Settings > Domains if you want one.

## Personalize

- `app/page.jsx` — hero line, about text, skills grid, LinkedIn URL
- `public/resume.pdf` — drop your resume here (the Resume buttons point to it)
- `lib/demoData.js` — placeholder content shown until Supabase has published projects; safe to delete the entries once your real work is up
- Colors and fonts live in `tailwind.config.js` (`accent` is the single accent color)

## Structure

```
app/
  page.jsx              home (hero, about, work, teardowns, skills, writing, contact)
  project/[slug]/       case study detail pages
  admin/                login-protected publishing panel
components/
  Scene.jsx             the 3D scene (particles, core shape, scroll camera)
  ProjectCard.jsx       cards with 3D hover tilt
  Reveal.jsx            scroll-in animation
lib/
  supabase.js           data layer with demo-content fallback
supabase/schema.sql     database setup, run once
```
