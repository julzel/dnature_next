const ignoredNameTokens = new Set([
  'dna',
  'dnature',
  'de',
  'del',
  'el',
  'la',
  'las',
  'los',
  'y',
]);

const normalizeText = (value) =>
  String(value || '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const normalizeNameTokens = (value) =>
  normalizeText(value)
    .split(' ')
    .filter(Boolean)
    .filter((token) => !ignoredNameTokens.has(token))
    .map((token) => {
      if (token.length > 5 && token.endsWith('es')) {
        return token.slice(0, -2);
      }

      if (token.length > 4 && token.endsWith('s')) {
        return token.slice(0, -1);
      }

      return token;
    });

const canonicalName = (value) => normalizeNameTokens(value).sort().join(' ');

const nameSimilarity = (left, right) => {
  const leftTokens = new Set(normalizeNameTokens(left));
  const rightTokens = new Set(normalizeNameTokens(right));

  if (!leftTokens.size || !rightTokens.size) {
    return 0;
  }

  const intersection = [...leftTokens].filter((token) =>
    rightTokens.has(token)
  ).length;

  return (2 * intersection) / (leftTokens.size + rightTokens.size);
};

const isInternalAvifyProduct = (product) =>
  /^mp\b/i.test(product?.name || '') ||
  product?.categories?.some(
    ({ label }) => normalizeText(label) === 'materia prima'
  );

const scoreCandidate = (contentful, avify) => {
  const exact =
    (canonicalName(contentful.name) &&
      canonicalName(contentful.name) === canonicalName(avify.name)) ||
    (canonicalName(contentful.slug) &&
      canonicalName(contentful.slug) === canonicalName(avify.slug));
  const score = exact
    ? 1
    : Math.max(
        nameSimilarity(contentful.name, avify.name),
        nameSimilarity(contentful.slug, avify.slug || avify.name)
      );

  return { avify, exact, score };
};

const classifyContentfulProduct = (contentful, avifyProducts) => {
  const candidates = avifyProducts
    .map((avify) => scoreCandidate(contentful, avify))
    .sort((left, right) => right.score - left.score);
  const best = candidates[0] || null;
  const second = candidates[1] || null;
  const gap = best ? best.score - (second?.score || 0) : 0;
  let status = 'review';

  if (best?.exact) {
    status = 'matched';
  } else if (best?.score >= 0.72 && gap >= 0.12) {
    status = 'likely';
  }

  return {
    contentful,
    best,
    second,
    gap,
    status,
  };
};

const toFiniteNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

const normalizePresentation = (value) => {
  const normalized = String(value || '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(',', '.')
    .replace(/[^a-z0-9.]+/g, '');
  const weight = normalized.match(/^(\d+(?:\.\d+)?)(kg|k|g)$/);

  if (weight) {
    const amount = Number(weight[1]);
    const grams = weight[2] === 'g' ? amount : amount * 1000;
    return `${grams}g`;
  }

  const volume = normalized.match(/^(\d+(?:\.\d+)?)(ml|l)$/);

  if (volume) {
    const amount = Number(volume[1]);
    const milliliters = volume[2] === 'ml' ? amount : amount * 1000;
    return `${milliliters}ml`;
  }

  return normalized
    .replace(/^mediana$/, 'mediano')
    .replace(/^pequena$/, 'pequeno');
};

const findPriceDifferences = (matches) => {
  const differences = [];

  for (const match of matches.filter(({ status }) => status === 'matched')) {
    const contentful = match.contentful;
    const avify = match.best.avify;
    const unitPrices =
      contentful.unitPrices &&
      typeof contentful.unitPrices === 'object' &&
      !Array.isArray(contentful.unitPrices)
        ? Object.entries(contentful.unitPrices)
        : [];
    const contentfulPrice = toFiniteNumber(contentful.price);
    const unitPriceValues = unitPrices
      .map(([, price]) => toFiniteNumber(price))
      .filter((price) => price !== null);

    if (
      unitPriceValues.length &&
      contentfulPrice !== null &&
      !unitPriceValues.includes(contentfulPrice)
    ) {
      differences.push({
        type: 'contentful',
        product: contentful.name,
        presentation: 'precio',
        contentfulPrice,
        avifyPrice: null,
        detail: 'El precio principal no coincide con ninguna presentación.',
      });
    }

    if (unitPrices.length && avify.variants?.length) {
      const variantsByPresentation = new Map(
        avify.variants.map((variant) => [
          normalizePresentation(variant.name),
          variant,
        ])
      );

      for (const [presentation, price] of unitPrices) {
        const variant = variantsByPresentation.get(
          normalizePresentation(presentation)
        );
        const normalizedContentfulPrice = toFiniteNumber(price);

        if (
          variant &&
          normalizedContentfulPrice !== null &&
          variant.price !== null &&
          normalizedContentfulPrice !== variant.price
        ) {
          differences.push({
            type: 'cross-system',
            product: contentful.name,
            presentation,
            contentfulPrice: normalizedContentfulPrice,
            avifyPrice: variant.price,
            detail: 'La misma presentación tiene precios diferentes.',
          });
        }
      }

      continue;
    }

    const avifyPrices = [
      avify.price,
      ...(avify.variants || []).map(({ price }) => price),
    ].filter((price) => typeof price === 'number');

    if (
      contentfulPrice !== null &&
      avifyPrices.length &&
      !avifyPrices.includes(contentfulPrice)
    ) {
      differences.push({
        type: 'cross-system',
        product: contentful.name,
        presentation: contentful.measure || 'principal',
        contentfulPrice,
        avifyPrice: avify.price,
        detail: 'No se encontró el precio de Contentful en Avify.',
      });
    }
  }

  return differences;
};

const countBy = (items, getKey) =>
  Object.fromEntries(
    [...items.reduce((counts, item) => {
      const key = getKey(item);

      if (key) {
        counts.set(key, (counts.get(key) || 0) + 1);
      }

      return counts;
    }, new Map()).entries()].sort((left, right) => right[1] - left[1])
  );

const buildCatalogReconciliation = (contentfulProducts, avifyProducts) => {
  const internalAvifyProducts = avifyProducts.filter(isInternalAvifyProduct);
  const catalogCandidates = avifyProducts.filter(
    (product) => !isInternalAvifyProduct(product)
  );
  const matches = contentfulProducts.map((product) =>
    classifyContentfulProduct(product, catalogCandidates)
  );
  const pairedAvifyIds = new Set(
    matches
      .filter(({ status }) => status !== 'review')
      .map(({ best }) => String(best.avify.id))
  );
  const variants = avifyProducts.flatMap((product) => product.variants || []);
  const reviewItems = matches
    .filter(({ status }) => status === 'review')
    .map(({ contentful, best, second, gap }) => {
      const hasUsefulCandidate = Boolean(best && best.score >= 0.45);

      return {
        contentfulId: contentful.id,
        contentfulName: contentful.name,
        candidateName: hasUsefulCandidate ? best.avify.name : null,
        candidateSku: hasUsefulCandidate
          ? best.avify.customSku || best.avify.sku
          : null,
        score: best?.score || 0,
        alternativeName:
          hasUsefulCandidate && second?.score >= 0.45
            ? second.avify.name
            : null,
        ambiguous: Boolean(
          hasUsefulCandidate && second?.score >= 0.45 && gap < 0.12
        ),
      };
    });
  const likelyItems = matches
    .filter(({ status }) => status === 'likely')
    .map(({ contentful, best }) => ({
      contentfulId: contentful.id,
      contentfulName: contentful.name,
      avifyName: best.avify.name,
      avifySku: best.avify.customSku || best.avify.sku,
      score: best.score,
    }));
  const unpairedAvify = catalogCandidates
    .filter(({ id }) => !pairedAvifyIds.has(String(id)))
    .map((product) => ({
      id: product.id,
      name: product.name,
      sku: product.customSku || product.sku,
      category: product.categories?.[0]?.label || 'Sin categoría',
    }));

  return {
    generatedAt: new Date().toISOString(),
    summary: {
      contentfulTotal: contentfulProducts.length,
      avifyBaseTotal: avifyProducts.length,
      avifyVariantTotal: variants.length,
      matched: matches.filter(({ status }) => status === 'matched').length,
      likely: likelyItems.length,
      needsReview: reviewItems.length,
      avifyInternal: internalAvifyProducts.length,
      avifyUnpaired: unpairedAvify.length,
    },
    contentfulHealth: {
      missingSlug: contentfulProducts
        .filter(({ slug }) => !slug)
        .map(({ id, name }) => ({ id, name })),
      missingImages: contentfulProducts.filter(({ hasImage }) => !hasImage)
        .length,
      missingDescription: contentfulProducts.filter(
        ({ hasDescription }) => !hasDescription
      ).length,
      missingIngredients: contentfulProducts.filter(
        ({ hasIngredients }) => !hasIngredients
      ).length,
      withPresentationPrices: contentfulProducts.filter(
        ({ unitPrices }) =>
          unitPrices &&
          typeof unitPrices === 'object' &&
          Object.keys(unitPrices).length
      ).length,
    },
    avifyHealth: {
      baseStatuses: countBy(avifyProducts, ({ status }) => status),
      variantStatuses: countBy(variants, ({ status }) => status),
      missingBaseCustomSku: avifyProducts.filter(({ customSku }) => !customSku)
        .length,
      missingVariantCustomSku: variants.filter(({ customSku }) => !customSku)
        .length,
      zeroStockVariants: variants.filter(({ quantity }) => quantity === 0)
        .length,
      uncategorized: avifyProducts.filter(
        ({ categories }) => !categories?.length
      ).length,
    },
    categories: {
      contentful: countBy(contentfulProducts, ({ category }) => category),
      avify: countBy(
        avifyProducts.flatMap((product) => product.categories || []),
        ({ label }) => label
      ),
    },
    priceDifferences: findPriceDifferences(matches),
    likelyItems,
    reviewItems,
    unpairedAvify,
  };
};

export {
  buildCatalogReconciliation,
  canonicalName,
  isInternalAvifyProduct,
  nameSimilarity,
  normalizePresentation,
};
