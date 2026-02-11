import { defineMiddleware } from 'astro:middleware';
import { verifyToken, getCookieFromRequest } from './lib/auth';
import { getUserById, isAdmin } from './lib/auth-data';

export const onRequest = defineMiddleware(async ({ locals, request, redirect }, next) => {
  const token = getCookieFromRequest(request);
  let user: App.Locals['user'] = null;

  if (token) {
    const payload = await verifyToken(token);
    if (payload) {
      const dbUser = getUserById(payload.userId);
      if (dbUser) {
        const admin = isAdmin(dbUser.id);
        user = {
          id: dbUser.id,
          email: dbUser.email,
          role: admin ? 'admin' : dbUser.role,
          startDate: dbUser.startDate,
          avatarPath: dbUser.avatarPath,
          githubUrl: dbUser.githubUrl,
        };
      }
    }
  }

  locals.user = user;

  const url = new URL(request.url);
  const isLogin = url.pathname === '/login';
  const isAdminRoute = url.pathname.startsWith('/admin');
  const isDocs = url.pathname.startsWith('/docs');
  const isApiLogout = url.pathname === '/api/logout';
  const isApiLogin = url.pathname === '/api/login';
  const isAuthSet = url.pathname === '/auth/set';
  const isApiAdminCodes = url.pathname === '/api/admin/codes';

  if (!user && (isDocs || isAdminRoute) && !isLogin && !isApiLogin && !isAuthSet) {
    return redirect('/login');
  }

  if (user && isLogin) {
    return redirect('/docs');
  }

  if (isAdminRoute && user && user.role !== 'admin') {
    return redirect('/docs');
  }

  if (isApiAdminCodes && user && user.role !== 'admin') {
    return new Response(JSON.stringify({ error: 'Forbidden' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return next();
});
