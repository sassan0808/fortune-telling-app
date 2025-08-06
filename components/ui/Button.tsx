'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { forwardRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends Omit<HTMLMotionProps<"button">, 'size'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  glow?: boolean;
  children: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md', 
    isLoading = false,
    icon,
    iconPosition = 'left',
    fullWidth = false,
    glow = false,
    className,
    children,
    disabled,
    ...props 
  }, ref) => {
    const variants = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      ghost: 'btn-ghost',
      danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md hover:shadow-lg border border-red-400/50 hover:from-red-600 hover:to-red-700',
      success: 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md hover:shadow-lg border border-green-400/50 hover:from-green-600 hover:to-green-700',
      warning: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-md hover:shadow-lg border border-yellow-400/50 hover:from-yellow-600 hover:to-orange-600'
    };

    const sizes = {
      sm: 'px-4 py-2.5 text-sm rounded-lg min-h-[44px]',  // 🔧 最小44px確保
      md: 'px-5 py-3 text-base rounded-xl min-h-[48px]',  // 🔧 最小48px確保
      lg: 'px-6 py-3.5 text-lg rounded-2xl min-h-[52px]', // 🔧 余裕のある高さ
      xl: 'px-8 py-4 text-xl rounded-3xl min-h-[56px]'    // 🔧 大きめのタッチターゲット
    };

    return (
      <motion.button
        ref={ref}
        className={cn(
          'relative font-medium transition-all duration-300 flex items-center justify-center gap-2',
          'focus:outline-none focus:ring-4 focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'transform-gpu',
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          glow && 'animate-glow',
          variant === 'primary' && 'focus:ring-primary/50',
          variant === 'secondary' && 'focus:ring-secondary/50',
          variant === 'ghost' && 'focus:ring-text-tertiary/30',
          variant === 'danger' && 'focus:ring-red-500/50',
          variant === 'success' && 'focus:ring-green-500/50',
          variant === 'warning' && 'focus:ring-yellow-500/50',
          className
        )}
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <motion.div
            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                {icon}
              </motion.span>
            )}
            <span>{children}</span>
            {icon && iconPosition === 'right' && (
              <motion.span
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                {icon}
              </motion.span>
            )}
          </>
        )}
        
        {glow && (
          <motion.div
            className="absolute inset-0 rounded-inherit bg-gradient-to-r from-blue-600 to-green-600 opacity-0"
            animate={{
              opacity: [0, 0.5, 0],
              scale: [1, 1.2, 1.2],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: 'loop',
            }}
            style={{ borderRadius: 'inherit', zIndex: -1 }}
          />
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';