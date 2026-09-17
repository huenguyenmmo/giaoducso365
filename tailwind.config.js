/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        kidsa: {
          bg: "#FDFBF7",
          cream: "#FFFDF9",
          orange: "#FF8A48",
          "orange-dark": "#E66F2C",
          "orange-light": "#FFF3EC",
          teal: "#4BB6A9",
          "teal-dark": "#369387",
          "teal-light": "#EAF7F5",
          purple: "#8B62FF",
          "purple-dark": "#6C42E0",
          "purple-light": "#F3EFFF",
          yellow: "#FFC043",
          "yellow-light": "#FFF8E7",
          pink: "#FF7B9C",
          card: "#FFFFFF",
          border: "#F3E9D9",
          text: "#2D3748",
          subtext: "#718096"
        },
      },
      fontFamily: {
        sans: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'kidsa': '0 10px 30px -5px rgba(255, 138, 72, 0.12), 0 4px 12px rgba(0, 0, 0, 0.03)',
        'kidsa-hover': '0 20px 40px -10px rgba(139, 98, 255, 0.2), 0 8px 16px rgba(0, 0, 0, 0.05)',
        'kidsa-teal': '0 10px 30px -5px rgba(75, 182, 169, 0.25)',
      }
    },
  },
  plugins: [],
}
