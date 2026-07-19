import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import Modal from '../../components/Modal';

const ModalHarness = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)}>
        Abrir
      </button>
      {isOpen && (
        <Modal
          ariaLabel="Confirmar acción"
          closeModal={() => setIsOpen(false)}
        >
          <h2>Confirmar</h2>
          <input aria-label="Dato" />
          <button type="button">Aceptar</button>
        </Modal>
      )}
    </>
  );
};

describe('Modal', () => {
  it('names the dialog, traps focus, closes with Escape, and restores focus', async () => {
    const user = userEvent.setup();
    render(<ModalHarness />);

    const openButton = screen.getByRole('button', { name: 'Abrir' });
    await user.click(openButton);

    const dialog = screen.getByRole('dialog', { name: 'Confirmar acción' });
    const closeButton = screen.getByRole('button', { name: 'Cerrar diálogo' });
    const acceptButton = screen.getByRole('button', { name: 'Aceptar' });

    expect(dialog).toBeInTheDocument();
    expect(closeButton).toHaveFocus();

    await user.tab({ shift: true });
    expect(acceptButton).toHaveFocus();

    await user.tab();
    expect(closeButton).toHaveFocus();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(openButton).toHaveFocus();
  });
});
