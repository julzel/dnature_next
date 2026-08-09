import { absoluteUrl, siteUrl } from '../constants/seo';

const robots = () => ({
  rules: {
    userAgent: '*',
    allow: '/',
    disallow: ['/avify-test/', '/cart/', '/checkout/', '/cuenta/'],
  },
  sitemap: absoluteUrl('/sitemap.xml'),
  host: siteUrl,
});

export default robots;
