/**
 * NEXUS UI — ATOMS · ProgressBar.jsx
 * Barra de progreso con gradiente neon.
 *
 * Props:
 *   value   — porcentaje 0–100
 *   color   — clave de COLOR_MAP
 *   height  — grosor en px
 */

import { COLOR_MAP } from "../tokens";

export function ProgressBar({ value = 60, color = "cyan", height = 4, style = {} }) {
  const c = COLOR_MAP[color]?.main || "#00f3ff";

  return (
    <div
      style={{
        height,
        background: "rgba(255,255,255,0.05)",
        borderRadius: 2,
        overflow: "hidden",
        ...style,
      }}
    >
      <div
        style={{
          width: `${Math.min(Math.max(value, 0), 100)}%`,
          height: "100%",
          background: `linear-gradient(90deg, ${c}, transparent)`,
          opacity: 0.7,
          borderRadius: 2,
          transition: "width 0.5s ease",
        }}
      />
    </div>
  );
}
