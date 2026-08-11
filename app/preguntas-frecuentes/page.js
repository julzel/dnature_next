import Faq from '../../features/Faq';
import { faqCategories } from '../../features/Faq/FaqList/data';
import { createPageMetadata } from '../../constants/seo';

export const metadata = createPageMetadata({
  title: 'Preguntas frecuentes',
  description:
    'Encontrá respuestas sobre alimentación natural, dietas DNAture, conservación, pedidos, entregas y cuidados para perros y gatos.',
  path: '/preguntas-frecuentes',
});

const blockText = (block) => {
  if (block.items) return block.items.join(' ');
  if (block.content) {
    return block.content
      .map((part) => (typeof part === 'string' ? part : part.text))
      .join('');
  }
  return block.text || '';
};

const faqStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqCategories.flatMap((category) =>
    category.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.blocks.map(blockText).join(' '),
      },
    })),
  ),
};

const FaqPage = () => (
  <>
    <Faq />
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(faqStructuredData).replace(/</g, '\\u003c'),
      }}
    />
  </>
);

export default FaqPage;
