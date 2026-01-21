// Alternative Next.js configuration
// If unoptimized: true breaks local development, use this version instead

module.exports = {
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    // Loader configuration for Contentful images
    loader: 'custom',
    loaderFile: './imageLoader.js',
  },
};
