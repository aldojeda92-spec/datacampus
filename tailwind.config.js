/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // DATABRAND / DATACAMPUS Official Brand Tokens (Brandbook V4.1)
        brand: {
          navy: '#0A1F33',        // brand.data.navy - Raíz DATA, titulares oscuros
          'navy-dark': '#061320', // Fondo corporativo profundo
          campus: '#008F7A',      // brand.campus.accent - CAMPUS logotipo y acentos
          'campus-text': '#087360',// ui.campus.text.accent - Texto accesible WCAG AA sobre blanco
          surface: '#FFFFFF',     // ui.surface.default
          'surface-subtle': '#F2F6FB', // ui.surface.subtle - Secciones secundarias y tarjetas
          border: '#D6E2EF',      // ui.border.default - Separadores y bordes discretos
          'text-primary': '#0A1F33',   // ui.text-primary
          'text-secondary': '#3A3A3C', // ui.text-secondary
        },
        campus: {
          50: '#F0F9F8',
          100: '#E6F5F2',
          200: '#C0E8E0',
          300: '#96D9CC',
          400: '#3DAE9A',
          500: '#008F7A', // Oficial Brandbook V4.1 CAMPUS Accent
          600: '#087360', // Oficial Brandbook V4.1 UI Text Accent (WCAG AA 5.78:1)
          700: '#075C4D',
          800: '#06473C',
          900: '#0A1F33', // Oficial Brandbook V4.1 DATA Navy
          950: '#061320',
        },
        navy: {
          50: '#F2F6FB',
          100: '#E4EDF7',
          200: '#D6E2EF',
          300: '#A9C2DC',
          400: '#648FB9',
          500: '#2C5E8E',
          600: '#1B436B',
          700: '#12304F',
          800: '#0E263F',
          900: '#0A1F33', // Oficial Brandbook V4.1 DATA Navy
          950: '#061320',
        },
        accent: {
          50: '#F0F9F8',
          100: '#E6F5F2',
          200: '#C0E8E0',
          300: '#96D9CC',
          400: '#3DAE9A',
          500: '#008F7A',
          600: '#087360',
          700: '#075C4D',
          800: '#06473C',
          900: '#0A1F33',
        }
      },
      fontFamily: {
        display: ['Montserrat', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'control': '8px',
        'card': '12px',
      },
      boxShadow: {
        'soft': '0 4px 16px -2px rgba(10, 31, 51, 0.04), 0 2px 6px -1px rgba(10, 31, 51, 0.02)',
        'card': '0 4px 20px -2px rgba(10, 31, 51, 0.06), 0 2px 6px -1px rgba(10, 31, 51, 0.03)',
        'floating': '0 20px 40px -15px rgba(10, 31, 51, 0.15)',
      }
    },
  },
  plugins: [],
}
