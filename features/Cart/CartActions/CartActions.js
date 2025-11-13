import React from 'react';
import { Typography } from '@mui/material';

// local imports
// styles
import styles from './CartActions.module.scss';

// components
import Button from '../../../components/Button';
import Dialog from '../../../components/Dialog';

const CartActions = ({
  router,
  totalItems,
  proceedToPurchase,
  handleRemoveAllItems,
  displayRemoveAllModal,
  toggleRemoveAllModal,
}) => {
  return (
    <div className={styles.cartActions}>
      {totalItems > 0 && (
        <Button
          className={styles.button}
          intent="outlineDanger"
          onClick={toggleRemoveAllModal}
        >
          Vaciar Carrito
        </Button>
      )}
      <Button
        className={styles.button}
        intent="outline"
        onClick={() => router.back()}
      >
        Regresar
      </Button>
      {totalItems > 0 && (
        <Button
          className={styles.button}
          intent="cta"
          onClick={() => proceedToPurchase()}
        >
          Continuar
        </Button>
      )}
      {displayRemoveAllModal && (
        <Dialog
          type="warning"
          title="¡Atención!"
          onClose={toggleRemoveAllModal}
          primaryAction={{
            label: 'Vaciar carrito',
            color: 'warning',
            onClick: handleRemoveAllItems,
          }}
          secondaryAction={{ label: 'Cancelar', onClick: toggleRemoveAllModal }}
        >
          <Typography>
            Esta opción eliminará todos los artículos que has seleccionado.
          </Typography>
          <Typography>¿Estás seguro de querer vaciar el carrito?</Typography>
        </Dialog>
      )}
    </div>
  );
};

export default CartActions;
