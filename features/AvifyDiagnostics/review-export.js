const CONTENTFUL_APP_URL = 'https://app.contentful.com';

const buildContentfulEntryUrl = (
  spaceId,
  entryId,
  environmentId = 'master'
) => {
  const safeSpaceId = typeof spaceId === 'string' ? spaceId.trim() : '';
  const safeEntryId = typeof entryId === 'string' ? entryId.trim() : '';
  const safeEnvironmentId =
    typeof environmentId === 'string' ? environmentId.trim() : '';

  if (!safeSpaceId || !safeEntryId || !safeEnvironmentId) {
    return null;
  }

  return `${CONTENTFUL_APP_URL}/spaces/${encodeURIComponent(
    safeSpaceId
  )}/environments/${encodeURIComponent(
    safeEnvironmentId
  )}/entries/${encodeURIComponent(
    safeEntryId
  )}`;
};

const getReviewSignal = (item) => {
  if (item.candidateAlreadyPaired) {
    return 'Candidato ya vinculado';
  }

  if (item.ambiguous) {
    return 'Ambiguo';
  }

  return item.score < 0.45
    ? 'Sin coincidencia clara'
    : 'Revisar nombre';
};

const escapeCsvCell = (value) => {
  const text = String(value ?? '').replace(/\r?\n/g, ' ');
  const formulaSafeText = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;

  return `"${formulaSafeText.replace(/"/g, '""')}"`;
};

const buildReviewCsv = (reviewItems) => {
  const rows = [
    [
      'Producto Contentful',
      'Enlace Contentful',
      'Candidato Avify',
      'Custom SKU Avify',
      'SKU generado del padre',
      'Señal',
      'Confianza',
      'Alternativa Avify',
    ],
    ...reviewItems.map((item) => [
      item.contentfulName,
      item.contentfulUrl,
      item.candidateName,
      item.candidateCustomSku,
      item.candidateGeneratedSku,
      getReviewSignal(item),
      item.candidateName ? `${Math.round(item.score * 100)}%` : '',
      item.alternativeName,
    ]),
  ];

  return `\uFEFF${rows
    .map((row) => row.map(escapeCsvCell).join(','))
    .join('\r\n')}`;
};

const buildReviewCsvDataUrl = (reviewItems) =>
  `data:text/csv;charset=utf-8,${encodeURIComponent(
    buildReviewCsv(reviewItems)
  )}`;

export {
  buildContentfulEntryUrl,
  buildReviewCsv,
  buildReviewCsvDataUrl,
  getReviewSignal,
};
