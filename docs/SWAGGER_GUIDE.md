# CryptoMomo SDK Swagger Documentation

This directory contains comprehensive API documentation for the CryptoMomo Developer SDK in OpenAPI 3.0 format.

## 📋 Overview

The Swagger documentation provides a complete reference for all SDK components, hooks, providers, and types. While the SDK is a React library (not a REST API), we've structured the documentation using OpenAPI format to provide a standardized, interactive way to explore the SDK's capabilities.

## 📁 Files

- `../swagger.yaml` - Complete OpenAPI 3.0 specification
- `SWAGGER_GUIDE.md` - This guide

## 🚀 Viewing the Documentation

### Option 1: Swagger UI (Recommended)

You can view the interactive documentation using Swagger UI:

1. **Online Swagger Editor**: 
   - Go to [editor.swagger.io](https://editor.swagger.io)
   - Copy the contents of `swagger.yaml` and paste it into the editor
   - View the interactive documentation

2. **Local Swagger UI**:
   ```bash
   # Install swagger-ui-serve globally
   npm install -g swagger-ui-serve
   
   # Serve the documentation
   swagger-ui-serve swagger.yaml
   ```

3. **VS Code Extension**:
   - Install the "Swagger Viewer" extension
   - Open `swagger.yaml` in VS Code
   - Use the command palette: "Swagger: Preview"

### Option 2: Redoc

For a different viewing experience:

1. **Online Redoc**:
   - Go to [redocly.github.io/redoc](https://redocly.github.io/redoc)
   - Upload the `swagger.yaml` file

2. **Local Redoc**:
   ```bash
   npx redoc-cli serve swagger.yaml
   ```

## 📖 Documentation Structure

The documentation is organized into the following sections:

### 🧩 Components
- **ConnectButton**: Primary wallet connection component
- **TransactionButton**: Gasless transaction execution component
- **UI Components**: Button, Input, Label, Dialog components

### 🎣 Hooks
- **useConnect**: Connection state management
- **useTransaction**: Transaction execution and state
- **Store Hooks**: Global state management

### 🎨 Providers
- **CryptoMomoProvider**: Main SDK context provider
- **ThemeProvider**: Theme customization provider

### 📝 Types & Schemas
- **Props Interfaces**: Component and hook prop definitions
- **Response Types**: API response structures
- **Theme Types**: Theming system types
- **Error Types**: Error handling structures

## 🎯 Key Features Documented

### 1. Component Props
Every component includes:
- Complete prop interface
- Default values
- Usage examples
- TypeScript types

### 2. Hook Returns
All hooks document:
- Return value structure
- Function signatures
- State properties
- Error handling

### 3. Theme System
Comprehensive theming documentation:
- Color system
- Typography
- Spacing
- Component variants

### 4. Usage Examples
Real-world examples for:
- Basic implementation
- Custom theming
- Error handling
- Advanced configurations

## 🔧 Integration Examples

### Basic Setup
```tsx
import { CryptoMomoProvider, ConnectButton } from 'cryptomomo-developer-sdk';

function App() {
  return (
    <CryptoMomoProvider apiKey="your-api-key">
      <ConnectButton />
    </CryptoMomoProvider>
  );
}
```

### Custom Theming
```tsx
const customTheme = {
  colors: {
    primary: '#007bff',
    background: '#ffffff'
  },
  borderRadius: '12px'
};

<CryptoMomoProvider theme={customTheme}>
  <ConnectButton variant="outline" size="lg" />
</CryptoMomoProvider>
```

### Transaction Handling
```tsx
<TransactionButton
  to="0x742d35Cc6634C0532925a3b8D16A2f5C3e2f1234"
  amount="0.1"
  gasless={true}
  onSuccess={(tx) => console.log('Success:', tx.hash)}
  onError={(error) => console.error('Error:', error)}
>
  Send 0.1 ETH
</TransactionButton>
```

## 🛠️ Development Usage

### For SDK Contributors

When adding new components or hooks:

1. Update the `swagger.yaml` file with new schemas
2. Add usage examples
3. Document all props and return types
4. Include error scenarios

### For SDK Users

Use the documentation to:
- Understand component APIs
- Explore theming options
- Find usage examples
- Troubleshoot integration issues

## 📚 Additional Resources

- [Main SDK Documentation](./API_REFERENCE.md)
- [Theming Guide](./THEMING_GUIDE.md)
- [Troubleshooting](./TROUBLESHOOTING.md)
- [GitHub Repository](https://github.com/narteysarso/cryptomomo-developer-sdk)

## 🤝 Contributing

To improve the documentation:

1. Fork the repository
2. Update `swagger.yaml` with your changes
3. Test the documentation in Swagger UI
4. Submit a pull request

## 📞 Support

If you have questions about the documentation:

- 📧 Email: support@cryptomomo.africa
- 🌐 Website: https://cryptomomo.africa
- 📱 GitHub Issues: [Report an issue](https://github.com/narteysarso/cryptomomo-developer-sdk/issues)

---

**Note**: This Swagger documentation represents the SDK's component and hook interfaces rather than REST API endpoints. It's designed to provide a standardized way to explore and understand the SDK's capabilities. 