import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "SF Mono", "ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
      },
      colors: {
        // Clean, minimal palette with dark mode support
        canvas: "rgb(var(--color-canvas) / <alpha-value>)",
        panel: "rgb(var(--color-panel) / <alpha-value>)",
        border: "rgb(var(--color-border) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        success: "#22c55e",
        warning: "#f59e0b",
        danger: "#ef4444",
      },
      animation: {
        'pulse-dot': 'pulse-dot 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'pulse-dot': {
          '0%, 100%': { 
            opacity: '1',
          },
          '50%': { 
            opacity: '0.5',
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
