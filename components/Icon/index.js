// Native text symbols preserve labelled controls without an icon or styling library.
export const TextIcon = ({ symbol, 'aria-hidden': hidden = true, 'aria-label': label }) => (
  <span aria-hidden={hidden} aria-label={label}>{symbol}</span>
);

const createIcon = (symbol) => {
  const Icon = (props) => <TextIcon symbol={symbol} {...props} />;
  return Icon;
};

export const AlertTriangle = createIcon("!");
export const ArrowDown = createIcon("↓");
export const ArrowLeft = createIcon("←");
export const ArrowRight = createIcon("→");
export const ArrowUpRight = createIcon("↗");
export const BadgeCheck = createIcon("✓");
export const BadgeDollarSign = createIcon("₡");
export const Beef = createIcon("◇");
export const BookmarkPlus = createIcon("+");
export const Building2 = createIcon("▤");
export const CalendarClock = createIcon("▦");
export const CalendarDays = createIcon("▦");
export const Cat = createIcon("◇");
export const Check = createIcon("✓");
export const CheckCircle2 = createIcon("✓");
export const ChevronDown = createIcon("⌄");
export const ChevronLeft = createIcon("‹");
export const ChevronRight = createIcon("›");
export const ChevronUp = createIcon("⌃");
export const CircleDollarSign = createIcon("₡");
export const ClipboardPenLine = createIcon("✎");
export const Clock3 = createIcon("◷");
export const Dog = createIcon("◇");
export const Download = createIcon("↓");
export const FlaskConical = createIcon("◇");
export const Heart = ({ filled = false, ...props }) => (
  <TextIcon symbol={filled ? '♥' : '♡'} {...props} />
);
export const HeartHandshake = createIcon("♡");
export const House = createIcon("⌂");
export const Info = createIcon("i");
export const Leaf = createIcon("◇");
export const LockKeyhole = createIcon("▪");
export const LogOut = createIcon("↪");
export const Mail = createIcon("✉");
export const MapPin = createIcon("⌖");
export const Menu = createIcon("☰");
export const MessageCircleMore = createIcon("…");
export const Minus = createIcon("−");
export const MoreVertical = createIcon("⋮");
export const Navigation = createIcon("↗");
export const PackageCheck = createIcon("✓");
export const PackageOpen = createIcon("□");
export const PawPrint = createIcon("◇");
export const Pencil = createIcon("✎");
export const Plus = createIcon("+");
export const RotateCcw = createIcon("↶");
export const Scale = createIcon("⚖");
export const Search = createIcon("⌕");
export const ShieldAlert = createIcon("!");
export const ShieldCheck = createIcon("✓");
export const ShoppingBag = createIcon("□");
export const ShoppingBasket = createIcon("□");
export const SlidersHorizontal = createIcon("≡");
export const Snowflake = createIcon("❄");
export const Sparkles = createIcon("✦");
export const Stethoscope = createIcon("+");
export const Store = createIcon("⌂");
export const Trash2 = createIcon("×");
export const Truck = createIcon("↦");
export const UserRound = createIcon("○");
export const UserRoundPlus = createIcon("+");
export const X = createIcon("×");

export const arrowRightSymbol = "→";
export const bagShoppingSymbol = "□";
export const circleMinusSymbol = "−";
export const circlePlusSymbol = "+";
export const facebookFSymbol = "f";
export const googleSymbol = "G";
export const instagramSymbol = "◎";
export const minusSymbol = "−";
export const plusSymbol = "+";
export const trashCanSymbol = "×";
export const whatsappSymbol = "W";
export const xmarkSymbol = "×";
