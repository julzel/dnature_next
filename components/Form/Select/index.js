const Select = ({
  label,
  name,
  onChange,
  options,
  className,
  defaultOption,
}) => (
  <div className={className}>
    <label>{label}</label>
    <select name={name} onChange={onChange} defaultValue={defaultOption}>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

export default Select;
