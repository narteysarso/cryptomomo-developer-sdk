import React from 'react';
import { cn } from '../../utils/cn';

interface CryptoMomoWrapperProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  theme?: Record<string, any>;
  variant?: 'connect' | 'transaction' | 'modal';
}

/**
 * CryptoMomoWrapper provides CSS isolation and consistent styling
 * for all CryptoMomo components, ensuring they work reliably
 * regardless of the parent component's styling.
 */
export const CryptoMomoWrapper: React.FC<CryptoMomoWrapperProps> = ({
  children,
  className,
  style,
  theme,
  variant = 'connect'
}) => {
  // Generate theme CSS variables
  const themeVariables = React.useMemo(() => {
    if (!theme) return {};
    
    const variables: Record<string, string> = {};
    
    if (theme.colors) {
      Object.entries(theme.colors).forEach(([key, value]) => {
        if (value && typeof value === 'string') {
          variables[`--${key}`] = value;
        }
      });
    }
    
    if (theme.borderRadius) {
      variables['--radius'] = theme.borderRadius;
    }
    
    if (theme.fontFamily) {
      variables['--font-family'] = theme.fontFamily;
    }
    
    return variables;
  }, [theme]);

  const combinedStyle = {
    ...themeVariables,
    ...style
  } as React.CSSProperties;

  return (
    <div
      className={cn(
        // Reset and isolation styles
        'crypto-momo-wrapper',
        // Base styles for consistent behavior
        'relative',
        'box-border',
        'font-sans',
        'text-base',
        'leading-normal',
        // Ensure proper sizing
        'w-auto',
        'min-w-0',
        // Theme application
        'crypto-momo-theme',
        // Variant-specific classes
        variant === 'connect' && 'crypto-momo-connect',
        variant === 'transaction' && 'crypto-momo-transaction',
        variant === 'modal' && 'crypto-momo-modal',
        className
      )}
      style={combinedStyle}
    >
      {children}
    </div>
  );
}; 