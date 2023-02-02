const Input = ({
  label,
  name,
  placeholder,
  type = 'text',
  onChange,
  className,
}) => (
  <div className={className}>
    <label>{label}:</label>
    <input
      name={name}
      type={type}
      onChange={onChange}
      placeholder={placeholder}
    />
  </div>
);

export default Input;
