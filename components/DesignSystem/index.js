/** Shared brand primitives. No browser state or styling dependencies. */
export const Wordmark = () => (
  <span className='wordmark' aria-hidden='true'><strong>DNA</strong>ture<span className='wordmark-dot'>.</span></span>
);

export const Eyebrow = ({ children, number, className = '' }) => (
  <p className={`eyebrow ${className}`}>
    {number && <span className='eyebrow-number' aria-hidden='true'>{number}</span>}
    {children}
  </p>
);

export const SectionHeading = ({ id, eyebrow, number, title, children }) => (
  <div className='section-heading'>
    {eyebrow && <Eyebrow number={number}>{eyebrow}</Eyebrow>}
    <h2 id={id}>{title}</h2>
    {children && <p>{children}</p>}
  </div>
);

export const Fingerprint = () => (
  <svg className='fingerprint' viewBox='0 0 160 160' fill='none' aria-hidden='true'>
    {[18, 32, 46, 60, 74, 88, 102, 116, 130, 144].map((x, index) => (
      <path key={x} d={`M${x} ${48 - Math.sin(index / 3) * 30} V${112 + Math.sin(index / 3) * 30}`} />
    ))}
  </svg>
);

export const Notice = ({ children, title, tone = 'information', role }) => (
  <aside className={`notice notice--${tone}`} role={role}>
    {title && <strong>{title}</strong>}
    {children}
  </aside>
);
