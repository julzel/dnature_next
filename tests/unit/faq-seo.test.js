import { describe, expect, it } from 'vitest';

import { faqCategories } from '../../features/Faq/FaqList/data';
import {
  FAQ_DESCRIPTION,
  FAQ_LAST_MODIFIED,
  FAQ_TITLE,
  createFaqStructuredData,
  serializeStructuredData,
} from '../../features/Faq/seo';

describe('FAQ search metadata', () => {
  const structuredData = createFaqStructuredData();
  const faqPage = structuredData['@graph'].find(
    (entry) => entry['@type'] === 'FAQPage',
  );
  const breadcrumbs = structuredData['@graph'].find(
    (entry) => entry['@type'] === 'BreadcrumbList',
  );

  it('publishes a complete Google-compatible FAQPage graph', () => {
    const visibleQuestions = faqCategories.flatMap(
      (category) => category.items,
    );

    expect(structuredData['@context']).toBe('https://schema.org');
    expect(faqPage).toMatchObject({
      name: FAQ_TITLE,
      description: FAQ_DESCRIPTION,
      inLanguage: 'es-CR',
      dateModified: FAQ_LAST_MODIFIED,
      publisher: {
        '@type': 'Organization',
        name: 'DNAture',
      },
    });
    expect(faqPage.mainEntity).toHaveLength(65);
    expect(faqPage.mainEntity.map(({ name }) => name)).toEqual(
      visibleQuestions.map(({ question }) => question),
    );

    for (const question of faqPage.mainEntity) {
      expect(question['@type']).toBe('Question');
      expect(question.url).toMatch(/\/preguntas-frecuentes\/#faq-/);
      expect(question.acceptedAnswer).toMatchObject({
        '@type': 'Answer',
        inLanguage: 'es-CR',
        author: {
          '@type': 'Organization',
          name: 'DNAture',
        },
      });
      expect(question.acceptedAnswer.text.length).toBeGreaterThan(20);
    }
  });

  it('adds valid breadcrumbs and visible source citations', () => {
    expect(breadcrumbs.itemListElement).toHaveLength(2);
    expect(breadcrumbs.itemListElement).toEqual([
      expect.objectContaining({ position: 1, name: 'Inicio' }),
      expect.objectContaining({ position: 2, name: 'Preguntas frecuentes' }),
    ]);

    const barfQuestion = faqPage.mainEntity.find(
      ({ name }) => name === '¿La alimentación natural es lo mismo que BARF?',
    );
    expect(barfQuestion.acceptedAnswer.citation).toEqual([
      'https://wsava.org/wp-content/uploads/2021/04/Raw-Meat-Based-Diets-for-Pets_WSAVA-Global-Nutrition-Toolkit.pdf',
    ]);
  });

  it('serializes JSON-LD without allowing closing-tag injection', () => {
    expect(serializeStructuredData({ text: '</script>' })).toBe(
      '{"text":"\\u003c/script>"}',
    );
  });
});
