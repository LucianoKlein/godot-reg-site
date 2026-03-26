/** 全站共享色板 — 所有页面统一引用 */
export const colors = {
  bg: "#0B1020",
  panel: "rgba(255,255,255,0.06)",
  panel2: "rgba(255,255,255,0.08)",
  border: "rgba(255,255,255,0.12)",
  text: "rgba(255,255,255,0.92)",
  muted: "rgba(255,255,255,0.72)",
  faint: "rgba(255,255,255,0.55)",
  brand: "#7C3AED",
  brand2: "#22C55E",
  warn: "#F59E0B",
} as const;

export type Colors = typeof colors;

/** 全站共享背景渐变 */
export const pageBg =
  "radial-gradient(1200px 600px at 15% 10%, rgba(124,58,237,0.35), transparent 60%), radial-gradient(900px 520px at 85% 25%, rgba(34,197,94,0.22), transparent 60%), linear-gradient(180deg, #070A12, #0B1020 40%, #070A12)";

/** 全站共享字体栈 */
export const fontStack =
  'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans"';
