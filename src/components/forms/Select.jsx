const Select = ({ name, label, value, onChange, error = "", children }) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <select
        name={name}
        value={value}
        id={name}
        onChange={onChange}
        className={"form-control" + (error && " is-invalid")}
      >
        {children}
      </select>
      <div className="invalid-feedback">{error}</div>
    </div>
  );
};

export default Select;
