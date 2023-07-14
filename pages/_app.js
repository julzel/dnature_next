import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import ScopedCssBaseline from '@mui/material/ScopedCssBaseline';
import { ThemeProvider, useMediaQuery } from '@mui/material';
import { CacheProvider } from '@emotion/react';
import { lightTheme } from '../theme';
import createEmotionCache from '../emotionCache';

// local imports
// styles
import '../styles/globals.scss';

// providers
import ShoppingCartContextProvider from '../contexts/shopping-cart-context';

const clientSideEmotionCache = createEmotionCache();

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
  emotionCache = clientSideEmotionCache,
}) {
  // const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  // const theme = prefersDarkMode ? darkTheme : lightTheme;

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
