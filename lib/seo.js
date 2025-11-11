// SEO Utility Functions and Structured Data Generators

const SITE_URL = 'https://dnaturefood.com';
const SITE_NAME = 'DNAture';
const DEFAULT_IMAGE = '/images/hero3.jpg';

/**
 * Generate Organization structured data
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/images/dnature-logo.svg`,
    description:
      'Nutrición personalizada para mascotas basada en análisis de ADN',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'CR',
      addressLocality: 'Costa Rica',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+506-7184-8868',
      contactType: 'Customer Service',
      availableLanguage: ['Spanish'],
    },
    sameAs: [
      'https://www.facebook.com/dnaturefood',
      'https://www.instagram.com/dnaturefood',
    ],
  };
}

/**
 * Generate Product structured data
 */
export function generateProductSchema(product) {
  if (!product) return null;

  // Validate required fields
  if (!product.productName || !product.urlSlug) {
    console.warn('Product schema generation skipped: missing required fields', {
      productName: product.productName,
      urlSlug: product.urlSlug,
    });
    return null;
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.productName,
    description:
      product.description?.replace(/<[^>]*>/g, '') ||
      `${product.productName} - Nutrición natural para mascotas`,
    image: product.images?.[0]?.url || DEFAULT_IMAGE,
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
    },
    offers: {
      '@type': 'Offer',
      price: product.precio,
      priceCurrency: 'CRC',
      availability: 'https://schema.org/InStock',
      url: `${SITE_URL}/productos/${product.urlSlug}`,
    },
  };

  // Include aggregateRating if rating is available
  // Use reviewCount from product data, or default to 1 if not provided
  // Google requires reviewCount for rich results eligibility
  // Only include aggregateRating if both rating and reviewCount are present and valid
  if (
    typeof product.rating === 'number' &&
    typeof product.reviewCount === 'number' &&
    product.reviewCount > 0
  ) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
      bestRating: 5,
      reviewCount: product.reviewCount || 1,
    };
  }

  return schema;
}

/**
 * Generate BreadcrumbList structured data
 */
export function generateBreadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

/**
 * Generate FAQPage structured data
 */
export function generateFAQSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate WebSite structured data
 */
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/productos?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Generate LocalBusiness structured data (if you have a physical location)
 */
export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: SITE_NAME,
    image: `${SITE_URL}/images/dnature-logo.svg`,
    '@id': SITE_URL,
    url: SITE_URL,
    telephone: '+506-7184-8868',
    priceRange: '₡₡',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'CR',
      addressLocality: 'Costa Rica',
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '18:00',
    },
  };
}

/**
 * Generate Article structured data for blog posts
 */
export function generateArticleSchema(post) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    image: post.image || DEFAULT_IMAGE,
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/images/dnature-logo.svg`,
      },
    },
    datePublished: post.publishedDate,
    dateModified: post.modifiedDate || post.publishedDate,
  };
}

/**
 * Helper to combine multiple schemas
 */
export function combineSchemas(...schemas) {
  return schemas.filter(Boolean);
}

export { SITE_URL, SITE_NAME, DEFAULT_IMAGE };
