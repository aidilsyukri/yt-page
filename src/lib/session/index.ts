import { cookies } from 'next/headers';
import { SessionUser } from '@/types';

const SESSION_COOKIE = 'pagenet_session';
const USER_COOKIE = 'pagenet_user';

// Encode token into cookie value
function encodeToken(token: string): string {
  return Buffer.from(token).toString('base64');
}

function decodeToken(encoded: string): string {
  return Buffer.from(encoded, 'base64').toString('utf-8');
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get(SESSION_COOKIE);
  const userCookie = cookieStore.get(USER_COOKIE);

  if (!tokenCookie?.value || !userCookie?.value) return null;

  try {
    const token = decodeToken(tokenCookie.value);
    const user = JSON.parse(Buffer.from(userCookie.value, 'base64').toString('utf-8'));
    return { ...user, accessToken: token };
  } catch {
    return null;
  }
}

export function createSessionCookies(user: SessionUser): Record<string, string> {
  const tokenEncoded = encodeToken(user.accessToken);
  const userEncoded = Buffer.from(JSON.stringify({
    id: user.id,
    name: user.name,
    pictureUrl: user.pictureUrl,
  })).toString('base64');

  return {
    [SESSION_COOKIE]: tokenEncoded,
    [USER_COOKIE]: userEncoded,
  };
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE;
export const USER_COOKIE_NAME = USER_COOKIE;
export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: '/',
};
