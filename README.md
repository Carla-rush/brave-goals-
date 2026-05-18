# BRAVE Goal Tool

A single-page web app that guides users through setting a goal using the BRAVE framework — Bold, Rewarding, Aligned, Values-driven, Evidence-based.

Built by [Carla Rush](https://carla-rush.mykajabi.com), coach specialising in food relationship and body image.

## What it does

Users pick a life area, write a goal, and work through each letter of the BRAVE framework with prompts and reflection questions. At the end they get a personalised BRAVE goal card they can copy and keep.

## Tech stack

- Vanilla JS single-page app
- Express.js (serves static files)
- Supabase (email capture)

## Run locally

```bash
npm install
npm start
```

App runs at `http://localhost:3000`.

## Supabase setup

The email signup writes to an `emails` table in Supabase. Row Level Security is enabled with an INSERT-only policy for anon users — reads are blocked.