import React from 'react';
import MuiButton from '@mui/material/Button';

const INTENT_PRESETS = {
  cta: { variant: 'contained', color: 'primary' },
  primary: { variant: 'contained', color: 'primary' },
  submit: { variant: 'contained', color: 'secondary' },
  secondary: { variant: 'contained', color: 'secondary' },
  success: { variant: 'contained', color: 'success' },
  info: { variant: 'contained', color: 'info' },
  warning: { variant: 'contained', color: 'warning' },
  danger: { variant: 'contained', color: 'error' },
  outline: { variant: 'outlined', color: 'primary' },
  outlineSecondary: { variant: 'outlined', color: 'secondary' },
  outlineDanger: { variant: 'outlined', color: 'error' },
  text: { variant: 'text', color: 'primary' },
  cancel: {
    variant: 'text',
    color: 'inherit',
    sx: (theme) => ({
      color: theme.palette.grey[600],
      '&:hover': {
        color: theme.palette.grey[900],
        backgroundColor: 'transparent',
      },
    }),
  },
};

const composeSx = (presetSx, sx) => {
  if (!presetSx) {
    return sx;
  }

  if (!sx) {
    return presetSx;
  }

  if (Array.isArray(sx)) {
    return [presetSx, ...sx];
  }

  return [presetSx, sx];
};

const Button = React.forwardRef(function DNatureButton(
  { text, children, intent = 'cta', variant, color, sx, ...rest },
  ref
) {
  const preset = INTENT_PRESETS[intent] || {};
  const resolvedVariant = variant || preset.variant || 'contained';
  const resolvedColor = color || preset.color || 'primary';
  const mergedSx = composeSx(preset.sx, sx);

  return (
    <MuiButton
      ref={ref}
      variant={resolvedVariant}
      color={resolvedColor}
      sx={mergedSx}
      {...rest}
    >
      {text ?? children ?? null}
    </MuiButton>
  );
});

export default Button;
