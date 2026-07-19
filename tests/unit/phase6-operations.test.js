import { describe, expect, it } from 'vitest';

import { canonicalPath, createPageMetadata } from '../../constants/seo';
import { createMonitoringEvent, redactString } from '../../util/monitoring';

const nextConfig = require('../../next.config');

describe('Phase 6 SEO and operational controls', () => {
  it('uses one trailing-slash convention for canonical metadata', () => {
    const metadata = createPageMetadata({
      title: 'Productos',
      description: 'Productos naturales.',
      path: '/productos',
    });

    expect(canonicalPath('/')).toBe('/');
    expect(canonicalPath('/productos/')).toBe('/productos/');
    expect(metadata.alternates.canonical).toBe('/productos/');
    expect(metadata.openGraph.url).toBe('/productos/');
    expect(metadata.twitter.card).toBe('summary_large_image');
  });

  it('redacts email addresses and phone numbers before monitoring delivery', () => {
    const message = redactString('Contact ada@example.com or +506 8888-8888');
    const event = createMonitoringEvent(new Error('Failed for ada@example.com'), {
      path: '/cart',
    });

    expect(message).not.toContain('ada@example.com');
    expect(message).not.toContain('8888-8888');
    expect(event.message).not.toContain('ada@example.com');
    expect(event.path).toBe('/cart');
  });

  it('defines the required response security headers', async () => {
    const rules = await nextConfig.headers();
    const headers = Object.fromEntries(rules[0].headers.map(({ key, value }) => [key, value]));

    expect(headers['Content-Security-Policy']).toContain("default-src 'self'");
    expect(headers['Content-Security-Policy']).toContain('https://images.ctfassets.net');
    expect(headers['X-Content-Type-Options']).toBe('nosniff');
    expect(headers['Referrer-Policy']).toBe('strict-origin-when-cross-origin');
  });
});
