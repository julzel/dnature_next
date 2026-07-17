import Cart from '../../features/Cart';

export const metadata = {
  title: 'Carrito de compras',
  alternates: { canonical: '/cart' },
  robots: {
    index: false,
    follow: false,
  },
};

const CartPage = () => <Cart />;

export default CartPage;
