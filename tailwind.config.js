
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(210, 80%, 50%)',
        accent: 'hsl(260, 80%, 50%)',
        bg: 'hsl(220, 15%, 95%)',
        surface: 'hsl(220, 15%, 100%)',
        text: 'hsl(220, 15%, 20%)',
        muted: 'hsl(220, 15%, 60%)',
        border: 'hsl(220, 15%, 85%)',
      },
      spacing: {
        sm: '4px',
        md: '8px',
        lg: '16px',
        xl: '24px',
        '2xl': '32px',
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
      boxShadow: {
        card: '0 4px 12px hsla(220, 15%, 10%, 0.1)',
        glow: '0 0 20px hsla(210, 80%, 50%, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 200ms ease-out',
        'slide-up': 'slideUp 200ms ease-out',
        'spin-slow': 'spin 1s linear infinite',
      },
      typography: {
        display: 'text-xl font-semibold',
        body: 'text-base font-normal leading-relaxed',
      },
    },
  },
  plugins: [],
}
