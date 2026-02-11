import type { APIRoute } from 'astro';
import { takePendingToken, setCookieHeader } from '../../lib/auth';

export const GET: APIRoute = async ({ url }) => {
  const k = url.searchParams.get('k');
  const token = k ? takePendingToken(k) : null;

  if (!token) {
    return new Response(null, {
      status: 303,
      headers: new Headers({ Location: '/login?error=session' }),
    });
  }

  return new Response(null, {
    status: 302,
    headers: new Headers({
      Location: '/docs',
      'Set-Cookie': setCookieHeader(token),
    }),
  });
};
