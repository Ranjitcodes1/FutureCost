import React, { forwardRef } from 'react';
import { cn } from './Button';
import { ChevronDown } from 'lucide-react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          className={cn(
            'flex h-11 w-full items-center justify-between rounded-lg border border-carbon-border bg-carbon-surface/40 backdrop-blur-sm px-3 py-2 text-sm ring-offset-carbon-bg placeholder:text-carbon-muted focus:outline-none focus:ring-2 focus:ring-carbon-accent/50 focus:border-carbon-accent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
            className
          )}
          ref={ref}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-carbon-surface text-carbon-text">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <ChevronDown className="h-4 w-4 text-carbon-muted" />
        </div>
      </div>
    );
  }
);
Select.displayName = 'Select';

export { Select };
