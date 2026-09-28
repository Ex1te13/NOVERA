import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#080a09",
        coal: "#0e1211",
        graphite: "#151a18",
        slate: "#1e2623",
        moss: {
          950: "#0b1a15",
          900: "#10261f",
          800: "#163529",
          700: "#1d4635",
          600: "#265a44",
          500: "#347458",
          400: "#4f9273",
        },
        wine: {
          950: "#1e0a0e",
          900: "#3a1119",
          800: "#521823",
          700: "#6a1f2d",
          600: "#872a3a",
          500: "#a3384a",
          400: "#c05264",
        },
        sand: "#e9e2d6",
        bone: "#f4efe6",
        mist: "#a7a39b",
        ash: "#6e6b65",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        serif: ["var(--font-serif)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      letterSpacing: {
        wide2: "0.22em",
        wide3: "0.35em",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        ken: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.08)" },
        },
        pulseDot: {
          "0%": { transform: "scale(1)", opacity: "0.9" },
          "100%": { transform: "scale(2.4)", opacity: "0" },
        },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        ken: "ken 18s ease-out forwards",
        pulseDot: "pulseDot 1.8s ease-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
