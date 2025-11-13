// Font optimization configuration
// This ensures fonts are loaded efficiently with proper fallbacks

export const fontConfig = {
  // Preload critical fonts
  preload: true,
  // Use font-display: swap for better performance
  display: 'swap',
  // Subset to reduce file size
  subsets: ['latin'],
  // Fallback fonts for better CLS
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
};
