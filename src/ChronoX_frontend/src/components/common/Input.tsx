import React from 'react';
import './Input.scss';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  helperText, 
  required, 
  className = '',
  id,
  ...props 
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  const classes = [
    'input',
    error && 'input--error',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="input-wrapper">
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {required && <span className="input-label__required">*</span>}
        </label>
      )}
      <input 
        id={inputId}
        className={classes}
        {...props}
      />
      {error && <div className="input-error">{error}</div>}
      {helperText && !error && <div className="input-helper">{helperText}</div>}
    </div>
  );
};

export default Input;