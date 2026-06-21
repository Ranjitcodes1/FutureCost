import React, { forwardRef } from 'react';
import { cn } from './Button';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-11 w-full rounded-lg border border-carbon-border bg-carbon-surface/40 backdrop-blur-sm px-3 py-2 text-sm ring-offset-carbon-bg file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-carbon-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-carbon-accent/50 focus-visible:border-carbon-accent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
