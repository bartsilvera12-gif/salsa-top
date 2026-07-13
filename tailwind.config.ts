import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta oficial Salsa Top
        fuego: {
          rojo: "#EF3340",
          naranja: "#FF8200",
          amarillo: "#FFD100",
        },
        petroleo: "#1E5155",
        crema: {
          DEFAULT: "#FFF4EA",
          suave: "#FBEFE2",
        },
        tinta: {
          DEFAULT: "#241A14", // titulares
          suave: "#2E2620", // cuerpo
          tenue: "#4A4037",
        },
        acento: "#C2410C", // eyebrows / detalles
      },
      fontFamily: {
        // Se enlazan a las variables de next/font en el layout
        title: ["var(--font-barlow-condensed)", "system-ui", "sans-serif"],
        body: ["var(--font-barlow)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "fuego-gradient":
          "linear-gradient(90deg,#FFD100,#FF8200 55%,#EF3340)",
        "fuego-gradient-135":
          "linear-gradient(135deg,#FFD100,#FF8200 55%,#EF3340)",
      },
      boxShadow: {
        recuadro: "0 24px 55px rgba(0,0,0,.07)",
        "recuadro-fuerte": "0 14px 34px rgba(0,0,0,.10)",
      },
      keyframes: {
        floatglow: {
          "0%,100%": { transform: "translateX(-50%) translateY(0)" },
          "50%": { transform: "translateX(-50%) translateY(-14px)" },
        },
        reveal: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "none" },
        },
      },
      animation: {
        floatglow: "floatglow 6s ease-in-out infinite",
        reveal: "reveal .7s cubic-bezier(.2,.7,.2,1) both",
      },
    },
  },
  plugins: [],
};

export default config;
