/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
theme: {
  extend: {
    animation: {
      bar: 'drain 15s linear forwards',
    },
    keyframes: {
      drain: {
        from: { width: '100%' },
        to: { width: '0%' },
      },
    },
  },
};
