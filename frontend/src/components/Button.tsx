import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'tertiary';
  children: React.ReactNode;
};

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', className = '', children, ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-body-md font-bold transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-primary)]/12 active:scale-95 active:shadow-inner disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none';
  
  const variants = {
    primary: 'bg-kinetic text-white shadow-[0_12px_24px_rgba(53,37,205,0.2)] hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(53,37,205,0.25)]',
    secondary: 'bg-[var(--color-surface-container-highest)] text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-low)] shadow-sm hover:shadow-md',
    tertiary: 'bg-transparent text-[var(--color-primary)] hover:bg-indigo-50/50'
  };

  return (
    <button className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};
