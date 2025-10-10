import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Loader2,
  Copy,
  CheckCheck,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';
import { TransactionRequest, TransactionResponse, CryptoMomoError } from '../types';
import { useTransaction, useTransactionStatus } from '../hooks/useTransaction';
import { SUCCESS_MESSAGES } from '../constants';

export interface TransactionFlowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Omit<TransactionRequest, 'connectionId'>;
  gasless?: boolean;
  onSuccess?: (response: TransactionResponse) => void;
  onError?: (error: CryptoMomoError) => void;
}

type FlowStep = 'preview' | 'confirmation' | 'tracking' | 'complete' | 'error';

export function TransactionFlowDialog({
  open,
  onOpenChange,
  transaction,
  gasless = false,
  onSuccess,
  onError,
}: TransactionFlowDialogProps) {
  const [currentStep, setCurrentStep] = useState<FlowStep>('preview');
  const [transactionResponse, setTransactionResponse] = useState<TransactionResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  const { execute, isExecuting, error: txError } = useTransaction({
    gasless,
    onSuccess: (response) => {
      setTransactionResponse(response);
      setCurrentStep('confirmation');
      onSuccess?.(response);
    },
    onError: (error) => {
      setCurrentStep('error');
      onError?.(error);
    },
  });

  // Poll transaction status once we have a transaction ID
  const { data: statusData } = useTransactionStatus(
    currentStep === 'tracking' ? transactionResponse?.id : undefined
  );

  // Update transaction response with latest status
  useEffect(() => {
    if (statusData && transactionResponse) {
      setTransactionResponse(statusData);

      // Move to complete step when transaction is in terminal state
      if (statusData.status === 'completed') {
        setCurrentStep('complete');
      } else if (statusData.status === 'failed' || statusData.status === 'expired') {
        setCurrentStep('error');
      }
    }
  }, [statusData, transactionResponse]);

  // Countdown timer for confirmation code expiry
  useEffect(() => {
    if (currentStep === 'confirmation' && transactionResponse?.codeExpiresAt) {
      const updateTimer = () => {
        const now = new Date().getTime();
        const expiryTime = new Date(transactionResponse.codeExpiresAt).getTime();
        const remaining = Math.max(0, Math.floor((expiryTime - now) / 1000));
        setTimeRemaining(remaining);

        if (remaining === 0) {
          setCurrentStep('error');
        }
      };

      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    }
  }, [currentStep, transactionResponse]);

  const handleSubmit = async () => {
    await execute(transaction);
  };

  const handleCopyCode = () => {
    if (transactionResponse?.confirmationCode) {
      navigator.clipboard.writeText(transactionResponse.confirmationCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    if (currentStep !== 'tracking') {
      onOpenChange(false);
      // Reset state after closing
      setTimeout(() => {
        setCurrentStep('preview');
        setTransactionResponse(null);
        setCopied(false);
      }, 300);
    }
  };

  const handleProceedToTracking = () => {
    setCurrentStep('tracking');
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatValue = (value: string): string => {
    try {
      const ethValue = BigInt(value) / BigInt(10 ** 18);
      return `${ethValue.toString()} ETH`;
    } catch {
      return value;
    }
  };

  const getStatusIcon = (status: TransactionResponse['status']) => {
    switch (status) {
      case 'awaiting_confirmation':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case 'executing':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
      case 'expired':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusLabel = (status: TransactionResponse['status']) => {
    switch (status) {
      case 'awaiting_confirmation':
        return 'Awaiting Confirmation';
      case 'confirmed':
        return 'Confirmed';
      case 'executing':
        return 'Executing Transaction...';
      case 'completed':
        return 'Transaction Complete';
      case 'failed':
        return 'Transaction Failed';
      case 'expired':
        return 'Transaction Expired';
      default:
        return status;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        {/* Preview Step */}
        {currentStep === 'preview' && (
          <>
            <DialogHeader>
              <DialogTitle>Review Transaction</DialogTitle>
              <DialogDescription>
                Please review the transaction details before proceeding.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Transaction Details */}
              <div className="rounded-lg border p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-sm text-muted-foreground">To</span>
                  <span className="text-sm font-mono text-right break-all max-w-[300px]">
                    {transaction.to}
                  </span>
                </div>

                {transaction.value && transaction.value !== '0' && (
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-muted-foreground">Value</span>
                    <span className="text-sm font-semibold">
                      {formatValue(transaction.value)}
                    </span>
                  </div>
                )}

                {transaction.data && transaction.data !== '0x' && (
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-muted-foreground">Data</span>
                    <span className="text-sm font-mono text-right break-all max-w-[300px]">
                      {transaction.data.slice(0, 20)}...
                    </span>
                  </div>
                )}

                {transaction.chainId && (
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-muted-foreground">Chain ID</span>
                    <span className="text-sm">{transaction.chainId}</span>
                  </div>
                )}

                {gasless && (
                  <div className="flex items-center gap-2 pt-2 border-t">
                    <CheckCheck className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600 font-medium">
                      Gasless Transaction (Sponsored)
                    </span>
                  </div>
                )}
              </div>

              {/* Warning */}
              <div className="flex items-start gap-2 rounded-lg bg-yellow-50 p-3 border border-yellow-200">
                <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium">Important</p>
                  <p className="mt-1">
                    You will receive a 6-digit code to confirm this transaction via USSD.
                    The code expires in 5 minutes.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleClose}
                className="flex-1"
                disabled={isExecuting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex-1"
                disabled={isExecuting}
              >
                {isExecuting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </>
        )}

        {/* Confirmation Code Step */}
        {currentStep === 'confirmation' && transactionResponse && (
          <>
            <DialogHeader>
              <DialogTitle>Confirm Transaction</DialogTitle>
              <DialogDescription>
                Enter this code on your USSD to confirm the transaction.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Confirmation Code Display */}
              <div className="flex flex-col items-center justify-center py-6 space-y-4">
                <div className="text-sm text-muted-foreground">Confirmation Code</div>
                <div className="text-5xl font-bold tracking-widest font-mono bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {transactionResponse.confirmationCode}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyCode}
                  className="gap-2"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy Code
                    </>
                  )}
                </Button>
              </div>

              {/* Timer */}
              <div className="flex items-center justify-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className={timeRemaining < 60 ? 'text-red-600 font-semibold' : 'text-muted-foreground'}>
                  Expires in {formatTime(timeRemaining)}
                </span>
              </div>

              {/* Instructions */}
              <div className="rounded-lg border p-4 space-y-2">
                <p className="text-sm font-medium">How to confirm:</p>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Dial your USSD code (e.g., *123#)</li>
                  <li>Select "Confirm Transaction"</li>
                  <li>Enter the 6-digit code above</li>
                  <li>Follow the prompts to complete</li>
                </ol>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleClose}
                className="flex-1"
              >
                Close
              </Button>
              <Button
                onClick={handleProceedToTracking}
                className="flex-1"
              >
                Track Status
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </>
        )}

        {/* Tracking Step */}
        {currentStep === 'tracking' && transactionResponse && (
          <>
            <DialogHeader>
              <DialogTitle>Transaction Status</DialogTitle>
              <DialogDescription>
                Tracking your transaction in real-time.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Current Status */}
              <div className="flex flex-col items-center justify-center py-6 space-y-4">
                {getStatusIcon(transactionResponse.status)}
                <div className="text-center">
                  <p className="text-lg font-semibold">
                    {getStatusLabel(transactionResponse.status)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Transaction ID: {transactionResponse.id.slice(0, 8)}...
                  </p>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="space-y-3">
                <StatusItem
                  status="awaiting_confirmation"
                  label="Awaiting Confirmation"
                  currentStatus={transactionResponse.status}
                />
                <StatusItem
                  status="confirmed"
                  label="Confirmed"
                  currentStatus={transactionResponse.status}
                />
                <StatusItem
                  status="executing"
                  label="Executing"
                  currentStatus={transactionResponse.status}
                />
                <StatusItem
                  status="completed"
                  label="Completed"
                  currentStatus={transactionResponse.status}
                />
              </div>

              {/* Transaction Hash (if available) */}
              {transactionResponse.txHash && (
                <div className="rounded-lg border p-4">
                  <p className="text-sm font-medium mb-2">Transaction Hash</p>
                  <div className="flex items-center gap-2">
                    <code className="text-xs font-mono bg-muted px-2 py-1 rounded flex-1 break-all">
                      {transactionResponse.txHash}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        // Open block explorer
                        window.open(`https://etherscan.io/tx/${transactionResponse.txHash}`, '_blank');
                      }}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <Button
              variant="outline"
              onClick={handleClose}
              className="w-full"
              disabled={transactionResponse.status === 'executing'}
            >
              {transactionResponse.status === 'executing' ? 'Please wait...' : 'Close'}
            </Button>
          </>
        )}

        {/* Complete Step */}
        {currentStep === 'complete' && transactionResponse && (
          <>
            <DialogHeader>
              <DialogTitle>Transaction Complete!</DialogTitle>
              <DialogDescription>
                Your transaction has been successfully executed.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="flex flex-col items-center justify-center py-6 space-y-4">
                <div className="rounded-full bg-green-100 p-3">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
                <p className="text-lg font-semibold text-center">
                  {SUCCESS_MESSAGES.TRANSACTION_CONFIRMED}
                </p>
              </div>

              {/* Transaction Details */}
              <div className="rounded-lg border p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Transaction ID</span>
                  <span className="font-mono">{transactionResponse.id.slice(0, 12)}...</span>
                </div>

                {transactionResponse.txHash && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Hash</span>
                    <span className="font-mono">{transactionResponse.txHash.slice(0, 12)}...</span>
                  </div>
                )}

                {transactionResponse.blockNumber && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Block</span>
                    <span className="font-mono">{transactionResponse.blockNumber}</span>
                  </div>
                )}

                {transactionResponse.gasUsed && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Gas Used</span>
                    <span className="font-mono">{transactionResponse.gasUsed}</span>
                  </div>
                )}
              </div>

              {transactionResponse.txHash && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    window.open(`https://etherscan.io/tx/${transactionResponse.txHash}`, '_blank');
                  }}
                >
                  View on Explorer
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>

            <Button onClick={handleClose} className="w-full">
              Done
            </Button>
          </>
        )}

        {/* Error Step */}
        {currentStep === 'error' && (
          <>
            <DialogHeader>
              <DialogTitle>Transaction Error</DialogTitle>
              <DialogDescription>
                There was an issue with your transaction.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="flex flex-col items-center justify-center py-6 space-y-4">
                <div className="rounded-full bg-red-100 p-3">
                  <XCircle className="h-12 w-12 text-red-600" />
                </div>
                <p className="text-lg font-semibold text-center text-red-600">
                  {transactionResponse?.status === 'expired'
                    ? 'Confirmation Code Expired'
                    : 'Transaction Failed'
                  }
                </p>
              </div>

              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="text-sm text-red-800">
                  {txError?.message ||
                   transactionResponse?.status === 'expired'
                     ? 'The confirmation code has expired. Please try again.'
                     : 'The transaction could not be completed. Please try again.'}
                </p>
              </div>
            </div>

            <Button onClick={handleClose} className="w-full" variant="outline">
              Close
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Helper component for status timeline
interface StatusItemProps {
  status: TransactionResponse['status'];
  label: string;
  currentStatus: TransactionResponse['status'];
}

function StatusItem({ status, label, currentStatus }: StatusItemProps) {
  const statusOrder: TransactionResponse['status'][] = [
    'awaiting_confirmation',
    'confirmed',
    'executing',
    'completed',
  ];

  const currentIndex = statusOrder.indexOf(currentStatus);
  const itemIndex = statusOrder.indexOf(status);

  const isComplete = itemIndex < currentIndex || (currentStatus === 'completed' && status === 'completed');
  const isCurrent = itemIndex === currentIndex;
  const isPending = itemIndex > currentIndex;

  return (
    <div className="flex items-center gap-3">
      <div className={`
        flex items-center justify-center w-8 h-8 rounded-full border-2 flex-shrink-0
        ${isComplete ? 'bg-green-500 border-green-500' : ''}
        ${isCurrent ? 'bg-blue-500 border-blue-500' : ''}
        ${isPending ? 'bg-gray-100 border-gray-300' : ''}
      `}>
        {isComplete ? (
          <CheckCircle className="h-4 w-4 text-white" />
        ) : isCurrent ? (
          <Loader2 className="h-4 w-4 text-white animate-spin" />
        ) : (
          <div className="w-2 h-2 rounded-full bg-gray-400" />
        )}
      </div>
      <div className="flex-1">
        <p className={`text-sm font-medium ${isPending ? 'text-muted-foreground' : ''}`}>
          {label}
        </p>
      </div>
    </div>
  );
}
