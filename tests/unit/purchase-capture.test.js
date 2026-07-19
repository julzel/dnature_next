import { describe, expect, it, vi } from 'vitest';

import { completePurchaseCapture } from '../../features/Cart/CartContainer';
import { dataURLToBlob } from '../../features/Cart/lib/purchase-image';

describe('purchase screenshot completion', () => {
  it('does not download or store when capture fails', async () => {
    const download = vi.fn();
    const store = vi.fn();

    await expect(
      completePurchaseCapture({
        element: document.createElement('div'),
        capture: vi.fn().mockResolvedValue(null),
        download,
        store,
      })
    ).rejects.toThrow('No se pudo generar');
    expect(download).not.toHaveBeenCalled();
    expect(store).not.toHaveBeenCalled();
  });

  it('does not record the order when download fails', async () => {
    const store = vi.fn();

    await expect(
      completePurchaseCapture({
        element: document.createElement('div'),
        capture: vi.fn().mockResolvedValue('data:image/png;base64,AA=='),
        download: vi.fn(() => {
          throw new Error('download failed');
        }),
        store,
      })
    ).rejects.toThrow('download failed');
    expect(store).not.toHaveBeenCalled();
  });

  it('stores only after a successful capture and download', async () => {
    const calls = [];

    await completePurchaseCapture({
      element: document.createElement('div'),
      capture: vi.fn().mockResolvedValue('data:image/png;base64,AA=='),
      download: vi.fn(() => calls.push('download')),
      store: vi.fn(() => {
        calls.push('store');
        return true;
      }),
    });

    expect(calls).toEqual(['download', 'store']);
  });

  it('rejects malformed screenshot data', () => {
    expect(() => dataURLToBlob(null)).toThrow(TypeError);
    expect(() => dataURLToBlob('not-a-data-url')).toThrow(TypeError);
  });
});
