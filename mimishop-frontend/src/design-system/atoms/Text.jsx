/**
 * NEXUS UI — ATOMS · Text.jsx
 * Tipografía base del sistema.
 *
 * Props:
 *   as        — tag HTML ("p" | "h1" | "span" | etc.)
 *   variant   — "body" | "caption" | "label" | "mono" | "display" | "muted"
 *   glow      — boolean, activa text-shadow
 *   color     — clave de COLOR_MAP o valor CSS directo
 */

import { TOKENS, COLOR_MAP } from "../tokens";

export function Text({
  as: Tag = "p",
  variant = "body",
  glow = false,
  color,
  style = {},
  children,
  ...props
}) {
  const variants = {
    display: { fontFamily: TOKENS.fontDisplay, fontSize: 22, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: TOKENS.cyan },
    body:    { fontFamily: TOKENS.fontBody,    fontSize: 14, color: TOKENS.textPrimary },
    caption: { fontFamily: TOKENS.fontBody,    fontSize: 11, color: TOKENS.textMuted },
    label:   { fontFamily: TOKENS.fontMono,    fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: TOKENS.textMuted },
    mono:    { fontFamily: TOKENS.fontMono,    fontSize: 12, color: TOKENS.textPrimary },
    muted:   { fontFamily: TOKENS.fontBody,    fontSize: 13, color: TOKENS.textMuted },
  };

  const base = variants[variant] || variants.body;
  const c    = color ? (COLOR_MAP[color]?.main || color) : base.color;

  return (
    <Tag
      style={{
        ...base,
        color: c,
        textShadow: glow ? `0 0 10px ${c}` : undefined,
        ...style,
      }}
      {...props}
    >
      {children}
    </Tag>
  );
}
