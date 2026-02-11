import type { APIRoute } from 'astro';
import { generateAccessCode } from '../../../lib/auth-data';

export const POST: APIRoute = async ({ locals, request }) => {
  const user = locals.user;
  if (!user || user.role !== 'admin') {
    return new Response(JSON.stringify({ error: 'Forbidden' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const form = await request.formData();
  const role = (form.get('role') as string)?.trim() || 'member';

  const code = generateAccessCode(role);
  return new Response(JSON.stringify({ code }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
