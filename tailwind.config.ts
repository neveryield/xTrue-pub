/**
 * Tailwind 配置 — xTrue proto_ds 科技蓝设计系统
 */

import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/modules/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 品牌主色：暖珊瑚
        brand: {
          50: "#fff0ee",
          100: "#ffe0db",
          200: "#ffc4bb",
          300: "#ffa394",
          400: "#ff816b",
          500: "#f8604a",
          600: "#e0493a",
          700: "#c0382c",
          800: "#9e3026",
          900: "#7e2b24",
        },
        // 认同度色阶
        score: {
          low: "hsl(var(--score-low))",
          mid: "hsl(var(--score-mid))",
          high: "hsl(var(--score-high))",
        },
        // 层级色
        lv: {
          0: "hsl(var(--lv0))",
          1: "hsl(var(--lv1))",
          2: "hsl(var(--lv2))",
          3: "hsl(var(--lv3))",
          4: "hsl(var(--lv4))",
          5: "hsl(var(--lv5))",
        },
        // 品类色
        cat: {
          movie: "hsl(var(--cat-movie))",
          product: "hsl(var(--cat-product))",
          food: "hsl(var(--cat-food))",
          leisure: "hsl(var(--cat-leisure))",
        },
        // 语义色
        verified: {
          DEFAULT: "#10b981",
          light: "#ecfdf5",
          dark: "#065f46",
        },
        warning: {
          DEFAULT: "#f59e0b",
          light: "#fffbeb",
          dark: "#92400e",
        },
        danger: {
          DEFAULT: "#ef4444",
          light: "#fef2f2",
          dark: "#991b1b",
        },
        // shadcn/ui CSS 变量映射
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      borderColor: {
        DEFAULT: "hsl(var(--border))",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "STSong", "SimSun", "serif"],
        mono: ["var(--font-mono)", "SF Mono", "Fira Code", "monospace"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "0.75rem",
        "2xl": "1rem",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
