import "@fortawesome/fontawesome-svg-core/styles.css";

// local imports
// styles
import "../styles/globals.scss";

// providers
import ShoppingCartContextProvider from "../contexts/shopping-cart-context";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <ShoppingCartContextProvider>
      <Component {...pageProps} />
    </ShoppingCartContextProvider>
  );
}

export default MyApp;
