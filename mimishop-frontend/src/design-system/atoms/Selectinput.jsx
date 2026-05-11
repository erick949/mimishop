/**
 * NEXUS UI — ATOMS · SelectInput.jsx
 * Select nativo con estilos del sistema.
 *
 * Props:
 *   value     — valor seleccionado
 *   onChange  — handler
 *   options   — array de { value, label }
 */

import { useState } from "react";
import { TOKENS } from "../tokens";

export function SelectInput({ value, onChange, options = [], style = {} }) {
  const [focused, setFocused] = useState(false);

  return (
    <select
      value={value}
      onChange={onChange}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        background: TOKENS.bgPanel,
        border: `1px solid ${focused ? TOKENS.cyan : TOKENS.borderMedium}`,
        color: TOKENS.textPrimary,
        fontFamily: TOKENS.fontBody,
        fontSize: 13,
        padding: "9px 14px",
        outline: "none",
        cursor: "pointer",
        borderRadius: TOKENS.radiusSm,
        transition: TOKENS.transBase,
        ...style,
      }}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
