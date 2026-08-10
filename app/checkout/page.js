import Cart from '../../features/Cart';
import { loadOptionalCheckoutCustomer } from '../../features/Account/server';
import { createPageMetadata } from '../../constants/seo';

export const metadata = createPageMetadata({
  title: 'Checkout',
  description: 'Revisa tu pedido, elige la entrega y completa tu compra.',
  path: '/checkout',
  robots: {
    index: false,
    follow: false,
  },
});

export const dynamic = 'force-dynamic';

const CheckoutPage = async () => {
  const accountCustomer = await loadOptionalCheckoutCustomer();
  return <Cart initialClient={accountCustomer} />;
};

export default CheckoutPage;
