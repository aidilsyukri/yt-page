export const FACEBOOK_API_VERSION = 'v25.0';
export const FACEBOOK_BASE_URL = `https://graph.facebook.com/${FACEBOOK_API_VERSION}`;
export const FACEBOOK_AUTH_URL = 'https://www.facebook.com/dialog/oauth';
export const FACEBOOK_TOKEN_URL = `https://graph.facebook.com/${FACEBOOK_API_VERSION}/oauth/access_token`;

export const OAUTH_SCOPES = [
  'public_profile',
  'pages_show_list',
  'pages_read_engagement',
  'pages_read_user_content',
].join(',');

// Categories used for the page category chips on the search page
export const PAGE_CATEGORIES = [
  'News',
  'Sports',
  'Education',
  'Entertainment',
  'Science & Technology',
  'NGO',
  'Business',
  'Music',
] as const;

export type PageCategory = typeof PAGE_CATEGORIES[number];
