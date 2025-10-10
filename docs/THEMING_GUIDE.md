# CryptoMomo SDK Theming Guide

Complete guide to customizing the appearance of CryptoMomo SDK components.

## Overview

The CryptoMomo SDK uses a powerful theming system built on shadcn/ui components with CSS custom properties and HSL color format for maximum flexibility.

## Theme Structure

```typescript
interface CryptoMomoTheme {
  colors?: {
    primary?: string;           // Main brand color
    secondary?: string;         // Secondary actions
    accent?: string;           // Highlights and accents
    background?: string;       // Page background
    foreground?: string;       // Main text color
    muted?: string;           // Muted backgrounds
    border?: string;          // Border colors
    ring?: string;            // Focus ring colors
    destructive?: string;     // Error/danger colors
  };
  borderRadius?: string;      // Global border radius
  fontFamily?: string;        // Typography
}
```

## Color System

### HSL Format

All colors use HSL format for better manipulation:

```tsx
const theme = {
  colors: {
    primary: 'hsl(262 83% 58%)',      // Purple
    secondary: 'hsl(220 14% 96%)',    // Light gray
    accent: 'hsl(210 40% 96%)',       // Blue-gray
    background: 'hsl(0 0% 100%)',     // White
    foreground: 'hsl(222.2 84% 4.9%)', // Dark text
  }
};
```

### Color Palette Examples

#### Brand Colors
```tsx
// Tech Company (Blue)
const techTheme = {
  colors: {
    primary: 'hsl(221 83% 53%)',
    secondary: 'hsl(210 40% 96%)',
    accent: 'hsl(217 91% 60%)',
  }
};

// Fintech (Green)
const fintechTheme = {
  colors: {
    primary: 'hsl(142 76% 36%)',
    secondary: 'hsl(138 76% 97%)',
    accent: 'hsl(142 86% 28%)',
  }
};

// Gaming (Purple)
const gamingTheme = {
  colors: {
    primary: 'hsl(262 83% 58%)',
    secondary: 'hsl(270 95% 98%)',
    accent: 'hsl(262 90% 50%)',
  }
};
```

## Theme Application

### Global Theme Provider

Apply themes globally using `ThemeProvider`:

```tsx
import { ThemeProvider } from 'cryptomomo-developer-sdk';

const globalTheme = {
  colors: {
    primary: 'hsl(262 83% 58%)',
    background: 'hsl(0 0% 100%)',
    foreground: 'hsl(222.2 84% 4.9%)',
  },
  borderRadius: '0.75rem',
  fontFamily: 'Inter, system-ui, sans-serif',
};

function App() {
  return (
    <ThemeProvider theme={globalTheme}>
      <YourApp />
    </ThemeProvider>
  );
}
```

### Component-Level Theming

Override global theme for specific components:

```tsx
const buttonTheme = {
  colors: {
    primary: 'hsl(0 84% 60%)', // Red for danger actions
  }
};

<ConnectButton theme={buttonTheme} />
```

### Dynamic Theme Switching

```tsx
function ThemeSwitcher() {
  const { setTheme } = useTheme();
  
  const themes = {
    light: {
      colors: {
        background: 'hsl(0 0% 100%)',
        foreground: 'hsl(222.2 84% 4.9%)',
      }
    },
    dark: {
      colors: {
        background: 'hsl(222.2 84% 4.9%)',
        foreground: 'hsl(210 40% 98%)',
      }
    }
  };

  return (
    <div>
      <button onClick={() => setTheme(themes.light)}>
        Light Mode
      </button>
      <button onClick={() => setTheme(themes.dark)}>
        Dark Mode
      </button>
    </div>
  );
}
```

## Dark Mode

### Complete Dark Theme

```tsx
const darkTheme = {
  colors: {
    background: 'hsl(222.2 84% 4.9%)',
    foreground: 'hsl(210 40% 98%)',
    primary: 'hsl(217.2 91.2% 59.8%)',
    secondary: 'hsl(217.2 32.6% 17.5%)',
    muted: 'hsl(217.2 32.6% 17.5%)',
    border: 'hsl(217.2 32.6% 17.5%)',
    ring: 'hsl(224.3 76.3% 94.1%)',
    destructive: 'hsl(0 62.8% 30.6%)',
  },
  borderRadius: '0.5rem',
};
```

### System Theme Detection

```tsx
function SystemThemeProvider({ children }) {
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(isDark ? darkTheme : lightTheme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      setTheme(e.matches ? darkTheme : lightTheme);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  );
}
```

## Advanced Theming

### CSS Custom Properties

