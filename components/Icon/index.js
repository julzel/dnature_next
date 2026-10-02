import { config } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon as SvgIcon } from '@fortawesome/react-fontawesome';

config.autoAddCss = false;

// SVG dimensions keep icons usable without injecting Font Awesome's stylesheet.
export const FontAwesomeIcon = ({ size: _size, ...props }) => (
  <SvgIcon width={20} height={20} {...props} />
);
