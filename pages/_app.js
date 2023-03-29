import React, { useEffect } from "react";
import ReactGA from "react-ga";
import { useRouter } from "next/router";
import "@fortawesome/fontawesome-svg-core/styles.css";

// local imports
// styles
import "../styles/globals.scss";

// providers
import ShoppingCartContextProvider from "../contexts/shopping-cart-context";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const router = useRouter();

  // Initialize Google Analytics tracking code
  useEffect(() => {
    ReactGA.initialize(process.env.NEXT_PUBLIC_ANALYTICS_ID);
  }, []);

  // Track pageviews on route change
  useEffect(() => {
    const handleRouteChange = (url) => {
      ReactGA.pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);
  return (
    <ShoppingCartContextProvider>
      <Component {...pageProps} />
    </ShoppingCartContextProvider>
  );
}

export default MyApp;
