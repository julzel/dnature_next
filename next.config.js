const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
  distDir: process.env.E2E_DIST_DIR || '.next',
  reactStrictMode: true,
  trailingSlash: true,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "base-uri 'self'",
              "object-src 'none'",
              "frame-ancestors 'self'",
              "form-action 'self'",
              [
                "script-src 'self' 'unsafe-inline'",
                isDevelopment ? "'unsafe-eval'" : '',
                'https://www.googletagmanager.com https://maps.googleapis.com https://maps.gstatic.com',
              ].filter(Boolean).join(' '),
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://images.ctfassets.net https://*.googleapis.com https://*.gstatic.com https://*.google.com https://*.ggpht.com",
              "font-src 'self' data:",
              "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://www.googletagmanager.com https://maps.googleapis.com https://*.googleapis.com https://*.gstatic.com https://*.google.com",
              "frame-src https://www.google.com https://maps.google.com",
              "worker-src 'self' blob:",
            ].join('; '),
          },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), geolocation=(), microphone=(), payment=()',
          },
        ],
      },
    ];
  },
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
  allowedDevOrigins: ['192.168.100.13'],
};
