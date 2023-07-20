import React from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import ScopedCssBaseline from '@mui/material/ScopedCssBaseline';
import { ThemeProvider, useMediaQuery } from '@mui/material';
import { CacheProvider } from '@emotion/react';

// local imports
// styles
import { lightTheme } from '../theme';
import createEmotionCache from '../emotionCache';
import '../styles/globals.scss';

// providers
import ShoppingCartContextProvider from '../contexts/shopping-cart-context';

const clientSideEmotionCache = createEmotionCache();

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
  emotionCache = clientSideEmotionCache,
}) {
  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={lightTheme}>
        <ShoppingCartContextProvider>
          <ScopedCssBaseline>
            <Component {...pageProps} />
          </ScopedCssBaseline>
        </ShoppingCartContextProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default MyApp;
