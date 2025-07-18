import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Faborino brand colors
        'warm-oak': '#D4A574',
        'forest-green': '#4A6741',
        'cream-white': '#F7F5F3',
        'soft-clay': '#C8A882',
        'sage-green': '#A8B5A0',
        'charcoal': '#3A3A3A',
        'sunset-orange': '#E17B47',
        'sky-blue': '#7BA8C4',
        
        // Semantic colors
        primary: '#D4A574',
        secondary: '#4A6741',
        accent: '#E17B47',
        neutral: '#3A3A3A',
        background: '#F7F5F3',
        surface: '#FFFFFF',
        muted: '#A8B5A0',
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'source-serif': ['Source Serif Pro', 'serif'],
      },
      fontSize: {
        'display': ['4rem', { lineHeight: '1.1', letterSpacing: '-0.025em' }],
        'hero': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'h1': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'h2': ['2rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        'h3': ['1.5rem', { lineHeight: '1.4' }],
        'h4': ['1.25rem', { lineHeight: '1.4' }],
        'body': ['1rem', { lineHeight: '1.6' }],
        'small': ['0.875rem', { lineHeight: '1.5' }],
      },
      borderRadius: {
        'smart': '24px',
        'card': '8px',
        'button': '4px',
      },
      boxShadow: {
        'smart': '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'button': '0 2px 4px -1px rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.06)',
        'inner-smart': 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'gradient': 'gradient 8s ease infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s ease-in-out infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': { 
            'background-position': '0% 50%' 
          },
          '50%': { 
            'background-position': '100% 50%' 
          },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'geometric-pattern': `
          radial-gradient(circle at 25% 25%, #D4A574 0%, transparent 50%),
          radial-gradient(circle at 75% 75%, #4A6741 0%, transparent 50%),
          conic-gradient(from 0deg, #C8A882, #A8B5A0, #7BA8C4, #C8A882)
        `,
      },
      backgroundSize: {
        'pattern': '60px 60px, 60px 60px, 120px 120px',
      },
      screens: {
        '3xl': '1920px',
        '4xl': '2560px',
      },
    },
  },
  plugins: [],
};

export default config;
