/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: "#2E7D32",
        accent: "#66BB6A",
        info: "#1565C0",
        surface: "#F4F6F5",
        text: "#1F2933",
        danger: "#DC2626",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(0,0,0,0.06)",
        card: "0 6px 20px rgba(0,0,0,0.08)",
      },
      borderRadius: {
        xl: "12px",
      },
    },
  },
  plugins: [],
};
