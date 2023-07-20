import { createTheme, responsiveFontSizes } from '@mui/material/styles';

// helper function to create themes
const createMyTheme = (mode) => {
  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: '#07bbc7',
      },
      secondary: {
        main: '#ff6f00',
      },
      tertiary: {
        main: '#dbe077',
      },
      success: {
        main: '#a8b247'
      },
    },
    typography: {
      subtitle1: {
        fontWeight: 700,
      },
      subtitle2: {
        fontWeight: 400,
      },
      fontFamily: 'Roboto, sans-serif',
    },
    components: {
      MuiButton: {
        styleOverrides: {
          containedPrimary: {
            color: 'white',
          },
          containedSecondary: {
            color: 'white',
          },
        },
      },
    },
  });

  return responsiveFontSizes(theme);
};

// Create a light theme instance
const lightTheme = createMyTheme('light');

// Create a dark theme instance
const darkTheme = createMyTheme('dark');

export { lightTheme, darkTheme };
