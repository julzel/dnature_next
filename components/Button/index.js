import Link from 'next/link';

const Button = ({
  as,
  children,
  className: _className,
  disabled = false,
  fullWidth: _fullWidth,
  href,
  iconEnd,
  iconOnly = false,
  iconStart,
  loading = false,
  onClick,
  size: _size,
  text,
  type = 'button',
  variant: _variant,
  ...props
}) => {
  const content = text || children || null;
  const isDisabled = disabled || loading;
  const Component = as || (href ? Link : 'button');
  const buttonContent = (
    <>
      {loading && !content && <span role="status">Cargando… </span>}
      {!loading && iconStart ? <span>{iconStart}</span> : null}
      {iconOnly ? null : content}
      {!loading && iconEnd ? <span>{iconEnd}</span> : null}
    </>
  );

  if (Component === 'button') {
    return (
      <button
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
