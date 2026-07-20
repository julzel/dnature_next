import Link from 'next/link';

import styles from './Button.module.scss';

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
  const classNames = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : '',
    iconOnly ? styles.iconOnly : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const buttonContent = (
    <>
      {loading && <span className={styles.spinner} aria-hidden="true" />}
      {!loading && iconStart ? <span className={styles.icon}>{iconStart}</span> : null}
      {iconOnly ? null : content}
      {!loading && iconEnd ? <span className={styles.icon}>{iconEnd}</span> : null}
    </>
  );

  if (Component === 'button') {
    return (
      <button
        type={type}
        className={classNames}
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
        className={classNames}
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
    className: classNames,
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
