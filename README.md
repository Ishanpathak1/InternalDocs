# Internal Docs

Internal-only documentation site (Astro). Sign in with a one-time access code; admins can generate codes.

## Admin access

**Your email gets admin access** if it’s listed in `data/admins.json`. Replace `your-email@example.com` in that file with your real email (e.g. `you@company.com`). After you sign in with an access code using that email, you’ll see the **Admin** link and can generate access codes for others.

## Commands

- `npm run dev` – start dev server
- `npm run build` – build for production
- `npm run preview` – preview production build

## Env (optional)

- `SECRET` – used to sign session cookies (defaults to a dev value; set in production).

## Deploying on Vercel

The project is configured with `@astrojs/vercel` so SSR works on Vercel. Deploy by connecting your GitHub repo in the [Vercel dashboard](https://vercel.com) or with `vercel` CLI.

**Important – file-based data:** The app stores users, access codes, and admins in `data/*.json` and writes to these files at runtime (login, set password, generate code, upload doc). On Vercel, serverless functions use a **read-only filesystem**; only files bundled at build time are available, and any write will fail or be lost. So on Vercel:

- **Reads** of `data/` from the build will work.
- **Writes** (new users, consuming codes, new codes, new docs) will not persist.

For a production deployment on Vercel you’d need to switch to a database (e.g. Vercel Postgres, Turso, or a third-party API) instead of JSON files. For a read-only docs site or a quick preview, the current setup can still be deployed; just don’t rely on sign-up, code generation, or doc upload working after deploy.
