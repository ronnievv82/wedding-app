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
    'fade-in': 'fadeIn 0.5s ease-out',
  },
  keyframes: {
    drain: {
      from: { width: '100%' },
      to: { width: '0%' },
    },
    fadeIn: {
      from: { opacity: 0 },
      to: { opacity: 1 },
    },
  },
}
;
