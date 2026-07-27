import { describe, expect, it } from 'vitest';

import { buildContentfulGraphqlUrl } from '../../services/contentful';

describe('Contentful service', () => {
  it('targets master by default and supports an explicit environment', () => {
    expect(buildContentfulGraphqlUrl('space/id')).toBe(
      'https://graphql.contentful.com/content/v1/spaces/space%2Fid/environments/master'
    );
    expect(buildContentfulGraphqlUrl('space', 'staging env')).toBe(
      'https://graphql.contentful.com/content/v1/spaces/space/environments/staging%20env'
    );
  });
});
