import * as jose from 'jose';

const COOKIE_NAME = 'internal-docs-session';
const DEFAULT_SECRET = 'change-me-in-production-use-env-SECRET';

function getSecret(): Uint8Array {
  const secret = import.meta.env.SECRET ?? process.env.SECRET ?? DEFAULT_SECRET;
  return new TextEncoder().encode(secret);
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  exp: number;
}

export async function signToken(payload: Omit<JWTPayload, 'exp'>): Promise<string> {
  const secret = getSecret();
  return await new jose.SignJWT({
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .setIssuedAt()
    .sign(secret);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const secret = getSecret();
    const { payload } = await jose.jwtVerify(token, secret);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

export function getCookieFromRequest(request: Request): string | null {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`(?:^|;)\\s*${COOKIE_NAME}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function setCookieHeader(token: string, maxAge = 60 * 60 * 24 * 7): string {
  return `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}`;
}

export function clearCookieHeader(): string {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

export { COOKIE_NAME };

const pendingTokens = new Map<string, string>();

export function setPendingToken(key: string, token: string) {
  pendingTokens.set(key, token);
  setTimeout(() => pendingTokens.delete(key), 60 * 1000);
}

export function takePendingToken(key: string): string | null {
  const token = pendingTokens.get(key) ?? null;
  pendingTokens.delete(key);
  return token;
}
