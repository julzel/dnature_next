/** DNAture's local outline vocabulary. Decorative by default; name the control. */
const paths = {
  arrowDown: 'M12 4v16m-6-6 6 6 6-6',
  arrowLeft: 'M20 12H4m6-6-6 6 6 6',
  arrowRight: 'M4 12h16m-6-6 6 6-6 6',
  arrowUpRight: 'M5 19 19 5M5 5h14v14',
  check: 'm5 12 4 4L19 6',
  chevronDown: 'm6 9 6 6 6-6',
  chevronLeft: 'm15 6-6 6 6 6',
  chevronRight: 'm9 6 6 6-6 6',
  chevronUp: 'm6 15 6-6 6 6',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  x: 'm6 6 12 12M18 6 6 18',
  menu: 'M4 6h16M4 12h16M4 18h16',
  search: 'M16 10a6 6 0 1 1-12 0 6 6 0 0 1 12 0Zm-2 4 6 6',
  heart: 'M12 20 4 12C-2 5 7 0 12 6c5-6 14-1 8 6Z',
  leaf: 'M20 3C10 2 3 7 4 14s10 8 14-1c2-4 2-7 2-10ZM5 20 16 8',
  user: 'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21v-2a8 8 0 0 1 16 0v2',
  mail: 'M3 5h18v14H3Zm0 1 9 7 9-7',
  bag: 'M4 7h16l1 14H3ZM8 8V6a4 4 0 0 1 8 0v2',
  basket: 'M3 9h18l-3 12H6ZM7 9l3-6m7 6-3-6M9 13v4m6-4v4',
  pin: 'M19 9c0 5-7 12-7 12S5 14 5 9a7 7 0 0 1 14 0ZM14 9a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z',
  message: 'M21 11a9 9 0 0 1-9 9c-2 0-3-.5-4-1l-5 2 2-5a9 9 0 1 1 16-5ZM8 11h.1m3.9 0h.1m3.9 0h.1',
  clock: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM12 6v6l4 2',
  shield: 'm12 2 8 3v6c0 5-8 11-8 11S4 16 4 11V5Z',
  shieldCheck: 'm12 2 8 3v6c0 5-8 11-8 11S4 16 4 11V5Zm-4 9 3 3 5-5',
  shieldAlert: 'm12 2 8 3v6c0 5-8 11-8 11S4 16 4 11V5ZM12 7v5m0 4h.01',
  info: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM12 11v6m0-10h.01',
  alert: 'M12 3 2 21h20ZM12 9v5m0 3h.01',
  trash: 'M3 6h18M5 6l1 15h12l1-15M9 6V3h6v3M10 10v7m4-7v7',
  pencil: 'm4 16 12-12 4 4L8 20l-5 1Zm10-10 4 4',
  download: 'M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5',
  rotate: 'M3 10a9 9 0 1 1 1 8M3 4v6h6',
  house: 'm3 10 9-8 9 8M5 9v12h5v-7h4v7h5V9',
  logOut: 'M9 3H3v18h6m-1-9h13m-5-5 5 5-5 5',
  lock: 'M5 10h14v11H5ZM8 10V6a4 4 0 0 1 8 0v4m-4 5v2',
  paw: 'M9 13c-2 3-5 4-4 7s4 1 7 1 6 2 7-1-2-4-4-7c-1-2-5-2-6 0ZM7 7a2 3 0 1 1-4 0 2 3 0 0 1 4 0Zm5-3a2 3 0 1 1-4 0 2 3 0 0 1 4 0Zm4 0a2 3 0 1 1-4 0 2 3 0 0 1 4 0Zm5 3a2 3 0 1 1-4 0 2 3 0 0 1 4 0Z',
  cat: 'm4 10 1-7 5 4h4l5-4 1 7v6c0 7-16 7-16 0Zm4 3h.01m7.99 0h.01M10 17l2 2 2-2',
  dog: 'm7 5-4 1v10l4-3V8m10-3 4 1v10l-4-3V8M7 5h10v12c0 6-10 6-10 0ZM9 12h.01m5.99 0h.01M10 17l2 2 2-2',
  beef: 'M6 5c8-7 20 2 14 12S0 23 3 13c1-4 0-6 3-8Zm9 4a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
  flask: 'M9 3h6m-5 0v7L4 20h16l-6-10V3M7 15h10',
  scale: 'M12 3v18M5 21h14M4 7h16M7 7l-4 8h8Zm10 0-4 8h8Z',
  sparkles: 'm12 3 3 6 6 3-6 3-3 6-3-6-6-3 6-3Zm8-2v4m-2-2h4',
  calendar: 'M3 5h18v16H3ZM7 2v6m10-6v6M3 10h18M7 14h2m4 0h2m-8 4h2m4 0h2',
  package: 'm12 2 9 5v10l-9 5-9-5V7Zm-9 5 9 5 9-5M12 12v10M7 5l9 5',
  bookmark: 'M6 3h12v18l-6-4-6 4ZM9 9h6m-3-3v6',
  building: 'M4 21V3h11v18m0-13h5v13H3M7 7h1m3 0h1m-5 4h1m3 0h1m-5 4h1m3 0h1',
  truck: 'M2 4h12v13H2Zm12 5h4l4 5v3h-8M8 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm12 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z',
  snowflake: 'M12 2v20M3 7l18 10M3 17 21 7M9 4l3 3 3-3M9 20l3-3 3 3',
  sliders: 'M3 6h18M3 12h18M3 18h18M7 3v6m10 0v6m-7 0v6',
  store: 'M4 10v11h16V10M3 3h18l1 7H2ZM9 21v-7h6v7',
  more: 'M12 5h.01M12 12h.01M12 19h.01',
  dollar: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM12 6v12m4-9c-6-6-11 3-4 3s2 8-4 3',
  stethoscope: 'M4 3v7a5 5 0 0 0 10 0V3M3 3h3m6 0h3M9 15v2c0 7 11 7 11-1v-4m2-2a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z',
  navigation: 'm21 3-7 18-3-8-8-3Z',
  instagram: 'M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4ZM16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm1-6h.01',
};

