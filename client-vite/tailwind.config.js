/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    "text-xs", "text-sm", "text-base", "text-xl", "text-2xl",
    "sm:text-sm", "sm:text-base", "sm:text-xl", "sm:text-2xl",
    "font-light", "font-medium", "font-semibold",
    "text-white", "text-gray-400", "text-gray-500", "text-gray-600", "text-green-600",
    "bg-yellow-600", "bg-yellow-400", "bg-gray-200", "bg-gray-300", "bg-gray-400",
    "bg-blue-600", "bg-blue-700", "bg-green-500", "bg-green-600", "bg-green-700",
    "uppercase", "tracking-widest", "animate-bar", "animate-fade-in",
  ],
  theme: {
    extend: {
      animation: {
        bar: "drain 3s linear forwards",
        "fade-in": "fadeIn 0.5s ease-out",
      },
      keyframes: {
        drain: {
          from: { width: "100%" },
          to: { width: "0%" },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
