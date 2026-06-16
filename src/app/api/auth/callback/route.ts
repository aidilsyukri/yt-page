import { NextRequest, NextResponse } from 'next/server';
import { FACEBOOK_TOKEN_URL } from '@/lib/facebook/types';
import { getUserProfile } from '@/lib/facebook/client';
import { SESSION_COOKIE_NAME, USER_COOKIE_NAME, COOKIE_OPTIONS, createSessionCookies } from '@/lib/session';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  const baseUrl = process.env.NEXTAUTH_URL ?? 'http://localhost:3000';

  // Handle user cancelling login
  if (error) {
    return NextResponse.redirect(`${baseUrl}/?error=access_denied`);
  }

  if (!code) {
    return NextResponse.redirect(`${baseUrl}/?error=no_code`);
  }

  // CSRF check
  const storedState = request.cookies.get('fb_oauth_state')?.value;
  if (!storedState || storedState !== state) {
    return NextResponse.redirect(`${baseUrl}/?error=invalid_state`);
  }

  const appId = process.env.FACEBOOK_APP_ID;
  const appSecret = process.env.FACEBOOK_APP_SECRET;
  const redirectUri = process.env.FACEBOOK_REDIRECT_URI ?? `${baseUrl}/api/auth/callback`;

  if (!appId || !appSecret) {
    return NextResponse.redirect(`${baseUrl}/?error=misconfigured`);
  }

  try {
    // Exchange code for access token
    const tokenParams = new URLSearchParams({
      client_id: appId,
      client_secret: appSecret,
      redirect_uri: redirectUri,
      code,
    });

    const tokenRes = await fetch(`${FACEBOOK_TOKEN_URL}?${tokenParams.toString()}`);
    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || tokenData.error) {
      throw new Error(tokenData.error?.message ?? 'Token exchange failed');
    }

    const accessToken: string = tokenData.access_token;

    // Fetch user profile
    const profile = await getUserProfile(accessToken);

    const cookies = createSessionCookies({
      id: profile.id,
      name: profile.name,
      pictureUrl: profile.picture?.data?.url,
      accessToken,
    });

    const response = NextResponse.redirect(`${baseUrl}/dashboard`);

    // Set session cookies
    response.cookies.set(SESSION_COOKIE_NAME, cookies[SESSION_COOKIE_NAME], COOKIE_OPTIONS);
    response.cookies.set(USER_COOKIE_NAME, cookies[USER_COOKIE_NAME], COOKIE_OPTIONS);

    // Clear CSRF state cookie
    response.cookies.delete('fb_oauth_state');

    return response;
  } catch (err) {
    console.error('OAuth callback error:', err);
    return NextResponse.redirect(`${baseUrl}/?error=auth_failed`);
  }
}
