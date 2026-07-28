import Cart from '../../features/Cart';
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

const CheckoutPage = () => <Cart />;

export default CheckoutPage;
