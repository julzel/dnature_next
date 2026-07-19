import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import Button from '../../components/Button';
import OptionsMenu from '../../components/OptionsMenu';
import Slider from '../../components/Slider';

describe('keyboard-accessible controls', () => {
  it('forwards native props through Button', () => {
    render(
      <Button
        aria-label="Guardar cambios"
        data-testid="save"
        disabled
        form="profile"
      >
        Guardar
      </Button>
    );

    const button = screen.getByTestId('save');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('form', 'profile');
    expect(button).toHaveAccessibleName('Guardar cambios');
  });

  it('supports arrow navigation and Escape in the options menu', async () => {
    const user = userEvent.setup();
    render(
      <OptionsMenu
        ariaLabel="Opciones para Luna"
        editItem={vi.fn()}
        deleteItem={vi.fn()}
      />
    );

    const trigger = screen.getByRole('button', { name: 'Opciones para Luna' });
    trigger.focus();
    await user.keyboard('{ArrowDown}');

    const items = screen.getAllByRole('menuitem');
    expect(items[0]).toHaveFocus();

    await user.keyboard('{ArrowDown}');
    expect(items[1]).toHaveFocus();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('connects slider tabs and panels and supports arrow keys', async () => {
    const user = userEvent.setup();
    render(
      <Slider
        slides={[
          <p key="first">Primer testimonio</p>,
          <p key="second">Segundo testimonio</p>,
        ]}
      />
    );

    const tabs = screen.getAllByRole('tab');
    const panels = screen.getAllByRole('tabpanel', { hidden: true });

    expect(tabs[0]).toHaveAttribute('aria-controls', panels[0].id);
    expect(panels[0]).toHaveAttribute('aria-labelledby', tabs[0].id);
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    expect(panels[1]).toHaveAttribute('aria-hidden', 'true');

    tabs[0].focus();
    await user.keyboard('{ArrowRight}');

    expect(tabs[1]).toHaveFocus();
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    expect(panels[1]).toHaveAttribute('aria-hidden', 'false');
  });
});
