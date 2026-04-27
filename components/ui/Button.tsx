import React from 'react';
import { cn } from '@/components/layout/Shell';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({ variant = 'primary', size = 'md', className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flexitems-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black disabled:pointer-events-none disabled:opacity-50",
        {
          'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm': variant === 'primary',
          'bg-muted text-foreground hover:bg-muted border border-border': variant === 'secondary',
          'border border-border bg-transparent hover:bg-muted text-foreground': variant === 'outline',
          'hover:bg-muted hover:text-foreground text-muted-foreground': variant === 'ghost',
          'bg-red-500 text-primary-foreground hover:bg-red-600': variant === 'danger',
          'h-8 px-3 text-xs': size === 'sm',
          'h-9 px-4': size === 'md',
          'h-11 px-8': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
