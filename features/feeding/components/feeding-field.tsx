export function FeedingField({ name, label, options, initial = "", required = true }: { name: string; label: string; options: readonly (readonly [string, string])[]; initial?: string; required?: boolean }) {
  return <label>{label}<select name={name} defaultValue={initial} required={required}>
    <option value="" disabled>Seleccioná una opción</option>
    {options.map(([value, text]) => <option value={value} key={value}>{text}</option>)}
  </select></label>;
}
