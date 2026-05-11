/**
 * NEXUS UI — ATOMS · Tag.jsx
 * Chip de etiqueta con opción de eliminar.
 *
 * Props:
 *   color     — clave de COLOR_MAP
 *   onRemove  — callback al pulsar ✕ (omitir para ocultar botón)
 *   children  — texto de la etiqueta
 */

import { TOKENS, COLOR_MAP } from "../tokens";

export function Tag({ children, color = "cyan", onRemove }) {
  const { main, bg, border } = COLOR_MAP[color] || COLOR_MAP.default;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "2px 8px",
        fontSize: 10,
        fontWeight: 600,
        fontFamily: TOKENS.fontMono,
        letterSpacing: "0.06em",
        background: bg,
        color: main,
        border: `1px solid ${border}`,
        borderRadius: TOKENS.radiusSm,
      }}
    >
      {children}
      {onRemove && (
        <button
          onClick={onRemove}
          style={{
            background: "none",
            border: "none",
            color: main,
            cursor: "pointer",
            fontSize: 10,
            lineHeight: 1,
            padding: 0,
          }}
        >
          ✕
        </button>
      )}
    </span>
  );
}
