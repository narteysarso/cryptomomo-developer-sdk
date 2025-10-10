import React from 'react';
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
export declare const CryptoMomoWrapper: React.FC<CryptoMomoWrapperProps>;
export {};
//# sourceMappingURL=wrapper.d.ts.map