import React from 'react';
import { Send, Loader2, CheckCircle, AlertCircle, Zap } from 'lucide-react';
import { useTransaction } from '../hooks/useTransaction';
import { useIsConnected } from '../core/store';
import { TransactionButtonProps, CryptoMomoTheme } from '../types';
import { Button } from './ui/button';
import { CryptoMomoWrapper } from './ui/wrapper';
import { cn } from '../utils/cn';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../constants';

// Theme utility to generate CSS variables
const generateThemeVariables = (theme?: CryptoMomoTheme): React.CSSProperties => {
  if (!theme) return {};
  
  const variables: Record<string, string> = {};
  
  if (theme.colors) {
    Object.entries(theme.colors).forEach(([key, value]) => {
      if (value) {
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
  
  return variables as React.CSSProperties;
};

export const TransactionButton: React.FC<TransactionButtonProps> = ({
  transaction,
  onSuccess,
  onError,
  className,
  children,
  disabled = false,
  gasless = false,
  theme,
  variant = "default",
  size = "default",
  showIcon = true,
}) => {
  const isConnected = useIsConnected();
  
  const {
    execute,
    isExecuting,
    error,
    isSuccess,
    data,
  } = useTransaction({
    onSuccess: (response) => {
      onSuccess?.(response);
    },
    onError: (error) => {
      onError?.(error);
    },
    gasless,
  });

  const handleExecute = async () => {
    if (!isConnected) {
      onError?.(new Error(ERROR_MESSAGES.UNAUTHORIZED) as any);
      return;
    }

    try {
      await execute(transaction);
    } catch (error) {
      console.error('Transaction failed:', error);
    }
  };

  const themeStyles = generateThemeVariables(theme);

  const getButtonContent = () => {
    if (isExecuting) {
      return (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {gasless ? 'Executing Gasless...' : 'Executing...'}
        </>
      );
    }
    
    if (children) {
      return (
        <>
          {showIcon && (
            gasless ? 
              <Zap className="mr-2 h-4 w-4" /> : 
              <Send className="mr-2 h-4 w-4" />
          )}
          {children}
        </>
      );
    }
    
    const defaultText = gasless ? 'Execute Gasless Transaction' : 'Execute Transaction';
    return (
      <>
        {showIcon && (
          gasless ? 
            <Zap className="mr-2 h-4 w-4" /> : 
            <Send className="mr-2 h-4 w-4" />
        )}
        {defaultText}
      </>
    );
  };

  const getVariant = () => {
    if (gasless) {
      return variant === "default" ? "secondary" : variant;
    }
    return variant;
  };

  return (
    <CryptoMomoWrapper variant="transaction" theme={theme} className={className}>
      <div className="space-y-3">
        <Button
          onClick={handleExecute}
          disabled={disabled || isExecuting || !isConnected}
          variant={getVariant()}
          size={size}
          className={cn(
            "w-full",
            gasless && "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 border-0"
          )}
        >
          {getButtonContent()}
        </Button>
        
        {!isConnected && (
          <div className="flex items-center text-sm text-muted-foreground">
            <AlertCircle className="mr-2 h-4 w-4" />
            {ERROR_MESSAGES.UNAUTHORIZED}
          </div>
        )}
        
        {error && (
          <div className="flex items-center text-sm text-destructive">
            <AlertCircle className="mr-2 h-4 w-4" />
            {error.message}
          </div>
        )}
        
        {isSuccess && data && (
          <div className="flex items-center text-sm text-green-600">
            <CheckCircle className="mr-2 h-4 w-4" />
            <span className="flex-1">
              {SUCCESS_MESSAGES.TRANSACTION_CONFIRMED}
              {data.txHash && (
                <span className="ml-1 font-mono text-xs">
                  {data.txHash.slice(0, 10)}...{data.txHash.slice(-8)}
                </span>
              )}
            </span>
          </div>
        )}
      </div>
    </CryptoMomoWrapper>
  );
}; 