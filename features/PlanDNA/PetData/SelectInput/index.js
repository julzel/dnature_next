const SelectInput = ({ label, id, value, options, onChange }) => (
  <div className='field'>
    <label htmlFor={id}>{label}</label>{' '}
    <select id={id} value={value} onChange={(event) => onChange(event.target.value)}>
      {options.map((option) => (
        <option value={option.value} key={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

export default SelectInput;