The SDK automatically applies theme colors as CSS custom properties:

```css
:root {
  --primary: 262 83% 58%;
  --secondary: 220 14% 96%;
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --radius: 0.5rem;
}
```

### Custom CSS Classes

Create custom styles using theme variables:

```css
.my-custom-button {
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  border-radius: var(--radius);
}

.my-custom-card {
  background-color: hsl(var(--background));
  border: 1px solid hsl(var(--border));
  border-radius: var(--radius);
}
```

### Tailwind Integration

Add theme colors to your Tailwind config:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        // ... other colors
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
}
```

## Component Variants

### Button Variants with Themes

```tsx
// Different button styles with same theme
const theme = {
  colors: {
    primary: 'hsl(262 83% 58%)',
    secondary: 'hsl(220 14% 96%)',
  }
};

<div className="space-x-2">
  <ConnectButton theme={theme} variant="default" />
  <ConnectButton theme={theme} variant="outline" />
  <ConnectButton theme={theme} variant="secondary" />
  <ConnectButton theme={theme} variant="ghost" />
</div>
```

### Size Variants

```tsx
<div className="space-y-2">
  <ConnectButton size="sm" />
  <ConnectButton size="default" />
  <ConnectButton size="lg" />
</div>
```

## Best Practices

### 1. Consistent Color Palette

Use a consistent color system across your application:

```tsx
const brandColors = {
  primary: 'hsl(262 83% 58%)',
  primaryLight: 'hsl(262 83% 68%)',
  primaryDark: 'hsl(262 83% 48%)',
  secondary: 'hsl(220 14% 96%)',
  accent: 'hsl(210 40% 96%)',
};

const theme = {
  colors: {
    primary: brandColors.primary,
    secondary: brandColors.secondary,
    accent: brandColors.accent,
  }
};
```

### 2. Accessibility

Ensure sufficient contrast ratios:

```tsx
// Good contrast example
const accessibleTheme = {
  colors: {
    primary: 'hsl(262 83% 45%)',        // Dark enough for white text
    background: 'hsl(0 0% 100%)',       // White background
    foreground: 'hsl(222.2 84% 4.9%)',  // Dark text
  }
};
```

### 3. Theme Validation

Validate theme colors before applying:

```tsx
function validateTheme(theme: CryptoMomoTheme): boolean {
  if (!theme.colors) return true;
  
  const hslRegex = /^hsl\(\d+(\.\d+)?\s+\d+(\.\d+)?%\s+\d+(\.\d+)?%\)$/;
  
  for (const [key, value] of Object.entries(theme.colors)) {
    if (value && !hslRegex.test(value)) {
      console.warn(`Invalid HSL color for ${key}: ${value}`);
      return false;
    }
  }
  
  return true;
}
```

### 4. Performance

Memoize theme objects to prevent unnecessary re-renders:

```tsx
const theme = useMemo(() => ({
  colors: {
    primary: 'hsl(262 83% 58%)',
    secondary: 'hsl(220 14% 96%)',
  }
}), []);

<ConnectButton theme={theme} />
```

## Examples

### E-commerce Theme

```tsx
const ecommerceTheme = {
  colors: {
    primary: 'hsl(25 95% 53%)',      // Orange
    secondary: 'hsl(210 40% 96%)',   // Light gray
    accent: 'hsl(142 76% 36%)',      // Green for success
    destructive: 'hsl(0 84% 60%)',   // Red for errors
  },
  borderRadius: '0.375rem',
  fontFamily: 'Roboto, sans-serif',
};
```

### SaaS Theme

```tsx
const saasTheme = {
  colors: {
    primary: 'hsl(221 83% 53%)',     // Professional blue
    secondary: 'hsl(210 40% 96%)',   // Subtle gray
    accent: 'hsl(262 83% 58%)',      // Purple accent
    background: 'hsl(0 0% 100%)',    // Clean white
    foreground: 'hsl(222.2 84% 4.9%)', // Dark text
  },
  borderRadius: '0.5rem',
  fontFamily: 'Inter, system-ui, sans-serif',
};
```

### Gaming Theme

```tsx
const gamingTheme = {
  colors: {
    primary: 'hsl(262 83% 58%)',     // Electric purple
    secondary: 'hsl(270 95% 98%)',   // Very light purple
    accent: 'hsl(45 93% 58%)',       // Electric yellow
    background: 'hsl(222.2 84% 4.9%)', // Dark background
    foreground: 'hsl(210 40% 98%)',  // Light text
  },
  borderRadius: '1rem',
  fontFamily: 'Orbitron, monospace',
};
``` 