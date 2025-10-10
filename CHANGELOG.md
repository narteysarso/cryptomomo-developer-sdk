# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.2.7] - 2024-12-19

### Enhanced
- **Dialog Component**: Major modernization with function components, Next.js 13+ compatibility, and improved accessibility
  - Added `"use client"` directive for App Router compatibility
  - Converted from `forwardRef` to cleaner function components
  - Added `data-slot` attributes for better CSS targeting and debugging
  - Enhanced close button with `showCloseButton` prop for optional display
  - Improved responsive width handling with `max-w-[calc(100%-2rem)]`
  - Updated to use `XIcon` instead of `X` for consistency
  - Better focus states and accessibility features

- **Button Component**: Comprehensive styling and accessibility improvements
  - Added `data-slot="button"` for consistent targeting
  - Enhanced focus states with improved ring and border styling
  - Added `aria-invalid` support with proper destructive styling
  - Improved icon handling with better SVG sizing and positioning
  - Modern class structure with cleaner Tailwind organization

- **Input Component**: Significant accessibility and styling enhancements
  - Added `data-slot="input"` for consistent targeting
  - Full `aria-invalid` support with destructive styling states
  - Enhanced focus states with modern ring and border interactions
  - Improved file input styling and selection colors
  - Better dark mode support and theme integration

- **Label Component**: Smart modernization for better React compatibility
  - Added `"use client"` directive for Next.js compatibility
  - Added `data-slot="label"` for consistent targeting
  - Enhanced group states with `group-data-[disabled=true]` support
  - Improved peer element interaction support
  - Better disabled state handling and cursor management

### Technical Improvements
- All components now use modern function component patterns
- Enhanced TypeScript support with better prop interfaces
- Improved accessibility compliance (WCAG standards)
- Better performance with optimized React patterns
- Full backward compatibility maintained

## [2.2.6] - 2024-12-19

### Fixed
- Dialog component now uses responsive width - full width on small screens, default width on medium and larger screens
- Improved mobile user experience with proper dialog sizing

## [2.2.5] - 2024-12-19

## [2.2.4] - 2024-12-19

## [2.2.0] - 2024-12-19

### Added
- **Constants Organization**: Centralized all literals and configuration values
  - `API_CONFIG`: Base URL, timeout, retry settings
  - `ENDPOINTS`: All API endpoint paths
  - `ERROR_MESSAGES` & `SUCCESS_MESSAGES`: Standardized user messages
  - `VALIDATION`: Regex patterns for phone, OTP, addresses
  - `DEFAULTS`: Default values for country code, OTP length, etc.
  - `STORAGE_KEYS`: Consistent localStorage keys
  - `FEATURES`: Feature flags for conditional functionality
  - `EXTERNAL_URLS`: All external links centralized

### Changed
- **API Base URL**: Updated from `https://api.cryptomomo.com` to `https://api.cryptomomo.africa/v1`
- **Domain Migration**: All references updated to `cryptomomo.africa`
- **Enhanced Validation**: Improved phone number and OTP validation with regex patterns
- **Error Handling**: Standardized error messages across all components and hooks
- **Format Utilities**: Enhanced with validation functions using constants

### Improved
- **Developer Experience**: Constants are now easily accessible and modifiable
- **Maintainability**: All configuration values in one place
- **Type Safety**: Better TypeScript support with const assertions
- **Documentation**: Added comprehensive constants usage guide

## [2.0.0] - 2024-01-XX

### 🎉 Major Release - shadcn/ui Integration & Custom Theming

This major release introduces a complete redesign of the SDK with shadcn/ui components and a powerful theming system.

### ✨ Added

#### UI Components & Design System
- **shadcn/ui Integration**: Complete integration with shadcn/ui component library
- **Button Component**: Full variant system (default, outline, secondary, ghost) with multiple sizes
- **Input Component**: Modern styled inputs with proper accessibility
- **Label Component**: Using Radix UI primitives for better accessibility
- **Dialog Component**: Modal functionality with smooth animations
- **Utility Functions**: `cn()` function for combining CSS classes with Tailwind merge

#### Theming System
- **CryptoMomoTheme Interface**: Comprehensive theme configuration support
- **ThemeProvider**: Global theme management with React context
- **Component-Level Theming**: Apply themes directly to individual components
- **CSS Variables**: Dynamic theme application using CSS custom properties
- **HSL Color System**: Better color manipulation and consistency
- **Dark Mode Support**: Built-in dark theme variants

#### Enhanced Components
- **ConnectButton Improvements**:
  - Modal and inline modes (`modal={true/false}`)
  - Custom variants and sizes
  - Icons with lucide-react
  - Loading states with spinners
  - Better UX with phone and OTP input styling
  - Theme support at component level

- **TransactionButton Improvements**:
  - Gasless transaction styling with gradient effects
  - Success/error states with icons
  - Connection status indicators
  - Custom theming support
  - Enhanced visual feedback

