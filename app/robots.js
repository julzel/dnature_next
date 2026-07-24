import { absoluteUrl, siteUrl } from '../constants/seo';

const robots = () => ({
  rules: {
    userAgent: '*',
    allow: '/',
    disallow: ['/avify-test/', '/cart/'],
  },
  sitemap: absoluteUrl('/sitemap.xml'),
  host: siteUrl,
});

export default robots;
