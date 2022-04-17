const Dropdown = ({ options, id, initalValue, onSelectedValueChange }) => {
  return (
    <select id={id} onChange={(e) => onSelectedValueChange(e.target.value)}>
      {options.map(({ value, label }, i) => (
        <option key={i} selected={value === initalValue} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
};

export default Dropdown;
