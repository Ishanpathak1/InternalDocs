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
