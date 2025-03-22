/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'footer-bg': 'var(--footer-background-color)',
        'footer-text': 'var(--footer-text-color)',
      },
      extend: {
        flex: {
          '2': '2 2 0%',
        },
      },
    },
  },
  plugins: [],
}
