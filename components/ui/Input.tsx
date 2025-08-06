'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { forwardRef, ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends Omit<HTMLMotionProps<"input">, 'size'> {
  label?: string;
  error?: string;
  success?: boolean;
  icon?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'ghost';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    label,
    error,
    success,
    icon,
    size = 'md',
    variant = 'default',
    className,
    onFocus,
    onBlur,
    ...props 
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    const sizes = {
      sm: 'h-10 text-sm',
      md: 'h-12 text-base',
      lg: 'h-14 text-lg'
    };

    const variants = {
      default: 'input',
      filled: 'bg-surface-hover dark:bg-surface-dark-hover border-2 border-transparent',
      ghost: 'bg-transparent border-b-2 border-border dark:border-border-dark rounded-none'
    };

    return (
      <div className="w-full">
        {label && (
          <motion.label
            className={cn(
              'label',
              isFocused ? 'text-primary' : 'text-text-secondary dark:text-text-dark-secondary',
              error && 'text-red-500',
              success && 'text-green-500'
            )}
            animate={{ 
              x: isFocused ? 2 : 0
            }}
          >
            {label}
          </motion.label>
        )}
        
        <div className="relative">
          {icon && (
            <motion.div
              className={cn(
                'absolute left-3 top-1/2 -translate-y-1/2 text-text-muted dark:text-text-dark-muted',
                isFocused && 'text-primary',
                error && 'text-red-500',
                success && 'text-green-500'
              )}
              animate={{ 
                scale: isFocused ? 1.1 : 1
              }}
            >
              {icon}
            </motion.div>
          )}
          
          <motion.input
            ref={ref}
            className={cn(
              'transition-all duration-300',
              'focus:outline-none focus:ring-4',
              'placeholder:text-text-muted dark:placeholder:text-text-dark-muted',
              sizes[size],
              variants[variant],
              icon && 'pl-12',
              isFocused && !error && 'border-primary focus:ring-primary/20',
              error && 'border-red-500 focus:ring-red-500/20',
              success && 'border-green-500 focus:ring-green-500/20',
              className
            )}
            whileFocus={{ scale: 1.02 }}
            onFocus={(e) => {
              setIsFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              onBlur?.(e);
            }}
            {...props}
          />
          
          {(error || success) && (
            <motion.div
              className={cn(
                'absolute right-3 top-1/2 -translate-y-1/2',
                error ? 'text-red-500' : 'text-green-500'
              )}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            >
              {error ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </motion.div>
          )}
        </div>
        
        {error && (
          <motion.p
            className="mt-2 text-sm text-red-500"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';