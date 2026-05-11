/**
 * NEXUS UI — ATOMS · Kbd.jsx
 * Tecla de teclado estilizada para atajos de teclado.
 *
 * Uso:
 *   <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd>
 */

import { TOKENS } from "../tokens";

export function Kbd({ children }) {
  return (
    <kbd
      style={{
        display: "inline-block",
        padding: "2px 6px",
        fontFamily: TOKENS.fontMono,
        fontSize: 10,
        background: TOKENS.bgLevel3,
        border: `1px solid ${TOKENS.borderMedium}`,
        borderBottom: `2px solid ${TOKENS.borderMedium}`,
        color: TOKENS.textMuted,
        borderRadius: 3,
      }}
    >
      {children}
    </kbd>
  );
}
