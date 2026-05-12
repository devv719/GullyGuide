/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx,mdx}",
    "./components/**/*.{js,jsx,mdx}",
    "./app/**/*.{js,jsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Hand-drawn palette
        background: "#fdfbf7",
        foreground: "#2d2d2d",
        paper: "#ffffff",
        muted: {
          DEFAULT: "#e5e0d8",
          foreground: "#6b6560",
        },
        accent: {
          DEFAULT: "#ff4d4d",
          foreground: "#ffffff",
        },
        primary: {
          DEFAULT: "#2d2d2d",
          foreground: "#fdfbf7",
        },
        secondary: {
          DEFAULT: "#2d5da1",
          foreground: "#ffffff",
        },
        destructive: {
          DEFAULT: "#ff4d4d",
          foreground: "#ffffff",
        },
        border: "#2d2d2d",
        input: "#2d2d2d",
        ring: "#2d5da1",
        postit: "#fff9c4",
        card: {
          DEFAULT: "#ffffff",
          foreground: "#2d2d2d",
        },
        popover: {
          DEFAULT: "#ffffff",
          foreground: "#2d2d2d",
        },
        sidebar: {
          DEFAULT: "#fdfbf7",
          foreground: "#2d2d2d",
          primary: "#ff4d4d",
          "primary-foreground": "#ffffff",
          accent: "#e5e0d8",
          "accent-foreground": "#2d2d2d",
          border: "#2d2d2d",
          ring: "#2d5da1",
        },
      },
      borderRadius: {
        // Wobbly hand-drawn radii
        wobbly: "255px 15px 225px 15px / 15px 225px 15px 255px",
        wobblyMd: "15px 225px 15px 255px / 255px 15px 225px 15px",
        wobblyLg: "225px 15px 255px 15px / 15px 255px 15px 225px",
        wobblyBtn: "255px 25px 225px 25px / 25px 225px 25px 255px",
        wobblyPill: "185px 25px 165px 25px / 25px 195px 25px 185px",
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.25rem",
      },
      boxShadow: {
        sketch: "4px 4px 0px 0px #2d2d2d",
        "sketch-lg": "8px 8px 0px 0px #2d2d2d",
        "sketch-hover": "2px 2px 0px 0px #2d2d2d",
        "sketch-sm": "3px 3px 0px 0px rgba(45, 45, 45, 0.1)",
        "sketch-accent": "4px 4px 0px 0px #ff4d4d",
        none: "none",
      },
      fontFamily: {
        heading: ["var(--font-kalam)", "cursive"],
        body: ["var(--font-patrick)", "cursive"],
        sans: ["var(--font-patrick)", "cursive"],
      },
      keyframes: {
        "bounce-gentle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        jiggle: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-1deg)" },
          "75%": { transform: "rotate(1deg)" },
        },
        "pencil-draw": {
          "0%": { "stroke-dashoffset": "100" },
          "100%": { "stroke-dashoffset": "0" },
        },
      },
      animation: {
        "bounce-gentle": "bounce-gentle 3s ease-in-out infinite",
        jiggle: "jiggle 0.3s ease-in-out",
        "pencil-draw": "pencil-draw 1s ease-out forwards",
      },
    },
  },
  plugins: [],
};
