module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://dnaturefood.com",
  generateRobotsTxt: true,
  changefreq: "daily",
  priority: 0.7,
  sitemapSize: 5000,
  exclude: [],
  robotsTxtOptions: {
    additionalSitemaps: [],
  },
  additionalPaths: async (config) => {
    return [
      {
        loc: "/",
        priority: 1.0,
        changefreq: config.changefreq,
      },
      {
        loc: "/calculadora",
        priority: 0.5,
        changefreq: config.changefreq,
      },
    ];
  },
};
