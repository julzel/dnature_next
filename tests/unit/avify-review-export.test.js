import { describe, expect, it } from 'vitest';

import {
  buildContentfulEntryUrl,
  buildReviewCsv,
  buildReviewCsvDataUrl,
} from '../../features/AvifyDiagnostics/review-export';

describe('Avify review export', () => {
  it('builds a direct Contentful master-environment entry link', () => {
    expect(buildContentfulEntryUrl('space/id', 'entry id')).toBe(
      'https://app.contentful.com/spaces/space%2Fid/environments/master/entries/entry%20id'
    );
    expect(buildContentfulEntryUrl('', 'entry')).toBeNull();
  });

  it('exports review rows as an Excel-friendly and formula-safe CSV', () => {
    const csv = buildReviewCsv([
      {
        contentfulName: '=Unsafe name',
        contentfulUrl: 'https://example.com/entry',
        candidateName: 'Sardinas, deshidratadas',
        candidateSku: 'CP-10',
        score: 0.67,
        alternativeName: 'Sardinas "crudas"',
        ambiguous: true,
      },
    ]);

    expect(csv.startsWith('\uFEFF')).toBe(true);
    expect(csv).toContain('"\'=Unsafe name"');
    expect(csv).toContain('"Sardinas, deshidratadas"');
    expect(csv).toContain('"Sardinas ""crudas"""');
    expect(csv).toContain('"Ambiguo","67%"');
    expect(buildReviewCsvDataUrl([])).toMatch(
      /^data:text\/csv;charset=utf-8,/
    );
  });
});
