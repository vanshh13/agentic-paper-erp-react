/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom color palette for ERP System
        primary: '#00d9ff',      // Cyan/primary brand color
        secondary: '#00b8d4',    // Secondary brand color
        dark: '#213547',         // Dark text color (for text-dark)
      },
    },
  },
  plugins: [],
}

