import React from 'react';

export const Input = ({
  label,
  error,
  helperText,
  icon,
  className = '',
  id,
  type = 'text',
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`form-field ${error ? 'has-error' : ''} ${className}`}>
      {label && <label htmlFor={inputId} className="form-label">{label}</label>}
      <div className="input-wrapper">
        {icon && <span className="input-icon">{icon}</span>}
        <input
          id={inputId}
          type={type}
          className={`input-control ${icon ? 'has-icon' : ''}`}
          {...props}
        />
      </div>
      {error && <span className="form-error">{error}</span>}
      {!error && helperText && <span className="form-helper">{helperText}</span>}
    </div>
  );
};

export const Textarea = ({
  label,
  error,
  helperText,
  className = '',
  id,
  rows = 4,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`form-field ${error ? 'has-error' : ''} ${className}`}>
      {label && <label htmlFor={inputId} className="form-label">{label}</label>}
      <textarea
        id={inputId}
        rows={rows}
        className="textarea-control"
        {...props}
      />
      {error && <span className="form-error">{error}</span>}
      {!error && helperText && <span className="form-helper">{helperText}</span>}
    </div>
  );
};
