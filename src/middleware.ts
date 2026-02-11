import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async ({ locals }, next) => {
  // Public site – no auth
  (locals as { user?: null }).user = null;
  return next();
});
