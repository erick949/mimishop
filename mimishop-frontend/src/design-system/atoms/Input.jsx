/**
 * NEXUS UI — ATOMS · Input.jsx
 * Campo de texto con icono, estado de foco y error.
 *
 * Props:
 *   type        — tipo HTML ("text" | "email" | "password" | etc.)
 *   placeholder — texto placeholder
 *   value       — valor controlado
 *   onChange    — handler
 *   icon        — símbolo opcional a la izquierda
 *   disabled    — boolean
 *   error       — boolean, activa estilos de error
 */

import { useState } from "react";
import { TOKENS } from "../tokens";

export function Input({
  type = "text",
  placeholder,
  value,
  onChange,
  icon,
  disabled = false,
  error = false,
  style = {},
  ...props
}) {
  const [focused, setFocused] = useState(false);
  const accent = error ? TOKENS.red : TOKENS.cyan;

  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
      {icon && (
        <span
          style={{
            position: "absolute",
            left: 14,
            color: focused ? accent : TOKENS.textMuted,
            fontSize: 14,
            pointerEvents: "none",
            transition: TOKENS.transBase,
          }}
        >
          {icon}
        </span>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          background: TOKENS.bgLevel3,
          border: `1px solid ${focused ? accent : error ? TOKENS.red : TOKENS.borderMedium}`,
          color: TOKENS.textPrimary,
          fontFamily: TOKENS.fontBody,
          fontSize: 14,
          padding: `10px 14px 10px ${icon ? "40px" : "14px"}`,
          outline: "none",
          borderRadius: TOKENS.radiusSm,
          transition: TOKENS.transBase,
          boxShadow: focused ? `0 0 0 2px ${accent}22, inset 0 0 12px ${accent}08` : "none",
          clipPath: "polygon(5px 0%, 100% 0%, calc(100% - 5px) 100%, 0% 100%)",
          opacity: disabled ? 0.5 : 1,
          ...style,
        }}
        {...props}
      />
    </div>
  );
}
