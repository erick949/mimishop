/**
 * NEXUS UI — ATOMS · Label.jsx
 * Etiqueta de formulario en estilo monoespaciado.
 *
 * Props:
 *   htmlFor   — id del input asociado
 *   required  — boolean, muestra asterisco rojo
 */

import { TOKENS } from "../tokens";

export function Label({ children, htmlFor, required = false, style = {} }) {
  return (
    <label
      htmlFor={htmlFor}
      style={{
        fontSize: 10,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: TOKENS.textMuted,
        fontFamily: TOKENS.fontMono,
        fontWeight: 600,
        display: "block",
        ...style,
      }}
    >
      {children}
      {required && <span style={{ color: TOKENS.red, marginLeft: 4 }}>*</span>}
    </label>
  );
}
