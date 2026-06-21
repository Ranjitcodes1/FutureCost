import React, { forwardRef } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-carbon-accent disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
          {
            'bg-gradient-to-r from-carbon-accent to-carbon-cyan text-carbon-bg hover:opacity-90 shadow-glow hover:shadow-lg hover:scale-[1.02]': variant === 'primary',
            'bg-carbon-surface/60 backdrop-blur-md text-carbon-text hover:bg-carbon-surface border border-carbon-border hover:border-carbon-muted': variant === 'secondary',
            'border border-carbon-border bg-transparent hover:bg-carbon-surface/40 hover:backdrop-blur-md text-carbon-text': variant === 'outline',
            'hover:bg-carbon-surface/30 text-carbon-text': variant === 'ghost',
            'h-9 px-4 text-sm': size === 'sm',
            'h-11 px-6 text-base': size === 'md',
            'h-14 px-8 text-lg': size === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
