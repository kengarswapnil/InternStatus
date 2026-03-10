/** @type {import('tailwindcss').Config} */
module.exports = {
  // 1. Tell Tailwind where your JSX/HTML files are
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // 2. Link Nunito as your primary font
      fontFamily: {
        nunito: ["Nunito", "sans-serif"],
      },
      // 3. Define your core high-fidelity colors
      colors: {
        "space-dark": "#0B0F19", // Your main background
        "glass-white": "rgba(255, 255, 255, 0.05)",
        "violet-glow": "#7C3AED",
        "fuchsia-glow": "#D946EF",
      },
      // 4. Custom animations for your status LEDs
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};
