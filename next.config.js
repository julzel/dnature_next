module.exports = {
  distDir: process.env.E2E_DIST_DIR || '.next',
  ...(process.env.E2E_USE_FIXTURES === '1'
    ? {
        sassOptions: {
          silenceDeprecations: ['import', 'global-builtin', 'color-functions'],
        },
      }
    : {}),
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
    // Disable image optimization to avoid _ipx errors with external images
    unoptimized: true,
  },
};
