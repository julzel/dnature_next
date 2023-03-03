import { SessionProvider } from 'next-auth/react';
import '@fortawesome/fontawesome-svg-core/styles.css';
// local imports
// styles
import '../styles/globals.scss';
import ShoppingCartContextProvider from '../contexts/shopping-cart-context';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <ShoppingCartContextProvider>
        <Component {...pageProps} />
      </ShoppingCartContextProvider>
    </SessionProvider>
  );
}

export default MyApp;
