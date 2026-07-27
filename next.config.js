module.exports = {
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net',
        pathname: '/**',
      },
    ],
    // Contentful asset URLs are content-hashed, so optimized variants can be
    // cached for a full usage period without serving stale image revisions.
    minimumCacheTTL: 2678400,
    // Keep the responsive variant set focused on widths the site actually uses.
    deviceSizes: [360, 640, 768, 1024, 1280, 1600],
    imageSizes: [48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
  },
};
