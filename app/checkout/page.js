import Cart from '../../features/Cart';
import { loadOptionalCheckoutCustomer } from '../../features/Account/server';
import { createPageMetadata } from '../../constants/seo';

export const metadata = createPageMetadata({
  title: 'Checkout',
  description:
    'Revisá tu carrito y prepará una solicitud para coordinarla con DNAture por WhatsApp.',
  path: '/checkout',
  robots: {
    index: false,
    follow: false,
  },
});

export const dynamic = 'force-dynamic';

const CheckoutPage = async () => {
  const accountCustomer = await loadOptionalCheckoutCustomer();
  const canCreateAccount =
    process.env.ACCOUNT_REGISTRATION_MODE === 'public';

  return (
    <Cart
      initialClient={accountCustomer}
      canCreateAccount={canCreateAccount}
    />
  );
};

export default CheckoutPage;
