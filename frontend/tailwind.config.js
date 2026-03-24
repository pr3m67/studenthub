/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        app: "#F8F7F4",
        surface: "#FFFFFF",
        primary: "#1A1A2E",
        accent: "#2D3A3A",
        sage: "#7C9A92",
        sand: "#E8DCC8",
        success: "#4CAF82",
        warning: "#E8A838",
        danger: "#E05C5C",
      },
      fontFamily: {
        heading: ["DM Sans", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        card: "0 16px 40px rgba(0,0,0,0.06)",
      },
      backgroundImage: {
        hero: "linear-gradient(135deg, rgba(232,220,200,0.9), rgba(124,154,146,0.18), rgba(255,255,255,0.9))",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(76, 175, 130, 0.35)" },
          "50%": { boxShadow: "0 0 0 12px rgba(76, 175, 130, 0)" },
        },
      },
      animation: {
        pulseGlow: "pulseGlow 1.8s infinite",
      },
    },
  },
  plugins: [],
};
