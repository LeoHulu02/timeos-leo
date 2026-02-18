export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        athlete: {
          bg: "#050509",
          surface: "#0B0B12",
          surfaceSoft: "#111118",
          border: "#1F2933",
          gold: "#F5D15F",
          goldSoft: "#3B3014",
          silver: "#CBD5F5",
          textSoft: "#E5E7EB",
          muted: "#6B7280"
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        display: ["Clash Display", "system-ui", "-apple-system", "BlinkMacSystemFont", "sans-serif"]
      },
      boxShadow: {
        athlete: "0 18px 45px rgba(0,0,0,0.65)"
      }
    }
  },
  plugins: []
}
