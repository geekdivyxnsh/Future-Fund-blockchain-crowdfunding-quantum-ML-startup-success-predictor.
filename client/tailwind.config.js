/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        epilogue: ['Epilogue', 'sans-serif'],
        inter: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        secondary: '10px 10px 20px rgba(2, 2, 2, 0.25)',
        card: '0 1px 2px rgba(16, 24, 40, 0.05)',
        dropdown: '0 4px 12px rgba(16, 24, 40, 0.08)'
      },
      colors: {
        brand: {
          green: '#0b6b3a',      // evergreen primary
          blue: '#b08a00',       // wealth gold accent (used for alt CTA)
          teal: '#27ae60'        // growth green
        }
      }
    },
  },
  plugins: [],
}
