import type { Appearance } from "@stripe/stripe-js";

/** Light UI — tweak `variables` and `rules` to match your app. */
export const stripeAppearanceLight: Appearance = {
  theme: "stripe",
  variables: {
    colorPrimary: "#635bff",
    colorBackground: "#ffffff",
    colorText: "#08060d",
    colorTextSecondary: "#6b6375",
    colorDanger: "#df1b41",
    fontFamily: "system-ui, 'Segoe UI', Roboto, sans-serif",
    fontSizeBase: "16px",
    spacingUnit: "4px",
    borderRadius: "8px",
  },
  rules: {
    ".Input": {
      border: "1px solid #e5e4e7",
      boxShadow: "none",
    },
    ".Input:focus": {
      border: "1px solid #635bff",
      boxShadow: "0 0 0 1px #635bff",
    },
    ".Label": {
      fontWeight: "500",
    },
    ".Tab": {
      borderRadius: "6px",
    },
  },
};

/** Dark UI — used when `prefers-color-scheme: dark`. */
export const stripeAppearanceDark: Appearance = {
  theme: "night",
  variables: {
    colorPrimary: "#a78bfa",
    colorBackground: "#16171d",
    colorText: "#f3f4f6",
    colorTextSecondary: "#9ca3af",
    colorDanger: "#fca5a5",
    fontFamily: "system-ui, 'Segoe UI', Roboto, sans-serif",
    fontSizeBase: "16px",
    spacingUnit: "4px",
    borderRadius: "8px",
  },
  rules: {
    ".Input": {
      border: "1px solid #2e303a",
      backgroundColor: "#1f2028",
      boxShadow: "none",
    },
    ".Input:focus": {
      border: "1px solid #a78bfa",
      boxShadow: "0 0 0 1px #a78bfa",
    },
    ".Label": {
      fontWeight: "500",
    },
  },
};
