import type { APIRoute } from 'astro';
import { findAndConsumeCode, createUser, verifyUserPassword, isAdminByEmail } from '../../lib/auth-data';
import { signToken, setPendingToken } from '../../lib/auth';

export const POST: APIRoute = async ({ request }) => {
  const form = await request.formData();
  const code = (form.get('code') as string)?.trim();
  const email = (form.get('email') as string)?.trim();
  const password = (form.get('password') as string) || '';
  const role = (form.get('role') as string)?.trim() || 'member';
  const startDate = (form.get('startDate') as string)?.trim();
  const githubUrl = (form.get('githubUrl') as string)?.trim() || undefined;

  // Returning user: email + password (no access code)
  if (email && password && !code) {
    const { getUserByEmail } = await import('../../lib/auth-data');
    const existingUser = getUserByEmail(email);
    if (existingUser && !existingUser.passwordHash) {
      return new Response(null, {
        status: 303,
        headers: new Headers({ Location: `/login/set-password?email=${encodeURIComponent(email)}` }),
      });
    }
    const user = verifyUserPassword(email, password);
    if (!user) {
      return new Response(null, {
        status: 303,
        headers: new Headers({ Location: '/login?error=badlogin' }),
      });
    }
    const token = await signToken({
      userId: user.id,
      email: user.email,
      role: isAdminByEmail(user.email) ? 'admin' : user.role,
    });
    const key = Math.random().toString(36).slice(2, 12);
    setPendingToken(key, token);
    return new Response(null, {
      status: 303,
      headers: new Headers({ Location: `/auth/set?k=${key}` }),
    });
  }

  // New user: access code required
  if (!code || !email || !startDate) {
    return new Response(null, {
      status: 303,
      headers: new Headers({ Location: '/login?error=missing' }),
    });
  }

  const accessCode = findAndConsumeCode(code);
  if (!accessCode) {
    return new Response(null, {
      status: 303,
      headers: new Headers({ Location: '/login?error=invalid' }),
    });
  }

  const user = createUser({
    email,
    code,
    role: role || accessCode.role,
    startDate,
    githubUrl,
    password: (form.get('signup-password') as string) || undefined,
  });

  const token = await signToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  const key = Math.random().toString(36).slice(2, 12);
  setPendingToken(key, token);

  return new Response(null, {
    status: 303,
    headers: new Headers({ Location: `/auth/set?k=${key}` }),
  });
};
