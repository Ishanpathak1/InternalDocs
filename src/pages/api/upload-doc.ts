import type { APIRoute } from 'astro';
import { writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const DOCS_DIR = join(process.cwd(), 'src', 'content', 'docs');
const MAX_SIZE = 2 * 1024 * 1024; // 2 MB

function safeSlug(name: string): string {
  return name
    .replace(/\.md$/i, '')
    .replace(/[^a-zA-Z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase() || 'doc';
}

export const POST: APIRoute = async ({ request, locals }) => {
  const user = locals.user;
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const contentType = request.headers.get('content-type') || '';
  if (!contentType.includes('multipart/form-data')) {
    return new Response(JSON.stringify({ error: 'Expect multipart/form-data' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file || file.size === 0) {
    return new Response(JSON.stringify({ error: 'No file or empty file' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (file.size > MAX_SIZE) {
    return new Response(JSON.stringify({ error: 'File too large (max 2 MB)' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const name = file.name || 'doc';
  if (!name.toLowerCase().endsWith('.md')) {
    return new Response(JSON.stringify({ error: 'Only .md files are allowed' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const slug = safeSlug(name);
  const filePath = join(DOCS_DIR, `${slug}.md`);

  if (existsSync(filePath)) {
    return new Response(JSON.stringify({ error: 'A doc with this slug already exists' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  writeFileSync(filePath, buffer, 'utf-8');

  return new Response(JSON.stringify({ ok: true, slug }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
