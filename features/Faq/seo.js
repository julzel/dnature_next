import { absoluteUrl } from '../../constants/seo';
import { faqCategories } from './FaqList/data';

const FAQ_PATH = '/preguntas-frecuentes';
const FAQ_TITLE = 'Preguntas frecuentes sobre alimentación natural para mascotas';
const FAQ_DESCRIPTION =
  'Respuestas de DNAture sobre alimentación natural, dietas, conservación, pedidos, entregas y cuidados para perros y gatos en Costa Rica.';
const FAQ_LAST_MODIFIED = '2026-08-10';

const blockText = (block) => {
  if (block.items) return block.items.join(' ');
  if (block.content) {
    return block.content
      .map((part) => (typeof part === 'string' ? part : part.text))
      .join('');
  }
  return block.text || '';
};

const externalCitations = (blocks) => [
  ...new Set(
    blocks.flatMap((block) =>
      (block.content || [])
        .filter(
          (part) =>
            typeof part !== 'string' && /^https:\/\//.test(part.href),
        )
        .map((part) => part.href),
    ),
  ),
];

const createFaqStructuredData = () => {
  const homepageUrl = absoluteUrl('/');
  const faqUrl = absoluteUrl(FAQ_PATH);
  const publisher = {
    '@type': 'Organization',
    name: 'DNAture',
    url: homepageUrl,
  };

  const questions = faqCategories.flatMap((category) =>
    category.items.map((item) => {
      const citations = externalCitations(item.blocks);

      return {
        '@type': 'Question',
        '@id': `${faqUrl}#faq-${item.id}`,
        url: `${faqUrl}#faq-${item.id}`,
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          inLanguage: 'es-CR',
          text: item.blocks.map(blockText).join(' '),
          author: publisher,
          ...(citations.length ? { citation: citations } : {}),
        },
      };
    }),
  );

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'FAQPage',
        '@id': `${faqUrl}#webpage`,
        url: faqUrl,
        name: FAQ_TITLE,
        description: FAQ_DESCRIPTION,
        inLanguage: 'es-CR',
        dateModified: FAQ_LAST_MODIFIED,
        publisher,
        breadcrumb: { '@id': `${faqUrl}#breadcrumb` },
        mainEntity: questions,
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${faqUrl}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Inicio',
            item: homepageUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Preguntas frecuentes',
            item: faqUrl,
          },
        ],
      },
    ],
  };
};

const serializeStructuredData = (data) =>
  JSON.stringify(data).replace(/</g, '\\u003c');

export {
  FAQ_DESCRIPTION,
  FAQ_LAST_MODIFIED,
  FAQ_PATH,
  FAQ_TITLE,
  createFaqStructuredData,
  serializeStructuredData,
};
