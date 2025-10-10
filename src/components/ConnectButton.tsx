import React, { useState } from 'react';
import { Wallet, Phone, KeyRound, Loader2 } from 'lucide-react';
import { useConnect } from '../hooks/useConnect';
import { useIsConnected, useDisconnect } from '../core/store';
import { ConnectButtonProps, CryptoMomoTheme } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from './ui/dialog';
import { CryptoMomoWrapper } from './ui/wrapper';
import { cn } from '../utils/cn';
import { ERROR_MESSAGES, SUCCESS_MESSAGES, VALIDATION, DEFAULTS } from '../constants';

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

const ConnectForm: React.FC<{
  onConnect?: (response: any) => void;
  onError?: (error: any) => void;
  onCancel?: () => void;
  theme?: CryptoMomoTheme;
}> = ({ onConnect, onError, onCancel, theme }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showCodeDisplay, setShowCodeDisplay] = useState(false);
  const [displayedCode, setDisplayedCode] = useState('');

  const {
    connect,
    register,
    verifyOTP,
    reset,
    isConnecting,
    isRegistering,
    isVerifying,
    needsRegistration,
    registrationSuccess,
    connectError,
    registerError,
    verifyError,
  } = useConnect({
    onSuccess: (response) => {
      // If OTP is returned, display it to user
      if (response.otp) {
        setDisplayedCode(response.otp);
        setShowCodeDisplay(true);
      } else {
        onConnect?.(response);
        setShowCodeDisplay(false);
        setPhoneNumber('');
        setDisplayedCode('');
      }
    },
    onError: (error) => {
      onError?.(error);
    },
  });

  const handleConnect = async () => {
    if (!phoneNumber.trim()) {
      onError?.(new Error(ERROR_MESSAGES.INVALID_PHONE) as any);
      return;
    }
    
    // Validate phone number format
    if (!VALIDATION.PHONE_REGEX.test(phoneNumber)) {
      onError?.(new Error(ERROR_MESSAGES.INVALID_PHONE) as any);
      return;
    }
    
    try {
      await connect(phoneNumber);
      setShowOTPInput(true);
    } catch (error) {
      console.error('Connection failed:', error);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim()) {
      onError?.(new Error(ERROR_MESSAGES.INVALID_OTP) as any);
      return;
    }
    
    // Validate OTP format
    if (!VALIDATION.OTP_REGEX.test(otp)) {
      onError?.(new Error(ERROR_MESSAGES.INVALID_OTP) as any);
      return;
    }
    
    try {
      await verifyOTP(otp);
    } catch (error) {
      console.error('OTP verification failed:', error);
    }
  };

  const handleRegister = async () => {
    if (!firstName.trim() || !lastName.trim() || !phoneNumber.trim()) {
      onError?.(new Error('First name, last name, and phone number are required') as any);
      return;
    }

    if (!VALIDATION.PHONE_REGEX.test(phoneNumber)) {
      onError?.(new Error(ERROR_MESSAGES.INVALID_PHONE) as any);
      return;
    }

    try {
      await register(firstName, lastName, phoneNumber);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const handleReset = () => {
    reset();
    setShowCodeDisplay(false);
    setPhoneNumber('');
    setDisplayedCode('');
    setFirstName('');
    setLastName('');
    onCancel?.();
  };

  const themeStyles = generateThemeVariables(theme);

  // Show connection code display (user confirms via USSD)
  if (showCodeDisplay && displayedCode) {
    return (
      <div className="space-y-4" style={themeStyles}>
        <div className="text-center space-y-3">
          <div className="text-lg font-semibold">
            Connection Code
          </div>
          <DialogDescription>
            Enter this code via USSD to confirm connection
          </DialogDescription>

          {/* Display the OTP code prominently */}
          <div className="bg-primary/10 border-2 border-primary rounded-lg p-6 my-4">
            <div className="text-4xl font-bold tracking-widest text-primary">
              {displayedCode}
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            Dial the USSD code and enter this number to complete your connection
          </div>
        </div>

        <div className="flex space-x-2">
          <Button onClick={handleReset} variant="outline" className="flex-1">
            Cancel
          </Button>
        </div>

        {connectError && (
          <div className="text-sm text-destructive">
            {connectError.message}
          </div>
        )}
      </div>
    );
  }

  // Show registration success / account claim prompt
  if (registrationSuccess) {
    return (
      <div className="space-y-4" style={themeStyles}>
        <div className="text-center space-y-2">
          <div className="text-lg font-semibold text-green-600">
            Account Created Successfully!
          </div>
          <DialogDescription>
            {SUCCESS_MESSAGES.ACCOUNT_REGISTERED}
          </DialogDescription>
          <div className="text-sm text-muted-foreground mt-4">
            Please dial the USSD short code to claim your wallet account.
          </div>
        </div>

        <div className="flex space-x-2">
          <Button onClick={handleReset} variant="outline" className="flex-1">
            Done
          </Button>
        </div>
      </div>
    );
  }

  // Show registration form
  if (needsRegistration) {
    return (
      <div className="space-y-4" style={themeStyles}>
        <div className="text-center">
          <DialogDescription>
            {ERROR_MESSAGES.USER_NOT_FOUND}
          </DialogDescription>
        </div>

        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            type="text"
            placeholder="Enter your first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={isRegistering}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            type="text"
            placeholder="Enter your last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled={isRegistering}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="regPhone">Phone Number</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="regPhone"
              type="tel"
              placeholder={`e.g., ${DEFAULTS.PHONE_COUNTRY_CODE}...`}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="pl-10"
              disabled={isRegistering}
            />
          </div>
        </div>

        <div className="flex space-x-2">
          <Button
            onClick={handleRegister}
            disabled={isRegistering || !firstName.trim() || !lastName.trim() || !phoneNumber.trim()}
            className="flex-1"
          >
            {isRegistering ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registering...
              </>
            ) : (
              'Register Account'
            )}
          </Button>

          <Button variant="outline" onClick={handleReset}>
            Cancel
          </Button>
        </div>

        {registerError && (
          <div className="text-sm text-destructive">
            {registerError.message}
          </div>
        )}
      </div>
    );
  }

  // Show phone number input (initial state)
  return (
    <div className="space-y-4" style={themeStyles}>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="phone"
            type="tel"
            placeholder={`Enter your phone number (e.g., ${DEFAULTS.PHONE_COUNTRY_CODE}...)`}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="pl-10"
            disabled={isConnecting}
          />
        </div>
      </div>

      <div className="flex space-x-2">
        <Button
          onClick={handleConnect}
          disabled={isConnecting || !phoneNumber.trim()}
          className="flex-1"
        >
          {isConnecting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Wallet className="mr-2 h-4 w-4" />
              Connect Wallet
            </>
          )}
        </Button>

        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>

      {connectError && (
        <div className="text-sm text-destructive">
          {connectError.message}
        </div>
      )}
    </div>
  );
};

