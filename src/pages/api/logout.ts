import type { APIRoute } from 'astro';
import { clearCookieHeader } from '../../lib/auth';

export const POST: APIRoute = async () => {
  return new Response(null, {
    status: 302,
    headers: {
      'Location': '/',
      'Set-Cookie': clearCookieHeader(),
    },
  });
};
