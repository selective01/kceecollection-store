// toastConfig.js — shared constants for Toast component

export const DURATION = 3000;

export const ICONS = {
  success: "fa-circle-check",
  error:   "fa-circle-xmark",
  warning: "fa-triangle-exclamation",
  info:    "fa-circle-info",
};

export const STYLES = {
  success: {
    bg:     "var(--design-color, #3A9D23)",
    light:  "rgba(58,157,35,0.12)",
    border: "rgba(58,157,35,0.3)",
    bar:    "rgba(58,157,35,0.35)",
  },
  error: {
    bg:     "#e53935",
    light:  "rgba(229,57,53,0.10)",
    border: "rgba(229,57,53,0.3)",
    bar:    "rgba(229,57,53,0.35)",
  },
  warning: {
    bg:     "#f59e0b",
    light:  "rgba(245,158,11,0.10)",
    border: "rgba(245,158,11,0.3)",
    bar:    "rgba(245,158,11,0.35)",
  },
  info: {
    bg:     "#0ea5e9",
    light:  "rgba(14,165,233,0.10)",
    border: "rgba(14,165,233,0.3)",
    bar:    "rgba(14,165,233,0.35)",
  },
};
