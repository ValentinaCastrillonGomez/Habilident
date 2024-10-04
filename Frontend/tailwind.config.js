/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography"), require('daisyui')],
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#7fc6e8",
          "secondary": "#2563eb",
          "accent": "#99f6e4",
          "neutral": "#7dd3fc",
          "base-100": "#ffffff",
          "info": "#0ea5e9",
          "success": "#22c55e",
          "warning": "#facc15",
          "error": "#e11d48",
        },
      },
    ],
  },
};
