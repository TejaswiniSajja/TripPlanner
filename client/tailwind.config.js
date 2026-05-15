/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: {
          50: "#f5f5f6",
          100: "#e6e6e7",
          200: "#cfd0d2",
          300: "#adaeb2",
          400: "#84858b",
          500: "#696a70",
          600: "#5a5a60",
          700: "#4c4d51",
          800: "#434347",
          900: "#1a1a2e",
          950: "#0f0f1a",
        },
        accent: {
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
        },
        glow: {
          cyan: "#06b6d4",
          purple: "#a855f7",
          pink: "#ec4899",
        },
      },
      fontFamily: {
        sans: ['"Inter"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
