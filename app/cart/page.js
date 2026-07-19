import Cart from '../../features/Cart';
import { createPageMetadata } from '../../constants/seo';

export const metadata = createPageMetadata({
  title: 'Carrito de compras',
  description: 'Revisa los productos seleccionados antes de generar tu orden.',
  path: '/cart',
  robots: {
    index: false,
    follow: false,
  },
});

const CartPage = () => <Cart />;

export default CartPage;
