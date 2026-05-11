/**
 * NEXUS UI — TOKENS · colors.js
 * Colores base, bordes, acentos y texto
 */

export const TOKENS = {
  /* ── Fondos ─────────────────────────────── */
  bgBase:   "#030508",
  bgLevel1: "#0a0c10",
  bgLevel2: "#0f1218",
  bgLevel3: "#141820",
  bgPanel:  "#161b24",

  /* ── Bordes ─────────────────────────────── */
  borderSubtle: "#1e2530",
  borderMedium: "#2a3344",
  borderAccent: "rgba(0, 243, 255, 0.15)",

  /* ── Acentos ────────────────────────────── */
  cyan:    "#00f3ff",
  magenta: "#bc13fe",
  green:   "#00ff9d",
  red:     "#ff0055",
  yellow:  "#ffc107",
  blue:    "#3b82f6",
  purple:  "#7b2fff",

  /* ── Texto ──────────────────────────────── */
  textPrimary: "#e2e8f0",
  textMuted:   "#64748b",
  textDim:     "#5a6a80",
  textMute:    "#3a4a5a",
};

/**
 * Mapa semántico: nombre de color → { main, glow, bg, border }
 * Úsalo en componentes para no hardcodear valores.
 *
 * Ejemplo:
 *   const c = COLOR_MAP["cyan"];
 *   style={{ color: c.main, boxShadow: c.glow }}
 */
export const COLOR_MAP = {
  cyan:    { main: TOKENS.cyan,    glow: "0 0 15px rgba(0, 243, 255, 0.4)",   bg: "rgba(0, 243, 255, 0.1)",  border: "rgba(0, 243, 255, 0.3)"  },
  green:   { main: TOKENS.green,   glow: "0 0 15px rgba(0, 255, 157, 0.4)",   bg: "rgba(0, 255, 157, 0.1)",  border: "rgba(0, 255, 157, 0.3)"  },
  magenta: { main: TOKENS.magenta, glow: "0 0 15px rgba(188, 19, 254, 0.4)",  bg: "rgba(188, 19, 254, 0.1)", border: "rgba(188, 19, 254, 0.3)" },
  red:     { main: TOKENS.red,     glow: "0 0 15px rgba(255, 0, 85, 0.4)",    bg: "rgba(255, 0, 85, 0.1)",   border: "rgba(255, 0, 85, 0.3)"   },
  yellow:  { main: TOKENS.yellow,  glow: "none",                               bg: "rgba(255, 193, 7, 0.1)",  border: "rgba(255, 193, 7, 0.3)"  },
  blue:    { main: TOKENS.blue,    glow: "none",                               bg: "rgba(59, 130, 246, 0.1)", border: "rgba(59, 130, 246, 0.3)" },
  default: { main: "#94a3b8",      glow: "none",                               bg: "rgba(100,116,139,0.1)",   border: "rgba(100,116,139,0.3)"   },
};
