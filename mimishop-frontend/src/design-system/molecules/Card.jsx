/**
 * NEXUS UI — MOLECULES · Card.jsx
 * Contenedor base con glassmorphism, glow opcional y hover.
 *
 * Props:
 *   accentColor — clave de COLOR_MAP (borde y glow)
 *   glow        — boolean, activa glow permanente
 *   hoverable   — boolean, activa efecto hover
 */

import { useState } from "react";
import { TOKENS, COLOR_MAP } from "../tokens";

export function Card({
  accentColor = "cyan",
  glow = false,
  hoverable = false,
  style = {},
  children,
}) {
  const [hovered, setHovered] = useState(false);
  const c = COLOR_MAP[accentColor]?.main || TOKENS.cyan;

  return (
    <div
      onMouseEnter={() => hoverable && setHovered(true)}
      onMouseLeave={() => hoverable && setHovered(false)}
      style={{
        background: "rgba(10, 15, 25, 0.65)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: `1px solid ${hovered ? c + "44" : TOKENS.borderAccent}`,
        borderRadius: TOKENS.radiusLg,
        padding: "20px 24px",
        boxShadow:
          glow || hovered
            ? `0 8px 32px 0 rgba(0,0,0,0.5), 0 0 20px ${c}22`
            : "0 8px 32px 0 rgba(0,0,0,0.5)",
        position: "relative",
        overflow: "hidden",
        transition: TOKENS.transSlow,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
