      module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        lg: '2rem',
      },
    },
    extend: {
      colors: {
        primary: '#2E7D32', // Primary Green
        secondary: '#1565C0', // Secondary Blue
        accent: '#FF9800', // Accent Orange
        success: '#4CAF50',
        warning: '#FFC107',
        danger: '#F44336',
        surface: '#FFFFFF',
        bg: '#F5F7FA',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      borderRadius: {
        xl: '1rem',
      },
      boxShadow: {
        card: '0 6px 18px rgba(15, 23, 42, 0.06)',
      },
    },
  },
  plugins: [],
};
