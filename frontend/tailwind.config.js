/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    fontFamily:{
      'sans':['Satoshi Variable', 'ui-sans-serif']
    },
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        green:{
          50: '#DEFFE6',
          100: '#B1F8C5',
          200: '#79F0A0',
          300: '#4FE187',
          400: '#24CC70',
          500: '#11B761',
          600: '#088D49',
          700: '#176537',
          800: '#044421',
          900: '#033217',
          950: '#01200C'
        },
        red:{
          50: '#FFEEF1',
          100: '#FDDDDF',
          200: '#FDBDB9',
          300: '#FE9390',
          400: '#FD5D62',
          500: '#F13747',
          600: '#CA2A39',
          700: '#971023',
          800: '#6F0516',
          900: '#51010C',
          950: '#300206',
        },
        neutral:{
          50: '#EFF6FB',
          100: '#E2EBF3',
          200: '#D1DAE2',
          300: '#BCC5CD',
          400:  '#96A2AC',
          500: '#74808C',
          600: '#55626D',
          700: '#3B4853',
          800: '#242F3A',
          900: '#0E1A23',
          950: '#080E12'
        },
        outline:"oklch(var(--outline))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        title: "var(--text-title)",
        body: "var(--text-body)"
      },
      boxShadow: {
        'button':['inset 0px 0px 0px 2px rgba(255,255,255,0.45)', 'inset 0px 1px 0px 1px rgba(255,255,255,0.75)', '0px 4px 4px 2px rgba(0,0,0,0.25)','0px 2px 2px 1px rgba(0,0,0,0.25)']
      },
      borderRadius: {
        sm: "calc(var(--radius) - 8px)",
        default: "var(--radius)",
        md: "calc(var(--radius) + 8px)",
        lg: "calc(var(--radius) + 20px)",
        xl: "calc(var(--radius) + 52px)"
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      backgroundImage: {
        "splash-cover": "url('./assets/dindin-splash-cover.png')",
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}