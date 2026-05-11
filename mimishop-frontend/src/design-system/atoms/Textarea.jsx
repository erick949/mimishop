/**
 * NEXUS UI — ATOMS · TextArea.jsx
 * Área de texto redimensionable con foco neon.
 *
 * Props:
 *   placeholder — texto placeholder
 *   value       — valor controlado
 *   onChange    — handler
 *   rows        — número de filas visibles
 */

import { useState } from "react";
import { TOKENS } from "../tokens";

export function TextArea({ placeholder, value, onChange, rows = 4, style = {} }) {
  const [focused, setFocused] = useState(false);

  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      rows={rows}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: "100%",
        resize: "vertical",
        background: TOKENS.bgLevel3,
        border: `1px solid ${focused ? TOKENS.cyan : TOKENS.borderMedium}`,
        color: TOKENS.textPrimary,
        fontFamily: TOKENS.fontBody,
        fontSize: 14,
        padding: "10px 14px",
        outline: "none",
        borderRadius: TOKENS.radiusSm,
        transition: TOKENS.transBase,
        boxShadow: focused ? `0 0 0 2px ${TOKENS.cyan}22` : "none",
        ...style,
      }}
    />
  );
}
