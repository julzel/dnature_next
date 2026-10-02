import React from 'react';
import Link from 'next/link';
import { ShoppingBag } from "../../Icon";

// local imports

const SubHeader = ({ onOpen, totalCartItems, triggerRef }) => {
  const handleCartClick = (event) => {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    onOpen();
  };

  return (
    <nav aria-label='Carrito'>
      <Link
        ref={triggerRef}
        href='/checkout'
        onClick={handleCartClick}
        aria-label={
          totalCartItems > 0
            ? `Abrir carrito: ${totalCartItems} ${
                totalCartItems === 1 ? 'producto' : 'productos'
              }`
            : 'Abrir carrito'
        }
      >
        <span>
          <ShoppingBag aria-hidden='true' size={27} strokeWidth={1.8} />
          {totalCartItems > 0 && (
            <span>{totalCartItems}</span>
          )}
        </span>
      </Link>
    </nav>
  );
};

export default SubHeader;
