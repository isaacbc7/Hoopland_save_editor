/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'pixel': ['"Press Start 2P"', 'monospace'],
        'pixel-alt': ['VT323', 'monospace'],
      },
      colors: {
        // Hoopland color scheme
        hoopland: {
          dark: '#1a1a3e',      // Dark blue background
          frame: '#4a90e2',     // Light blue frame
          border: '#2c5282',    // Darker blue border
          text: '#ffffff',      // White text
          finishing: '#3b82f6', // Blue for Finishing
          shooting: '#10b981',  // Green for Shooting
          creating: '#f59e0b',  // Yellow/Orange for Creating
          defense: '#ef4444',   // Red for Defense
          physicals: '#a855f7', // Purple for Physicals
        },
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      },
    },
  },
  plugins: [],
}
