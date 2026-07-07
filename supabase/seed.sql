-- Seed the projects table with the launch content.
-- Run AFTER schema.sql (Dashboard > SQL Editor). Safe to run once.

insert into public.projects (slug, type, title, summary, body, tags, metrics, external_url, pdf_url, published, created_at)
values ('plansmart-zepto-scheduled-delivery', 'case-study', 'PlanSmart: Schedule & Save for Zepto', 'Under 10% of Zepto users schedule deliveries. 31 interviews showed why: nobody sees the option. Designed a checkout-embedded fix.', '## The problem

Fewer than 10% of Zepto users used scheduled delivery, even though most grocery purchases are planned.

## The finding

31 user interviews: 74% didn''t know the feature existed, 58% would use it for a discount. People weren''t rejecting it. They never saw it.

## The solution

A Schedule & Save toggle inside checkout, where the decision actually happens. Route batching cuts delivery cost from Rs 70–90 to Rs 45–60, netting roughly Rs 36/order even after funding the discount.

[Try the prototype](https://zepto-plan-save-prototype.lovable.app/)

## Takeaway

Most adoption problems are placement problems.', array['PRD', 'User research', 'Unit economics'], 'Rs 36/order contribution modeled · 31 interviews', 'https://zepto-plan-save-prototype.lovable.app/', '/docs/plansmart-deck.pdf', true, '2025-08-15T00:00:00Z')
on conflict (slug) do nothing;

insert into public.projects (slug, type, title, summary, body, tags, metrics, external_url, pdf_url, published, created_at)
values ('zenith-ai-career-app', 'case-study', 'Zenith: an AI career-clarity app', 'An AI advisor that recommends role-and-city-specific skills, without the course-selling bias. Built as Top PM Fellow at NextLeap.', '## The problem

Early-career professionals can''t tell which skills to build for a specific role in a specific city. Edtech advice is biased: the answer is always a course, and always theirs.

## What I built

An AI advisor that recommends 3 role-and-city-specific skills and shows local demand trends. Subscription model, no course catalog, so the incentive points at the user''s outcome.

Built during the NextLeap PM Fellowship, selected as Top PM Fellow from 250.

[Full project on NextLeap](https://nextleap.app/portfolio/riteshu-anand)

## Takeaway

The differentiator isn''t the AI. It''s the business model that lets the AI be honest.', array['AI product', 'NextLeap', '0-to-1'], 'Top PM Fellow · selected from 250', null, null, true, '2025-07-10T00:00:00Z')
on conflict (slug) do nothing;

insert into public.projects (slug, type, title, summary, body, tags, metrics, external_url, pdf_url, published, created_at)
values ('voice-dictation-app', 'teardown', 'A real-time voice dictation app for Android', 'Kotlin + Jetpack Compose, real-time transcription over Deepgram streaming. Shipped as a signed APK.', '## Why

Manual note-taking during online sessions splits your attention. I wanted the notes without the typing.

## What I built

Android app in Kotlin with Jetpack Compose. Real-time transcription via Deepgram Nova-2 WebSocket streaming. Shipped as a signed APK, used across 20+ sessions.

## Why it matters

I build what I spec. Wiring a streaming API and shipping a working APK changes how I write requirements and talk to engineers.', array['Kotlin', 'Deepgram', 'Shipped'], 'Used across 20+ live sessions', null, '/docs/dictation-app-notes.pdf', true, '2025-06-01T00:00:00Z')
on conflict (slug) do nothing;

insert into public.projects (slug, type, title, summary, body, tags, metrics, external_url, pdf_url, published, created_at)
values ('telegram-stock-agent', 'teardown', 'An LLM stock agent inside Telegram', 'Plain-English stock summaries in Telegram, under 20 seconds. No switching to a finance app.', '## Why

Checking a stock means leaving your conversation, opening a finance app, and decoding jargon for one number.

## What I built

A Python LLM agent that answers in plain English inside Telegram, in under 20 seconds.

## Why it matters

Building an agent end to end (tool calls, latency, failure modes) gave me real opinions about where agents work and where they''re just demos.', array['Python', 'LLM agents'], 'Answers in under 20 seconds', null, null, true, '2025-05-15T00:00:00Z')
on conflict (slug) do nothing;
