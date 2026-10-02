import Link from 'next/link';

const Button = ({
  as,
  children,
  className = '',
  disabled = false,
  fullWidth = false,
  href,
  iconEnd,
  iconOnly = false,
  iconStart,
  loading = false,
  onClick,
  size = 'medium',
  text,
  type = 'button',
  variant = 'primary',
  ...props
}) => {
  const content = text || children || null;
  const isDisabled = disabled || loading;
  const Component = as || (href ? Link : 'button');
  const classes = ['button', `button--${variant}`, `button--${size}`,
    fullWidth && 'button--full', iconOnly && 'button--icon', className].filter(Boolean).join(' ');
  const buttonContent = (
    <>
      {loading && <span className='button-spinner' aria-hidden='true' />}
      {loading && !content && <span role="status">Cargando… </span>}
      {!loading && iconStart ? <span>{iconStart}</span> : null}
      {iconOnly ? null : content}
      {!loading && iconEnd ? <span>{iconEnd}</span> : null}
    </>
  );

  if (Component === 'button') {
    return (
      <button
        className={classes}
        type={type}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        onClick={onClick}
        {...props}
      >
        {buttonContent}
      </button>
    );
  }

  if (isDisabled) {
    return (
      <span
        className={classes}
        role="link"
        aria-busy={loading || undefined}
        aria-disabled="true"
        {...props}
      >
        {buttonContent}
      </span>
    );
  }

  const linkProps = {
    className: classes,
    href,
    'aria-busy': loading || undefined,
    'aria-disabled': undefined,
    tabIndex: props.tabIndex,
    ...props,
  };

  if (onClick) {
    linkProps.onClick = onClick;
  }

  return (
    <Component
      {...linkProps}
    >
      {buttonContent}
    </Component>
  );
};

export default Button;
