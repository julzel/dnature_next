import { absoluteUrl, siteUrl } from '../constants/seo';

const privateRoutes = ['/avify-test/', '/cart/', '/checkout/', '/cuenta/'];

const robots = () => ({
  rules: [
    {
      userAgent: '*',
      allow: '/',
      disallow: privateRoutes,
    },
    {
      // Search discovery only; broader crawler policy remains unchanged.
      userAgent: 'OAI-SearchBot',
      allow: '/',
      disallow: privateRoutes,
    },
  ],
  sitemap: absoluteUrl('/sitemap.xml'),
  host: siteUrl,
});

export default robots;
