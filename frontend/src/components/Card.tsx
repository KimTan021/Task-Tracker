import React from 'react';

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  interactive?: boolean;
};

export const Card: React.FC<CardProps> = ({ interactive = false, className = '', children, ...props }) => {
  return (
    <div 
      className={`
        bg-[var(--color-surface-container-lowest)] 
        border border-[var(--color-outline-variant)]
        rounded-xl p-6
        ${interactive ? 'hover:shadow-[0_20px_40px_rgba(28,27,27,0.06)] hover:-translate-y-1 transition-all duration-300 cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};
