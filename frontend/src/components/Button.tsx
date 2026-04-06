import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'tertiary';
  children: React.ReactNode;
};

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', className = '', children, ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 ease-in-out cursor-pointer rounded-lg px-4 py-2.5 text-body-md focus:outline-none';
  
  const variants = {
    primary: 'bg-kinetic text-white hover:opacity-90 shadow-[0_20px_40px_rgba(28,27,27,0.06)]',
    secondary: 'bg-[var(--color-surface-container-highest)] text-[var(--color-on-surface)] hover:bg-[var(--color-outline-variant)]',
    tertiary: 'bg-transparent text-[var(--color-primary)] hover:bg-[var(--color-surface-container-low)]'
  };

  return (
    <button className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};
