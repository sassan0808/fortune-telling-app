'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { forwardRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends HTMLMotionProps<"span"> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
  children: ReactNode;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ 
    variant = 'default',
    size = 'md',
    pulse = false,
    className,
    children,
    ...props 
  }, ref) => {
    const variants = {
      default: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
      primary: 'bg-gradient-to-r from-pink-500 to-rose-500 text-white',
      secondary: 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white',
      success: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white',
      warning: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white',
      danger: 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
    };

    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-3 py-1 text-sm',
      lg: 'px-4 py-1.5 text-base'
    };

    return (
      <motion.span
        ref={ref}
        className={cn(
          'inline-flex items-center font-medium rounded-full',
          variants[variant],
          sizes[size],
          className
        )}
        whileHover={{ scale: 1.05 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {pulse && (
          <motion.span
            className="w-2 h-2 mr-2 rounded-full bg-current"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: 'loop',
            }}
          />
        )}
        {children}
      </motion.span>
    );
  }
);

Badge.displayName = 'Badge';