/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand-dark': '#1A0B2E',
        'brand-lilac': '#F3E8FF',
        'brand-gold-start': '#FACC15',
        'brand-gold-end': '#CA8A04',
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'serif'],
        body: ['Inter', 'sans-serif'],
        script: ['"Dancing Script"', 'cursive'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(90deg, #FACC15 0%, #CA8A04 100%)',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
      animation: {
        scan: 'scan 2s linear infinite',
      },
    },
  },
  plugins: [],
};



