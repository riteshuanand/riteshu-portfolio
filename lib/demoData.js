/**
 * Seed content — Riteshu's real work, drafted from his resume.
 * Shown when Supabase isn't connected (or has no published projects).
 * Once Supabase is live, manage everything from /admin instead.
 */
export const demoProjects = [
  {
    id: 'seed-5',
    slug: 'plansmart-zepto-scheduled-delivery',
    type: 'case-study',
    title: 'PlanSmart: Schedule & Save for Zepto',
    summary:
      'Under 10% of Zepto users schedule deliveries. 31 interviews showed why: nobody sees the option. Designed a checkout-embedded fix.',
    tags: ['PRD', 'User research', 'Unit economics'],
    metrics: 'Rs 36/order contribution modeled · 31 interviews',
    cover_url: null,
    external_url: 'https://zepto-plan-save-prototype.lovable.app/',
    pdf_url: '/docs/plansmart-deck.pdf',
    published: true,
    created_at: '2025-08-15T00:00:00Z',
    body: `## The problem

Fewer than 10% of Zepto users used scheduled delivery, even though most grocery purchases are planned.

## The finding

31 user interviews: 74% didn't know the feature existed, 58% would use it for a discount. People weren't rejecting it. They never saw it.

## The solution

A Schedule & Save toggle inside checkout, where the decision actually happens. Route batching cuts delivery cost from Rs 70–90 to Rs 45–60, netting roughly Rs 36/order even after funding the discount.

[Try the prototype](https://zepto-plan-save-prototype.lovable.app/)

## Takeaway

Most adoption problems are placement problems.`,
  },
  {
    id: 'seed-6',
    slug: 'zenith-ai-career-app',
    type: 'case-study',
    title: 'Zenith: an AI career-clarity app',
    summary:
      'An AI advisor that recommends role-and-city-specific skills, without the course-selling bias. Built as Top PM Fellow at NextLeap.',
    tags: ['AI product', 'NextLeap', '0-to-1'],
    metrics: 'Top PM Fellow · selected from 250',
    cover_url: null,
    external_url: null,
    published: true,
    created_at: '2025-07-10T00:00:00Z',
    body: `## The problem

Early-career professionals can't tell which skills to build for a specific role in a specific city. Edtech advice is biased: the answer is always a course, and always theirs.

## What I built

An AI advisor that recommends 3 role-and-city-specific skills and shows local demand trends. Subscription model, no course catalog, so the incentive points at the user's outcome.

Built during the NextLeap PM Fellowship, selected as Top PM Fellow from 250.

[Full project on NextLeap](https://nextleap.app/portfolio/riteshu-anand)

## Takeaway

The differentiator isn't the AI. It's the business model that lets the AI be honest.`,
  },
  {
    id: 'seed-7',
    slug: 'voice-dictation-app',
    type: 'teardown',
    title: 'A real-time voice dictation app for Android',
    summary:
      'Kotlin + Jetpack Compose, real-time transcription over Deepgram streaming. Shipped as a signed APK.',
    tags: ['Kotlin', 'Deepgram', 'Shipped'],
    metrics: 'Used across 20+ live sessions',
    cover_url: null,
    external_url: null,
    pdf_url: '/docs/dictation-app-notes.pdf',
    published: true,
    created_at: '2025-06-01T00:00:00Z',
    body: `## Why

Manual note-taking during online sessions splits your attention. I wanted the notes without the typing.

## What I built

Android app in Kotlin with Jetpack Compose. Real-time transcription via Deepgram Nova-2 WebSocket streaming. Shipped as a signed APK, used across 20+ sessions.

## Why it matters

I build what I spec. Wiring a streaming API and shipping a working APK changes how I write requirements and talk to engineers.`,
  },
  {
    id: 'seed-8',
    slug: 'telegram-stock-agent',
    type: 'teardown',
    title: 'An LLM stock agent inside Telegram',
    summary:
      'Plain-English stock summaries in Telegram, under 20 seconds. No switching to a finance app.',
    tags: ['Python', 'LLM agents'],
    metrics: 'Answers in under 20 seconds',
    cover_url: null,
    external_url: null,
    published: true,
    created_at: '2025-05-15T00:00:00Z',
    body: `## Why

Checking a stock means leaving your conversation, opening a finance app, and decoding jargon for one number.

## What I built

A Python LLM agent that answers in plain English inside Telegram, in under 20 seconds.

## Why it matters

Building an agent end to end (tool calls, latency, failure modes) gave me real opinions about where agents work and where they're just demos.`,
  },
];
