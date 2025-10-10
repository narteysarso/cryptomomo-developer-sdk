# Component Isolation Guide

The CryptoMomo Developer SDK includes a powerful component isolation system that ensures your components work consistently regardless of the parent application's styling. This guide explains how the isolation works and how to use it effectively.

## Problem Statement

When integrating UI components into different applications, common issues include:

- **Size inconsistencies**: Components appearing too large or small based on parent CSS
- **Style inheritance**: Parent styles affecting component appearance
- **Layout conflicts**: Parent flexbox/grid affecting component structure
- **Font and color inheritance**: Components inheriting unwanted styles
- **Responsive behavior**: Components not responding correctly to screen size changes

## Solution: CryptoMomoWrapper

The `CryptoMomoWrapper` component provides CSS isolation and consistent styling for all CryptoMomo components.

### Key Features

1. **CSS Reset and Isolation**: Uses `all: initial` to reset inherited styles
2. **Consistent Sizing**: Ensures components have predictable dimensions
3. **Responsive Design**: Built-in responsive behavior that works everywhere
4. **Theme Support**: Proper theme variable application
5. **Touch-Friendly**: Optimized for mobile devices

## How It Works

### CSS Isolation

```css
.crypto-momo-wrapper {
  /* CSS Reset for isolation */
  all: initial;
  
  /* Restore essential properties */
  display: block;
  box-sizing: border-box;
  font-family: ui-sans-serif, system-ui, /* ... */;
  font-size: 14px;
  line-height: 1.5;
  
  /* Responsive container */
  width: 100%;
  max-width: 400px;
  min-width: 280px;
}
```

### Responsive Breakpoints

- **Desktop**: `max-width: 400px, min-width: 280px`
- **Mobile (≤640px)**: `min-width: 260px, min-height: 44px` (better touch targets)
- **Small Mobile (≤320px)**: `min-width: 240px, font-size: 13px`

## Usage Examples

### Automatic Wrapping

All CryptoMomo components are automatically wrapped:

```tsx
import { ConnectButton, TransactionButton } from 'cryptomomo-developer-sdk';

// These are automatically isolated
<ConnectButton />
<TransactionButton transaction={tx} />
```

### Manual Wrapping

For custom components or additional isolation:

```tsx
import { CryptoMomoWrapper } from 'cryptomomo-developer-sdk';

<CryptoMomoWrapper variant="connect" theme={myTheme}>
  <div>Your custom content</div>
</CryptoMomoWrapper>
```

### Wrapper Variants

- `connect`: For connection-related components
- `transaction`: For transaction components  
- `modal`: For modal content (lighter isolation)

## Testing Isolation

Use the `IsolationDemo` component to test how components behave under different parent conditions:

```tsx
import { IsolationDemo } from 'cryptomomo-developer-sdk';

<IsolationDemo theme={myTheme} />
```

This component shows how CryptoMomo components maintain consistency under:
- Normal parent styling
- Aggressive parent styling (extreme colors, fonts, sizes)
- Flexbox layouts
- CSS Grid layouts
- Small containers
- Very small containers (mobile)

## Best Practices

### 1. Trust the Wrapper

Don't try to override the wrapper's sizing or positioning:

```tsx
// ❌ Don't do this
<ConnectButton className="w-full h-20 text-2xl" />

// ✅ Do this instead
<ConnectButton theme={{ fontFamily: 'Arial', colors: { primary: '...' } }} />
```

### 2. Use Themes for Customization

Instead of CSS overrides, use the theme system:

```tsx
const customTheme = {
  colors: {
    primary: '262 83% 58%',
    secondary: '220 14% 96%'
  },
  borderRadius: '8px',
  fontFamily: 'Inter, sans-serif'
};

<ConnectButton theme={customTheme} />
```

### 3. Container Sizing

Let the wrapper handle responsive behavior:

```tsx
// ❌ Don't constrain with fixed sizes
<div style={{ width: '200px' }}>
  <ConnectButton />
</div>

// ✅ Use flexible containers
<div className="max-w-sm mx-auto">
  <ConnectButton />
</div>
```

### 4. Modal Integration

For modals, the wrapper automatically adjusts:

```tsx
// Modal content is automatically handled
<ConnectButton modal={true} />
```

## Advanced Scenarios

### Nested Wrappers

When nesting components, inner wrappers automatically inherit from outer ones:

```tsx
<CryptoMomoWrapper theme={globalTheme}>
  <ConnectButton theme={specificTheme} /> {/* Combines both themes */}
</CryptoMomoWrapper>
```

### Custom Breakpoints

For specific responsive needs, you can extend the CSS:

```css
@media (max-width: 480px) {
  .crypto-momo-wrapper {
    min-width: 220px;
  }
}
```

### Integration with UI Libraries

The wrapper works well with popular UI libraries:

```tsx
// With Material-UI
<Paper>
  <ConnectButton />
</Paper>

// With Chakra UI
<Box>
  <ConnectButton />
</Box>

// With Ant Design
<Card>
  <ConnectButton />
</Card>
```

## Troubleshooting

### Component Too Small/Large

The wrapper maintains consistent sizing. If components appear wrong:

1. Check if parent has `transform: scale()` - this affects the wrapper
2. Ensure parent doesn't have `font-size: 0` or similar
3. Use browser dev tools to inspect the `.crypto-momo-wrapper` element

### Styling Not Applied

If custom styling isn't working:

1. Use themes instead of CSS classes
2. Check CSS specificity - wrapper styles are intentionally strong
3. Use `!important` sparingly and only for critical overrides

### Responsive Issues

If responsive behavior isn't working:

1. Ensure viewport meta tag is set: `<meta name="viewport" content="width=device-width, initial-scale=1">`
2. Check if parent container has `overflow: hidden` that might clip content
3. Test on actual devices, not just browser resize

## Performance Considerations

The wrapper system is lightweight but adds a small overhead:

- **Bundle size**: ~2KB additional CSS
- **Runtime**: Minimal React wrapper component
- **Rendering**: Single additional DOM node per component

For high-performance scenarios, you can disable wrapping (not recommended):

```tsx
// Not recommended - only for extreme performance needs
import { ConnectButton } from 'cryptomomo-developer-sdk/unwrapped';
```

## Browser Support

The isolation system works on:

- **Modern browsers**: Full support (Chrome 88+, Firefox 87+, Safari 14+)
- **Older browsers**: Graceful degradation (IE 11 has limited isolation)
- **Mobile browsers**: Full support with enhanced touch targets

## Summary

The CryptoMomoWrapper system ensures that your components:

1. ✅ Look consistent across different applications
2. ✅ Respond properly to screen size changes  
3. ✅ Work with any parent styling
4. ✅ Maintain accessibility standards
5. ✅ Provide optimal touch targets on mobile

By using this isolation system, you can confidently integrate CryptoMomo components into any application without worrying about styling conflicts or responsive issues. 