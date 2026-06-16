import { NextResponse } from 'next/server';
import { FACEBOOK_AUTH_URL, OAUTH_SCOPES } from '@/lib/facebook/types';
import crypto from 'crypto';

export async function GET() {
  const appId = process.env.FACEBOOK_APP_ID;
  const redirectUri = process.env.FACEBOOK_REDIRECT_URI ?? `${process.env.NEXTAUTH_URL}/api/auth/callback`;

  if (!appId) {
    return NextResponse.json({ error: 'Facebook App ID is not configured' }, { status: 500 });
  }

  // CSRF protection state parameter
  const state = crypto.randomBytes(16).toString('hex');

  const params = new URLSearchParams({
    client_id: appId,
    redirect_uri: redirectUri,
    scope: OAUTH_SCOPES,
    response_type: 'code',
    state,
  });

  const authUrl = `${FACEBOOK_AUTH_URL}?${params.toString()}`;

  const response = NextResponse.redirect(authUrl);
  // Store state in cookie for CSRF verification
  response.cookies.set('fb_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600, // 10 minutes
    path: '/',
  });

  return response;
}
