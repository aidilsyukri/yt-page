import { NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME, USER_COOKIE_NAME } from '@/lib/session';

export async function GET() {
  const baseUrl = process.env.NEXTAUTH_URL ?? 'http://localhost:3000';
  const response = NextResponse.redirect(`${baseUrl}/`);

  response.cookies.delete(SESSION_COOKIE_NAME);
  response.cookies.delete(USER_COOKIE_NAME);

  return response;
}
