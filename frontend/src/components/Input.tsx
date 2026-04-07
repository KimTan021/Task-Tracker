import React, { useId } from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
};

export const Input: React.FC<InputProps> = ({ label, error, icon, className = '', ...props }) => {
  const inputId = props.id ?? useId();
  const errorId = `${inputId}-error`;

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && <label htmlFor={inputId} className="text-label-sm font-bold uppercase tracking-widest text-[var(--color-on-surface-variant)]">{label}</label>}
      <div className="relative group">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--color-outline)] group-focus-within:text-[var(--color-primary)] transition-colors">
            {icon}
          </div>
        )}
        <input 
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={`w-full ${icon ? 'pl-11' : 'pl-4'} pr-4 py-4 bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)] transition-all duration-300 outline-none
            rounded-t-lg border-b-2 focus:bg-[var(--color-surface-container-lowest)] focus:border-b-[var(--color-primary)] focus-visible:ring-4 focus-visible:ring-[var(--color-primary)]/8
            ${error ? 'border-b-2 border-b-red-500 bg-red-50' : 'border-b-2 border-b-transparent'}
          `}
          {...props}
        />
      </div>
      {error && <span id={errorId} className="text-label-sm text-red-500 mt-1">{error}</span>}
    </div>
  );
};
