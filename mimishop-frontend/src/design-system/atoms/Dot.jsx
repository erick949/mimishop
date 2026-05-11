/**
 * NEXUS UI — ATOMS · Dot.jsx
 * Indicador de estado circular con glow opcional.
 *
 * Props:
 *   color  — clave de COLOR_MAP
 *   size   — diámetro en px
 *   pulse  — boolean, activa animación pulse-glow
 */

import { COLOR_MAP } from "../tokens";

export function Dot({ color = "green", size = 6, pulse = false }) {
  const c = COLOR_MAP[color]?.main || color;

  return (
    <span
      style={{
        display: "inline-block",
        width: size,
        height: size,
        borderRadius: "50%",
        background: c,
        boxShadow: `0 0 ${size + 2}px ${c}`,
        animation: pulse ? "pulse-glow 1.4s ease-in-out infinite" : undefined,
        flexShrink: 0,
      }}
    />
  );
}