const OutlineIcon = ({ name, size = 22, strokeWidth = 1.4, filled = false, className = '', 'aria-hidden': hidden = true, 'aria-label': label }) => (
  <svg className={`icon ${className}`} width={size} height={size} viewBox='0 0 24 24'
    fill={filled ? 'currentColor' : 'none'} stroke='currentColor' strokeWidth={strokeWidth}
    strokeLinecap='round' strokeLinejoin='round' aria-hidden={hidden} aria-label={label}
    role={hidden ? undefined : 'img'} focusable='false'>
    <path d={paths[name]} />
  </svg>
);
const createIcon = (name) => {
  const Icon = (props) => <OutlineIcon name={name} {...props} />;
  return Icon;
};

export const AlertTriangle = createIcon('alert');
export const ArrowDown = createIcon('arrowDown');
export const ArrowLeft = createIcon('arrowLeft');
export const ArrowRight = createIcon('arrowRight');
export const ArrowUpRight = createIcon('arrowUpRight');
export const BadgeCheck = createIcon('shieldCheck');
export const BadgeDollarSign = createIcon('dollar');
export const Beef = createIcon('beef');
export const BookmarkPlus = createIcon('bookmark');
export const Building2 = createIcon('building');
export const CalendarClock = createIcon('calendar');
export const CalendarDays = createIcon('calendar');
export const Cat = createIcon('cat');
export const Check = createIcon('check');
export const CheckCircle2 = createIcon('shieldCheck');
export const ChevronDown = createIcon('chevronDown');
export const ChevronLeft = createIcon('chevronLeft');
export const ChevronRight = createIcon('chevronRight');
export const ChevronUp = createIcon('chevronUp');
export const CircleDollarSign = createIcon('dollar');
export const ClipboardPenLine = createIcon('pencil');
export const Clock3 = createIcon('clock');
export const Dog = createIcon('dog');
export const Download = createIcon('download');
export const FlaskConical = createIcon('flask');
export const Heart = createIcon('heart');
export const HeartHandshake = createIcon('heart');
export const House = createIcon('house');
export const Info = createIcon('info');
export const Leaf = createIcon('leaf');
export const LockKeyhole = createIcon('lock');
export const LogOut = createIcon('logOut');
export const Mail = createIcon('mail');
export const MapPin = createIcon('pin');
export const Menu = createIcon('menu');
export const MessageCircleMore = createIcon('message');
export const Minus = createIcon('minus');
export const MoreVertical = createIcon('more');
export const Navigation = createIcon('navigation');
export const PackageCheck = createIcon('package');
export const PackageOpen = createIcon('package');
export const PawPrint = createIcon('paw');
export const Pencil = createIcon('pencil');
export const Plus = createIcon('plus');
export const RotateCcw = createIcon('rotate');
export const Scale = createIcon('scale');
export const Search = createIcon('search');
export const ShieldAlert = createIcon('shieldAlert');
export const ShieldCheck = createIcon('shieldCheck');
export const ShoppingBag = createIcon('bag');
export const ShoppingBasket = createIcon('basket');
export const SlidersHorizontal = createIcon('sliders');
export const Snowflake = createIcon('snowflake');
export const Sparkles = createIcon('sparkles');
export const Stethoscope = createIcon('stethoscope');
export const Store = createIcon('store');
export const Trash2 = createIcon('trash');
export const Truck = createIcon('truck');
export const UserRound = createIcon('user');
export const UserRoundPlus = createIcon('user');
export const X = createIcon('x');

// Compatibility for existing text/brand markers; no third-party artwork is loaded.
const symbolIcons = { '→': 'arrowRight', '□': 'bag', '−': 'minus', '+': 'plus', '×': 'x', '◎': 'instagram', W: 'message' };
export const TextIcon = ({ symbol, ...props }) => symbolIcons[symbol]
  ? <OutlineIcon name={symbolIcons[symbol]} {...props} />
  : <span className='icon brand-symbol' aria-hidden='true'>{symbol}</span>;
export const arrowRightSymbol = '→';
export const bagShoppingSymbol = '□';
export const circleMinusSymbol = '−';
export const circlePlusSymbol = '+';
export const facebookFSymbol = 'f';
export const googleSymbol = 'G';
export const instagramSymbol = '◎';
export const minusSymbol = '−';
export const plusSymbol = '+';
export const trashCanSymbol = '×';
export const whatsappSymbol = 'W';
export const xmarkSymbol = '×';
