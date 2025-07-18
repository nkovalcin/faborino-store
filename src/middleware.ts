import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // A list of all locales that are supported
  locales: ['sk', 'en', 'de', 'fr'],

  // Used when no locale matches
  defaultLocale: 'sk'
});

export const config = {
  // Match only internationalized pathnames
  matcher: [
    // Enable a redirect to a matching locale at the root
    '/',

    // Set a cookie to remember the previous locale for
    // all requests that have a locale prefix
    '/(sk|en|de|fr)/:path*',

    // Enable redirects that add missing locales
    // (e.g. `/products` -> `/en/products`)
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};