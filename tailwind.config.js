/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
        display: ["Poppins", "sans-serif"],
        mono: ["DM Mono", "monospace"],
      },
      colors: {
        saffron: {
          50: "#fff8f0",
          100: "#fff3e0",
          200: "#ffe0b2",
          400: "#ffb347",
          500: "#FF9933",
          600: "#E65C00",
          700: "#bf4500",
        },
        igreen: {
          50: "#e8f5e9",
          100: "#c8e6c9",
          500: "#138808",
          600: "#0d6606",
          700: "#0a4f04",
        },
        navy: {
          50: "#f0f4ff",
          100: "#e0e9ff",
          200: "#c0d0f0",
          300: "#8b9cc8",
          400: "#4a5580",
          500: "#2a3560",
          600: "#1a1f36",
          700: "#111428",
          800: "#080f1e",
          900: "#050810",
        },
      },
      boxShadow: {
        sm: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)",
        md: "0 4px 16px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)",
        lg: "0 8px 32px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.06)",
        saffron: "0 4px 20px rgba(255,153,51,0.3)",
        green: "0 4px 20px rgba(19,136,8,0.2)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "slide-up": "slideUp 0.4s ease-out",
        "fade-in": "fadeIn 0.3s ease-out",
        "fade-up": "fadeUp 0.5s ease-out",
      },
      keyframes: {
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(16px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
