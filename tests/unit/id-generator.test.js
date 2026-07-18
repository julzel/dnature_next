import { describe, expect, it } from 'vitest';

import { generatePurchaseOrderId } from '../../util/id-generator';

describe('purchase order IDs', () => {
  it('uses randomUUID when available', () => {
    expect(
      generatePurchaseOrderId({ randomUUID: () => 'stable-uuid' })
    ).toBe('DN-stable-uuid');
  });

  it('uses secure random bytes without Math.random fallback', () => {
    const cryptoProvider = {
      getRandomValues(bytes) {
        bytes.fill(10);
        return bytes;
      },
    };

    expect(generatePurchaseOrderId(cryptoProvider)).toBe(
      `DN-${'0a'.repeat(16)}`
    );
  });

  it('fails safely when secure randomness is unavailable', () => {
    expect(() => generatePurchaseOrderId({})).toThrow(
      'Secure random values are unavailable'
    );
  });
});
