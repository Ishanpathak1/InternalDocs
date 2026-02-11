# Docs

Public documentation site (Astro). Anyone can browse. No login.

## Commands

- `npm run dev` – start dev server
- `npm run build` – build for production
- `npm run preview` – preview production build

## Adding docs

Add or edit Markdown files in `src/content/docs/`. Each file needs frontmatter:

```yaml
---
title: Your Doc Title
author: Your Name
pubDate: 2025-02-11
description: Optional short description
codeLocation: Optional path or repo link
---
```

Push to your repo; on Vercel (or similar) the site rebuilds and the new doc appears.

## Deploying

Works on **Vercel** (or any Node/serverless host). Connect your GitHub repo in the [Vercel dashboard](https://vercel.com) or use the `vercel` CLI. No database or env vars required for the public site.
