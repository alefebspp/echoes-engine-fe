/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Observatory palette (source of truth lives in src/styles/tokens.css)
        ink: "var(--midnight-ink)",
        violet: {
          deep: "var(--deep-violet)",
        },
        memory: "var(--memory-blue)",
        signal: "var(--signal-cyan)",
        lilac: "var(--soft-lilac)",
        trace: "var(--trace-amber)",

        surface: {
          0: "var(--surface-0)",
          1: "var(--surface-1)",
          2: "var(--surface-2)",
          raised: "var(--surface-raised)",
        },

        ink_text: {
          DEFAULT: "var(--text-primary)",
          bright: "var(--text-bright)",
          muted: "var(--text-muted)",
          faint: "var(--text-faint)",
        },

        danger: "var(--danger)",

        hairline: {
          DEFAULT: "var(--hairline)",
          strong: "var(--hairline-strong)",
        },
      },
      fontFamily: {
        display: "var(--font-display)",
        body: "var(--font-body)",
        mono: "var(--font-mono)",
      },
      fontSize: {
        display: "var(--step-display)",
        h1: "var(--step-h1)",
        h2: "var(--step-h2)",
        h3: "var(--step-h3)",
        micro: "var(--step-micro)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        DEFAULT: "var(--radius)",
        lg: "var(--radius-lg)",
        pill: "var(--radius-pill)",
      },
      boxShadow: {
        panel: "var(--shadow-panel)",
        raised: "var(--shadow-raised)",
        focus: "var(--focus-ring)",
      },
      maxWidth: {
        shell: "var(--maxw)",
      },
      transitionTimingFunction: {
        ease: "var(--ease)",
      },
      keyframes: {
        spin: { to: { transform: "rotate(360deg)" } },
        ribbon: {
          from: { transform: "scaleY(0.05)", opacity: "0" },
          to: { transform: "scaleY(1)", opacity: "1" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        spin: "spin 0.7s linear infinite",
        "fade-up": "fade-up var(--dur) var(--ease) both",
      },
    },
  },
  plugins: [],
};
