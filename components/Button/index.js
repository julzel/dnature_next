const Button = ({ text, children, type = 'button', ...props }) => {
  return (
    <button type={type} {...props}>
      {text ? text : children ? children : null}
    </button>
  );
};

export default Button;
