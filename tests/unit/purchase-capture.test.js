import { describe, expect, it, vi } from 'vitest';

import {
  cartItemsSignature,
  completePurchaseCapture,
} from '../../features/Cart/CartContainer';
import { dataURLToBlob } from '../../features/Cart/lib/purchase-image';

describe('purchase screenshot completion', () => {
  it('detects cart changes while catalogue validation is pending', () => {
    const items = [{ id: 'one', quantity: 1, price: 2500 }];

    expect(cartItemsSignature(items)).toBe(
      cartItemsSignature([{ ...items[0] }])
    );
    expect(cartItemsSignature(items)).not.toBe(
      cartItemsSignature([{ ...items[0], quantity: 2 }])
    );
  });

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

  it('returns the reusable artifact after capture, download, and storage', async () => {
    const calls = [];
    const dataUrl = 'data:image/png;base64,AA==';
    const filename = 'solicitud-DN-123.png';

    const artifact = await completePurchaseCapture({
      element: document.createElement('div'),
      capture: vi.fn().mockResolvedValue(dataUrl),
      download: vi.fn((receivedDataUrl, receivedFilename) =>
        calls.push(['download', receivedDataUrl, receivedFilename])
      ),
      store: vi.fn(() => {
        calls.push(['store']);
        return true;
      }),
      filename,
    });

    expect(calls).toEqual([
      ['download', dataUrl, filename],
      ['store'],
    ]);
    expect(artifact).toEqual({ dataUrl, filename });
  });

  it('keeps local-storage failure non-blocking after downloading the image', async () => {
    const download = vi.fn();

    const artifact = await completePurchaseCapture({
      element: document.createElement('div'),
      capture: vi.fn().mockResolvedValue('data:image/png;base64,AA=='),
      download,
      store: vi.fn(() => false),
    });

    expect(download).toHaveBeenCalledOnce();
    expect(artifact.storageWarning).toContain('referencia local');
  });

  it('rejects malformed screenshot data', () => {
    expect(() => dataURLToBlob(null)).toThrow(TypeError);
    expect(() => dataURLToBlob('not-a-data-url')).toThrow(TypeError);
  });
});
