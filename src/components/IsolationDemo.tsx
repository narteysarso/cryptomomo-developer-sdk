import React from 'react';
import { ConnectButton } from './ConnectButton';
import { TransactionButton } from './TransactionButton';
import { CryptoMomoTheme } from '../types';

interface IsolationDemoProps {
  theme?: CryptoMomoTheme;
}

/**
 * IsolationDemo component demonstrates how CryptoMomo components
 * remain consistent regardless of parent styling
 */
export const IsolationDemo: React.FC<IsolationDemoProps> = ({ theme }) => {
  const mockTransaction = {
    to: '0x742d35Cc6634C0532925a3b8D6Ac6f1B2A3D7c2d' as `0x${string}`,
    value: BigInt('1000000000000000'), // 0.001 ETH in wei
    data: '0x' as `0x${string}`
  };

  return (
    <div className="space-y-8 p-8">
      <h2 className="text-2xl font-bold mb-4">CryptoMomo Component Isolation Demo</h2>
      
      {/* Normal parent styling */}
      <div className="border p-4 rounded-lg bg-gray-50">
        <h3 className="text-lg font-semibold mb-2">Normal Parent Container</h3>
        <div className="space-y-4">
          <ConnectButton theme={theme} />
          <TransactionButton 
            transaction={mockTransaction}
            theme={theme}
            gasless={true}
          />
        </div>
      </div>

      {/* Aggressive parent styling that could break components */}
      <div 
        className="border p-4 rounded-lg"
        style={{
          backgroundColor: '#ff0000',
          color: '#ffffff',
          fontSize: '24px',
          fontFamily: 'Comic Sans MS, cursive',
          lineHeight: '2',
          textAlign: 'center' as const,
          padding: '50px',
          border: '10px solid #00ff00',
          borderRadius: '50px'
        }}
      >
        <h3 className="text-lg font-semibold mb-2">Aggressive Parent Styling</h3>
        <p style={{ fontSize: '12px', marginBottom: '20px' }}>
          This parent has extreme styling that would normally break child components
        </p>
        <div className="space-y-4">
          <ConnectButton theme={theme} />
          <TransactionButton 
            transaction={mockTransaction}
            theme={theme}
            gasless={true}
          />
        </div>
      </div>

      {/* Flexbox parent that could affect sizing */}
      <div className="border p-4 rounded-lg bg-blue-50">
        <h3 className="text-lg font-semibold mb-2">Flexbox Parent (could affect sizing)</h3>
        <div className="flex flex-col md:flex-row gap-4 items-stretch">
          <div className="flex-1">
            <ConnectButton theme={theme} />
          </div>
          <div className="flex-1">
            <TransactionButton 
              transaction={mockTransaction}
              theme={theme}
              gasless={false}
            />
          </div>
        </div>
      </div>

      {/* Grid parent */}
      <div className="border p-4 rounded-lg bg-green-50">
        <h3 className="text-lg font-semibold mb-2">CSS Grid Parent</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ConnectButton theme={theme} />
          <TransactionButton 
            transaction={mockTransaction}
            theme={theme}
            gasless={true}
          />
        </div>
      </div>

      {/* Small container to test responsiveness */}
      <div className="border p-4 rounded-lg bg-yellow-50">
        <h3 className="text-lg font-semibold mb-2">Small Container (300px width)</h3>
        <div style={{ width: '300px', margin: '0 auto' }}>
          <div className="space-y-4">
            <ConnectButton theme={theme} />
            <TransactionButton 
              transaction={mockTransaction}
              theme={theme}
              gasless={true}
            />
          </div>
        </div>
      </div>

      {/* Very small container */}
      <div className="border p-4 rounded-lg bg-purple-50">
        <h3 className="text-lg font-semibold mb-2">Very Small Container (250px width)</h3>
        <div style={{ width: '250px', margin: '0 auto' }}>
          <div className="space-y-4">
            <ConnectButton theme={theme} />
            <TransactionButton 
              transaction={mockTransaction}
              theme={theme}
              gasless={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}; 