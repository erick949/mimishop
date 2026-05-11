/**
 * NEXUS UI — ATOMS · Icon.jsx
 * Wrapper ligero para iconos Unicode / emoji / SVG-string.
 *
 * Props:
 *   symbol  — carácter o string del icono
 *   color   — clave de COLOR_MAP o valor CSS
 *   size    — tamaño en px
 *   glow    — boolean, activa drop-shadow
 */

import { COLOR_MAP } from "../tokens";

export function Icon({ symbol, color = "cyan", size = 18, glow = true, style = {} }) {
  const c = COLOR_MAP[color]?.main || color;

  return (
    <span
      aria-hidden
      style={{
        fontSize: size,
        color: c,
        lineHeight: 1,
        display: "inline-flex",
        alignItems: "center",
        filter: glow ? `drop-shadow(0 0 5px ${c})` : undefined,
        ...style,
      }}
    >
      {symbol}
    </span>
  );
}
