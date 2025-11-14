import { createTheme, responsiveFontSizes } from '@mui/material/styles';

const baseColors = {
  teal: '#00A9B5',
  tealDark: '#00788A',
  tealLight: '#5ED2DE',
  orange: '#FF6A00',
  orangeDark: '#C65000',
  orangeLight: '#FF9450',
  gray50: '#FAFAFA',
  gray100: '#F4F4F4',
  gray300: '#B2B2B2',
  gray600: '#6A6A6A',
  gray900: '#3C3C3B',
};

const categoryPalette = {
  mastication: '#426D36',
  complete: '#84A341',
  trout: '#742019',
  chewSupplements: '#8E3485',
  supplements: '#531845',
  wild: '#124563',
  cooked: '#4E8997',
  treats: '#CA6C2A',
  nutrition: '#D8A73C',
};

const sharedShape = {
  borderRadius: 10,
};

const sharedTypography = {
  fontFamily: 'Roboto, "Inter", sans-serif',
  button: {
    textTransform: 'none',
    fontWeight: 600,
  },
  h1: { fontWeight: 700 },
  subtitle1: { fontWeight: 600 },
  subtitle2: { fontWeight: 400 },
};

const buildPalette = (mode) => ({
  mode,
  primary: {
    main: baseColors.teal,
    dark: baseColors.tealDark,
    light: baseColors.tealLight,
  },
  secondary: {
    main: baseColors.orange,
    dark: baseColors.orangeDark,
    light: baseColors.orangeLight,
  },
  success: { main: categoryPalette.complete },
  warning: { main: baseColors.orange },
  error: { main: '#B3261E' },
  info: { main: '#4E8997' },
  grey: {
    50: baseColors.gray50,
    100: baseColors.gray100,
    300: baseColors.gray300,
    600: baseColors.gray600,
    900: baseColors.gray900,
  },
  text:
    mode === 'light'
      ? { primary: baseColors.gray900, secondary: baseColors.gray600 }
      : { primary: '#F5F5F5', secondary: '#C7C7C7' },
  background:
    mode === 'light'
      ? { default: '#FFFFFF', paper: '#FFFFFF' }
      : { default: '#121212', paper: '#1E1E1E' },
  category: categoryPalette,
});

const createMyTheme = (mode) =>
  responsiveFontSizes(
    createTheme({
      palette: buildPalette(mode),
      shape: sharedShape,
      typography: sharedTypography,
      components: {
        MuiButton: {
          defaultProps: {
            disableElevation: true,
          },
          styleOverrides: {
            root: {
              borderRadius: sharedShape.borderRadius,
              paddingInline: 20,
              paddingBlock: 10,
            },
            containedPrimary: { color: '#FFFFFF' },
            containedSecondary: { color: '#FFFFFF' },
            outlinedSecondary: {
              borderColor: baseColors.orange,
              color: baseColors.orange,
            },
            text: { fontWeight: 600 },
          },
          variants: [
            {
              props: { variant: 'contained', color: 'info' },
              style: {
                background: 'linear-gradient(90deg,#124563,#4E8997)',
                color: '#FFFFFF',
              },
            },
            {
              props: { variant: 'contained', color: 'success' },
              style: { color: '#FFFFFF' },
            },
          ],
        },
        MuiLink: {
          styleOverrides: {
            root: {
              color: baseColors.teal,
              fontWeight: 600,
              textDecorationColor: 'transparent',
              '&:hover': { textDecorationColor: baseColors.teal },
            },
          },
        },
        MuiBreadcrumbs: {
          styleOverrides: {
            separator: { color: baseColors.gray600, fontWeight: 500 },
          },
        },
        MuiAppBar: {
          styleOverrides: {
            colorPrimary: {
              backgroundColor: '#FFFFFF',
              color: baseColors.gray900,
            },
          },
        },
      },
    })
  );

const lightTheme = createMyTheme('light');
const darkTheme = createMyTheme('dark');

export { lightTheme, darkTheme };
