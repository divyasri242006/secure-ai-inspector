/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./api/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#050810",
        panel: "#0f1729",
        panelSoft: "#111f37",
        borderSubtle: "rgba(151, 171, 205, 0.2)",
        cyber: {
          blue: "#2de0ff",
          cyan: "#00b8d8",
          green: "#54f2b6",
          amber: "#f8bb5f",
          red: "#ef6464"
        }
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(45, 224, 255, 0.25), 0 14px 34px rgba(0, 10, 20, 0.45)",
        glass: "0 20px 60px rgba(2, 10, 28, 0.48)"
      },
      backdropBlur: {
        glass: "18px"
      },
      animation: {
        float: "float 8s ease-in-out infinite",
        pulseGlow: "pulseGlow 2.8s ease-in-out infinite"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" }
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0 1px rgba(45, 224, 255, 0.22), 0 0 0 rgba(45, 224, 255, 0)" },
          "50%": { boxShadow: "0 0 0 1px rgba(45, 224, 255, 0.36), 0 0 35px rgba(45, 224, 255, 0.24)" }
        }
      }
    }
  },
  plugins: []
};
