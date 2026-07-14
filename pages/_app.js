import React from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import ScopedCssBaseline from '@mui/material/ScopedCssBaseline';
import { ThemeProvider } from '@mui/material';
import { AppCacheProvider } from '@mui/material-nextjs/v15-pagesRouter';

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
    <AppCacheProvider emotionCache={emotionCache}>
      <ThemeProvider theme={lightTheme}>
        <ShoppingCartContextProvider>
          <ScopedCssBaseline>
            <Component {...pageProps} />
          </ScopedCssBaseline>
        </ShoppingCartContextProvider>
      </ThemeProvider>
    </AppCacheProvider>
  );
}

export default MyApp;
