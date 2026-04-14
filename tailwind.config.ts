import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)"],
        mono: ["var(--font-jetbrains-mono)"],
      },
      colors: {
        base: "var(--base)",
        surface: "var(--surface)",
        elevated: "var(--elevated)",
        high: "var(--high)",
        border: "var(--border)",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "var(--base)",
        foreground: "var(--text-primary)",
        primary: {
          DEFAULT: "var(--cyan)",
          foreground: "var(--base)",
        },
        secondary: {
          DEFAULT: "var(--secondary-cyan)",
          foreground: "var(--base)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--text-muted)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--surface)",
          foreground: "var(--text-primary)",
        },
        card: {
          DEFAULT: "var(--surface)",
          foreground: "var(--text-primary)",
        },
        cyan: {
          400: "#22d3ee",
          500: "#f43f5e",
          600: "#0891b2",
        },
        indigo: {
          500: "#6366f1",
        },
        violet: {
          500: "#8b5cf6",
        },
        fuchsia: {
          500: "#d946ef",
        },
        amber: {
          500: "#f59e0b",
        },
        rose: {
          500: "#f43f5e",
        },
        sky: {
          500: "#0ea5e9",
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-5px)" },
          "75%": { transform: "translateX(5px)" },
        },
        voteFlash: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(6,182,212,0)" },
          "50%": { boxShadow: "0 0 15px 5px rgba(6,182,212,0.6)" },
        },
        barFill: {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
        countPulse: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.2)" },
        },
        rotateBorder: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        scanLine: {
          "0%": { top: "-100%" },
          "100%": { top: "100%" },
        },
        bob1: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        bob2: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-15px)" },
        },
        bob3: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shimmer: "shimmer 2s linear infinite",
        shake: "shake 0.5s ease-in-out",
        voteFlash: "voteFlash 1.5s ease-out",
        barFill: "barFill 1s ease-out forwards",
        countPulse: "countPulse 0.3s ease-in-out",
        rotateBorder: "rotateBorder 3s ease infinite",
        scanLine: "scanLine 2s linear infinite",
        bob1: "bob1 3s ease-in-out infinite",
        bob2: "bob2 4s ease-in-out infinite",
        bob3: "bob3 5s ease-in-out infinite",
        marquee: "marquee 15s linear infinite",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
  ],
} satisfies Config

export default config