#### Developer Experience
- **Comprehensive Documentation**: Complete API reference, theming guide, and troubleshooting
- **TypeScript Improvements**: Better type definitions and IntelliSense support
- **Error Handling**: Improved error classes and messages
- **Performance Optimizations**: Better tree-shaking and bundle size

### 🔧 Changed

#### Breaking Changes
- **Theme Format**: Now uses HSL color format instead of hex colors
- **Component Props**: Added new props for theming and variants
- **CSS Classes**: New Tailwind-based styling system
- **Import Structure**: UI components now available as separate exports

#### Improved APIs
- **ConnectButton**:
  ```tsx
  // Before
  <ConnectButton className="custom-class" />
  
  // After
  <ConnectButton 
    variant="outline" 
    size="lg" 
    theme={customTheme}
    modal={true}
    showLogo={true}
  />
  ```

- **TransactionButton**:
  ```tsx
  // Before
  <TransactionButton transaction={tx} gasless={true} />
  
  // After
  <TransactionButton 
    transaction={tx} 
    gasless={true}
    variant="secondary"
    size="lg"
    showIcon={true}
    theme={customTheme}
  />
  ```

### 📚 Documentation

#### New Documentation Files
- **API_REFERENCE.md**: Complete API documentation for all components and hooks
- **THEMING_GUIDE.md**: Comprehensive theming guide with examples
- **TROUBLESHOOTING.md**: Common issues and solutions
- **CHANGELOG.md**: Version history and changes

#### Updated README
- **Enhanced Examples**: More comprehensive usage examples
- **Theming Section**: Detailed theming documentation
- **Performance Tips**: Optimization best practices
- **Mobile Support**: Responsive design guidelines
- **Security Guidelines**: Best practices for secure implementation

### 🔄 Migration Guide

#### From v1.x to v2.x

1. **Update Dependencies**:
   ```bash
   npm install cryptomomo-developer-sdk@^2.0.0
   ```

2. **Install New Peer Dependencies**:
   ```bash
   npm install @radix-ui/react-dialog @radix-ui/react-label clsx tailwind-merge
   ```

3. **Update Theme Format**:
   ```tsx
   // Before (v1.x)
   const theme = {
     primaryColor: '#8b5cf6',
     backgroundColor: '#ffffff',
   };
   
   // After (v2.x)
   const theme = {
     colors: {
       primary: 'hsl(262 83% 58%)',
       background: 'hsl(0 0% 100%)',
     },
   };
   ```

4. **Update Component Usage**:
   ```tsx
   // Before
   <ConnectButton className="my-button" />
   
   // After
   <ConnectButton 
     variant="outline" 
     size="lg" 
     className="my-button"
   />
   ```

5. **Add ThemeProvider** (Optional):
   ```tsx
   import { ThemeProvider } from 'cryptomomo-developer-sdk';
   
   <ThemeProvider theme={yourTheme}>
     <App />
   </ThemeProvider>
   ```

### 🐛 Fixed
- **CSS Conflicts**: Resolved Tailwind CSS conflicts with component styles
- **TypeScript Issues**: Fixed type definition exports and imports
- **Bundle Size**: Optimized bundle size with better tree-shaking
- **Accessibility**: Improved WCAG compliance across all components
- **Mobile Responsiveness**: Better mobile experience and touch targets

### 🔒 Security
- **Input Validation**: Enhanced validation for phone numbers and transaction data
- **Error Handling**: Better error messages without exposing sensitive information
- **API Security**: Improved API key and configuration validation

---

## [1.0.0] - 2023-12-XX

### 🎉 Initial Release

#### ✨ Added
- **ConnectButton**: Phone-based wallet connection with OTP verification
- **TransactionButton**: Blockchain transaction execution with gasless support
- **CryptoMomoProvider**: React context provider for SDK configuration
- **useConnect Hook**: Custom hook for wallet connection logic
- **useTransaction Hook**: Custom hook for transaction execution
- **TypeScript Support**: Full type definitions and IntelliSense
- **Account Abstraction**: Built-in smart wallet support
- **Multi-Chain Support**: Ethereum, Polygon, Arbitrum, and more

#### 🔧 Configuration
- **API Integration**: Connection to CryptoMomo backend services
- **Error Handling**: Basic error classes and handling
- **Documentation**: Initial README and basic examples

#### 🎯 Features
- Phone number-based authentication
- OTP verification system
- Gasless transaction execution
- Multi-chain blockchain support
- TypeScript type safety
- React hooks architecture

---

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## Support

- 📧 Email: support@cryptomomo.africa
- 💬 Discord: [Join our community](https://discord.gg/cryptomomo)
- 🐛 GitHub Issues: [Report bugs](https://github.com/narteysarso/cryptomomo-developer-sdk/issues) 