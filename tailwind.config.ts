module.exports = {
  theme: {
    extend: {
      animation: {
        'glow': 'glow 4s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%, 100%': {
            'background-position': '0% 50%',
          },
          '50%': {
            'background-position': '100% 50%',
          },
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
        },
        'pulse-glow': {
          '0%, 100%': {
            opacity: '0.2',
            transform: 'scale(1)',
          },
          '50%': {
            opacity: '0.3',
            transform: 'scale(1.05)',
          },
        },
      },
    },
  },
} 