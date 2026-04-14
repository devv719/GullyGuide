/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,jsx,mdx}",
    "./components/**/*.{js,jsx,mdx}",
    "./app/**/*.{js,jsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        border: "var(--border)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        neon: {
          pink: '#ff2a85',
          purple: '#8b5cf6',
          teal: '#00f2fe',
          yellow: '#ffdc00',
          orange: '#ff5a00'
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)'], // Assuming Inter, but user wants blocky
        display: ['var(--font-inter)'], 
      },
    },
  },
  plugins: [],
};
