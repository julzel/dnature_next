const PRODUCT_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const normalizeProductSlug = (value) => {
  if (typeof value !== 'string') {
    return null;
  }

  const normalized = value.trim().normalize('NFC').toLowerCase();

  return PRODUCT_SLUG_PATTERN.test(normalized) ? normalized : null;
};

const getProductPath = (slug) => {
  const normalizedSlug = normalizeProductSlug(slug);

  return normalizedSlug ? `/productos/${encodeURIComponent(normalizedSlug)}` : null;
};

export { getProductPath, normalizeProductSlug };
