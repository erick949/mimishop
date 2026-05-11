/**
 * NEXUS UI — ATOMS · Badge.jsx
 * Etiqueta de estado compacta con dot y glow.
 *
 * Props:
 *   color    — clave de COLOR_MAP
 *   dot      — boolean, muestra Dot antes del texto
 *   children — texto del badge
 */

import { TOKENS, COLOR_MAP } from "../tokens";
import { Dot } from "./Dot";

export function Badge({ color = "default", dot = true, children, style = {} }) {
  const { main, bg, border } = COLOR_MAP[color] || COLOR_MAP.default;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "3px 10px",
        borderRadius: TOKENS.radiusSm,
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        fontFamily: TOKENS.fontMono,
        background: bg,
        color: main,
        border: `1px solid ${border}`,
        boxShadow: `0 0 8px ${bg}`,
        ...style,
      }}
    >
      {dot && <Dot color={color} size={5} />}
      {children}
    </span>
  );
}
