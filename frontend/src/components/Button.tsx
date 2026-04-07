import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'tertiary';
  children: React.ReactNode;
};

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', className = '', children, ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-body-md font-semibold transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-primary)]/12 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none';
  
  const variants = {
    primary: 'bg-kinetic text-white shadow-[0_20px_40px_rgba(28,27,27,0.06)] hover:-translate-y-0.5 hover:opacity-95',
    secondary: 'bg-[var(--color-surface-container-highest)] text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-low)]',
    tertiary: 'bg-transparent text-[var(--color-primary)] hover:bg-[var(--color-surface-container-low)]'
  };

  return (
    <button className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};