export const ConnectButton: React.FC<ConnectButtonProps> = ({
  onConnect,
  onError,
  className,
  children,
  disabled = false,
  theme,
  variant = "default",
  size = "default",
  showLogo = true,
  modal = true,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isConnected = useIsConnected();
  const disconnect = useDisconnect();
  
  const themeStyles = generateThemeVariables(theme);

  const handleDisconnect = () => {
    disconnect();
  };

  const handleModalConnect = (response: any) => {
    onConnect?.(response);
    setIsModalOpen(false);
  };

  const handleModalError = (error: any) => {
    onError?.(error);
  };

  if (isConnected) {
    return (
      <CryptoMomoWrapper variant="connect" theme={theme} className={className}>
        <Button
          variant="outline"
          size={size}
          onClick={handleDisconnect}
          disabled={disabled}
          className="w-full"
        >
          <Wallet className={cn("h-4 w-4", showLogo && "mr-2")} />
          {children || 'Disconnect'}
        </Button>
      </CryptoMomoWrapper>
    );
  }

  if (modal) {
    return (
      <CryptoMomoWrapper variant="connect" theme={theme} className={className}>
        <Button
          variant={variant}
          size={size}
          onClick={() => setIsModalOpen(true)}
          disabled={disabled}
          className="w-full"
        >
          {showLogo && <Wallet className="mr-2 h-4 w-4" />}
          {children || 'Connect Wallet'}
        </Button>
        
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent >
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Wallet className="mr-2 h-5 w-5" />
                Connect Your Wallet
              </DialogTitle>
              <DialogDescription>
                Enter your phone number to connect your CryptoMomo wallet
              </DialogDescription>
            </DialogHeader>
            
            <CryptoMomoWrapper variant="modal" theme={theme}>
              <ConnectForm
                onConnect={handleModalConnect}
                onError={handleModalError}
                onCancel={() => setIsModalOpen(false)}
                theme={theme}
              />
            </CryptoMomoWrapper>
          </DialogContent>
        </Dialog>
      </CryptoMomoWrapper>
    );
  }

  // Inline mode
  return (
    <CryptoMomoWrapper variant="connect" theme={theme} className={className}>
      <ConnectForm
        onConnect={onConnect}
        onError={onError}
        theme={theme}
      />
    </CryptoMomoWrapper>
  );
}; 