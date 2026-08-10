import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import AvifyTestPage from '../../app/avify-test/page';
import { proxy } from '../../proxy';

const notFoundMock = vi.hoisted(() =>
  vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  })
);

vi.mock('next/navigation', () => ({
  notFound: notFoundMock,
}));

const createProxyRequest = () => ({
  headers: new Headers(),
  nextUrl: new URL('http://localhost/avify-test'),
});

describe('Avify test route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('returns not found in production', () => {
    vi.stubEnv('NODE_ENV', 'production');

    expect(() => AvifyTestPage()).toThrow('NEXT_NOT_FOUND');
    expect(notFoundMock).toHaveBeenCalledOnce();
  });

  it('renders diagnostics outside production', () => {
    vi.stubEnv('NODE_ENV', 'development');

    expect(AvifyTestPage()).toBeTruthy();
    expect(notFoundMock).not.toHaveBeenCalled();
  });

  it('returns HTTP 404 from the proxy in production', async () => {
    vi.stubEnv('NODE_ENV', 'production');

    const response = await proxy(createProxyRequest());
    expect(response.status).toBe(404);
  });

  it('allows the diagnostic request through outside production', async () => {
    vi.stubEnv('NODE_ENV', 'development');

    const response = await proxy(createProxyRequest());

    expect(response.status).toBe(200);
    expect(response.headers.get('x-middleware-next')).toBe('1');
  });
});
