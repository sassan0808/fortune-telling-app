'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { forwardRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLMotionProps<"div"> {
  variant?: 'default' | 'gradient' | 'glass' | 'neon';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  glow?: boolean;
  children: ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ 
    variant = 'default', 
    padding = 'md',
    hover = true,
    glow = false,
    className,
    children,
    ...props 
  }, ref) => {
    const variants = {
      default: 'card',
      gradient: 'bg-gradient-to-br from-primary/5 via-surface to-secondary/5 dark:from-surface-dark dark:to-surface-dark shadow-xl border border-border dark:border-border-dark',
      glass: 'bg-surface/70 dark:bg-surface-dark/70 backdrop-blur-xl shadow-xl border border-border/20 dark:border-border-dark/20',
      neon: 'bg-surface-dark shadow-xl border border-accent/50'
    };

    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8'
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          'rounded-xl transition-all duration-300',
          variants[variant],
          paddings[padding],
          hover && 'hover:shadow-lg hover:-translate-y-1',
          glow && variant === 'neon' && 'shadow-accent/25',
          className
        )}
        whileHover={hover ? { scale: 1.02 } : undefined}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        {...props}
      >
        {children}
        
        {glow && variant === 'neon' && (
          <motion.div
            className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent/20 to-primary/20 blur-xl"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
            style={{ zIndex: -1 }}
          />
        )}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

interface CardHeaderProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn('mb-4', className)}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

interface CardTitleProps extends HTMLMotionProps<"h3"> {
  children: ReactNode;
}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <motion.h3
        ref={ref}
        className={cn(
          'text-2xl font-bold text-text-primary dark:text-text-dark-primary',
          className
        )}
        {...props}
      >
        {children}
      </motion.h3>
    );
  }
);

CardTitle.displayName = 'CardTitle';

interface CardContentProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn('text-text-secondary dark:text-text-dark-secondary', className)}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

CardContent.displayName = 'CardContent';