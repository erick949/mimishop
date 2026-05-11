/**
 * NEXUS UI — ATOMS · Avatar.jsx
 * Círculo con iniciales del usuario y gradiente neon.
 *
 * Props:
 *   name    — nombre completo (se extraen las iniciales)
 *   size    — diámetro en px
 *   colorA  — color inicial del gradiente
 *   colorB  — color final del gradiente
 */

import { TOKENS } from "../tokens";

export function Avatar({
  name = "",
  size = 36,
  colorA = TOKENS.magenta,
  colorB = TOKENS.cyan,
  style = {},
}) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase() || "?";

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: `linear-gradient(135deg, ${colorA}, ${colorB})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: TOKENS.fontDisplay,
        fontSize: size * 0.36,
        fontWeight: 700,
        color: TOKENS.bgBase,
        flexShrink: 0,
        border: "1px solid rgba(0, 243, 255, 0.3)",
        boxShadow: `0 0 ${size * 0.4}px rgba(0, 243, 255, 0.2)`,
        ...style,
      }}
    >
      {initials}
    </div>
  );
}
