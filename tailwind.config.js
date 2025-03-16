/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00ff00', // Bright green
        'primary-dark': '#00cc00',
        'primary-light': '#66ff66',
        secondary: '#0a0a0a', // Near black
        'secondary-dark': '#000000',
        'secondary-light': '#1a1a1a',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

