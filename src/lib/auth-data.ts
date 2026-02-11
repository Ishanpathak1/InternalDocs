import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';

const DATA_DIR = join(process.cwd(), 'data');
const CODES_PATH = join(DATA_DIR, 'access-codes.json');
const USERS_PATH = join(DATA_DIR, 'users.json');
const ADMINS_PATH = join(DATA_DIR, 'admins.json');

export interface AccessCode {
  code: string;
  role: string;
  createdAt: string;
  usedAt?: string;
}

export interface User {
  id: string;
  email: string;
  code: string;
  role: string;
  startDate: string;
  avatarPath?: string;
  githubUrl?: string;
  passwordHash?: string;
  createdAt: string;
}

function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readCodes(): AccessCode[] {
  ensureDataDir();
  if (!existsSync(CODES_PATH)) {
    writeFileSync(CODES_PATH, '[]');
    return [];
  }
  const raw = readFileSync(CODES_PATH, 'utf-8');
  return JSON.parse(raw) as AccessCode[];
}

function writeCodes(codes: AccessCode[]) {
  ensureDataDir();
  writeFileSync(CODES_PATH, JSON.stringify(codes, null, 2));
}

function readUsers(): User[] {
  ensureDataDir();
  if (!existsSync(USERS_PATH)) {
    writeFileSync(USERS_PATH, '[]');
    return [];
  }
  const raw = readFileSync(USERS_PATH, 'utf-8');
  return JSON.parse(raw) as User[];
}

function writeUsers(users: User[]) {
  ensureDataDir();
  writeFileSync(USERS_PATH, JSON.stringify(users, null, 2));
}

/** Admin list: array of email addresses with admin access. */
function readAdminEmails(): string[] {
  ensureDataDir();
  if (!existsSync(ADMINS_PATH)) {
    writeFileSync(ADMINS_PATH, '[]');
    return [];
  }
  const raw = readFileSync(ADMINS_PATH, 'utf-8');
  return JSON.parse(raw) as string[];
}

function writeAdminEmails(emails: string[]) {
  ensureDataDir();
  writeFileSync(ADMINS_PATH, JSON.stringify(emails, null, 2));
}

/** Find an unused access code and return it, or null. */
export function findAndConsumeCode(code: string): AccessCode | null {
  const codes = readCodes();
  const index = codes.findIndex((c) => c.code === code && !c.usedAt);
  if (index === -1) return null;
  codes[index].usedAt = new Date().toISOString();
  writeCodes(codes);
  return codes[index];
}

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const derived = scryptSync(password, salt, 64);
  try {
    return timingSafeEqual(Buffer.from(hash, 'hex'), derived);
  } catch {
    return false;
  }
}

/** Create a new user and return it. Role is set to admin if email is in admin list. */
export function createUser(params: {
  email: string;
  code: string;
  role: string;
  startDate: string;
  avatarPath?: string;
  githubUrl?: string;
  password?: string;
}): User {
  const users = readUsers();
  const adminEmails = readAdminEmails();
  const isAdminEmail = adminEmails.some((e) => e.toLowerCase() === params.email.toLowerCase());
  const id = `user-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const user: User = {
    id,
    email: params.email.toLowerCase(),
    code: params.code,
    role: isAdminEmail ? 'admin' : params.role,
    startDate: params.startDate,
    avatarPath: params.avatarPath,
    githubUrl: params.githubUrl,
    passwordHash: params.password ? hashPassword(params.password) : undefined,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  writeUsers(users);
  return user;
}

/** Verify email + password and return user, or null. */
export function verifyUserPassword(email: string, password: string): User | null {
  const user = getUserByEmail(email);
  if (!user?.passwordHash) return null;
  if (!verifyPassword(password, user.passwordHash)) return null;
  return user;
}

/** Set password for existing user (e.g. from profile). */
export function setUserPassword(userId: string, password: string) {
  const users = readUsers();
  const index = users.findIndex((u) => u.id === userId);
  if (index === -1) return null;
  users[index].passwordHash = hashPassword(password);
  writeUsers(users);
  return users[index];
}

/** Get user by id. */
export function getUserById(id: string): User | null {
  const users = readUsers();
  return users.find((u) => u.id === id) ?? null;
}

/** List all users. */
export function listUsers(): User[] {
  return readUsers();
}

/** Generate a new one-time access code. */
export function generateAccessCode(role: string = 'member'): string {
  const code = `code-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
  const codes = readCodes();
  codes.push({
    code,
    role,
    createdAt: new Date().toISOString(),
  });
  writeCodes(codes);
  return code;
}

/** List of email addresses that have admin access (create/give access codes). */
export function getAdminEmails(): string[] {
  return readAdminEmails();
}

/** Check if an email has admin access. */
export function isAdminByEmail(email: string): boolean {
  const admins = readAdminEmails();
  return admins.some((e) => e.toLowerCase() === email.toLowerCase());
}

/** Check if user (by id) is admin (their email is in admin list). */
export function isAdmin(userId: string): boolean {
  const user = getUserById(userId);
  return user ? isAdminByEmail(user.email) : false;
}

/** Add an email to the admin list. */
export function addAdminEmail(email: string) {
  const emails = readAdminEmails();
  const normalized = email.toLowerCase();
  if (emails.some((e) => e.toLowerCase() === normalized)) return;
  emails.push(normalized);
  writeAdminEmails(emails);
}

/** Update user (e.g. avatar, role, startDate, githubUrl). */
export function updateUser(
  id: string,
  updates: Partial<Pick<User, 'role' | 'startDate' | 'avatarPath' | 'githubUrl' | 'passwordHash'>>
) {
  const users = readUsers();
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return null;
  users[index] = { ...users[index], ...updates };
  writeUsers(users);
  return users[index];
}

/** Get user by email. */
export function getUserByEmail(email: string): User | null {
  const users = readUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}
