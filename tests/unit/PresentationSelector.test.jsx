import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import PresentationSelector from '../../components/PresentationSelector';

describe('PresentationSelector', () => {
  it('uses unique accessible labels and reports the selected presentation', async () => {
    const user = userEvent.setup();
    const onFirstSelect = vi.fn();

    render(
      <>
        <PresentationSelector
          presentations={{ '500g': 3000, '1kg': 5000 }}
          selectedPresentation={{ size: '500g', price: 3000 }}
          onPresentationSelect={onFirstSelect}
        />
        <PresentationSelector
          presentations={{ '100g': 1500 }}
          selectedPresentation={{ size: '100g', price: 1500 }}
          onPresentationSelect={vi.fn()}
        />
      </>
    );

    const selectors = screen.getAllByLabelText('Presentación');
    expect(selectors[0].id).not.toBe(selectors[1].id);

    await user.selectOptions(selectors[0], '1kg');

    expect(onFirstSelect).toHaveBeenCalledWith({ size: '1kg', price: 5000 });
  });
});
