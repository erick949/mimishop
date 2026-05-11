/**
 * NEXUS UI — ATOMS · Checkbox.jsx
 * Checkbox personalizado con glow al activarse.
 *
 * Props:
 *   checked   — boolean controlado
 *   onChange  — handler(newValue: boolean)
 *   label     — texto junto al checkbox
 *   color     — clave de COLOR_MAP
 */

import { TOKENS, COLOR_MAP } from "../tokens";
import { Text } from "./Text";

export function Checkbox({ checked, onChange, label, color = "cyan" }) {
  const c = COLOR_MAP[color]?.main || TOKENS.cyan;

  return (
    <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
      <div
        onClick={() => onChange(!checked)}
        style={{
          width: 16,
          height: 16,
          border: `1px solid ${checked ? c : TOKENS.borderMedium}`,
          background: checked ? `${c}22` : "transparent",
          borderRadius: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: TOKENS.transBase,
          flexShrink: 0,
          cursor: "pointer",
          boxShadow: checked ? `0 0 8px ${c}55` : "none",
        }}
      >
        {checked && <span style={{ color: c, fontSize: 10, lineHeight: 1 }}>✓</span>}
      </div>
      {label && <Text variant="body" style={{ cursor: "pointer" }}>{label}</Text>}
    </label>
  );
}
