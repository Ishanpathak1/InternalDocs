import type { APIRoute } from 'astro';
import { getUserByEmail, setUserPassword } from '../../lib/auth-data';

export const POST: APIRoute = async ({ request }) => {
  const form = await request.formData();
  const email = (form.get('email') as string)?.trim();
  const password = (form.get('password') as string) || '';
  const confirm = (form.get('confirm') as string) || '';

  if (!email) {
    return new Response(null, {
      status: 303,
      headers: new Headers({ Location: '/login?error=missing' }),
    });
  }

  if (password.length < 6) {
    return new Response(null, {
      status: 303,
      headers: new Headers({ Location: `/login/set-password?email=${encodeURIComponent(email)}&error=short` }),
    });
  }

  if (password !== confirm) {
    return new Response(null, {
      status: 303,
      headers: new Headers({ Location: `/login/set-password?email=${encodeURIComponent(email)}&error=mismatch` }),
    });
  }

  const user = getUserByEmail(email);
  if (!user) {
    return new Response(null, {
      status: 303,
      headers: new Headers({ Location: '/login?error=badlogin' }),
    });
  }

  setUserPassword(user.id, password);

  return new Response(null, {
    status: 303,
    headers: new Headers({ Location: '/login?set=1' }),
  });
};
