/**
 * NEXUS UI — ATOMS · Switch.jsx
 * Toggle on/off con deslizamiento y glow.
 *
 * Props:
 *   checked   — boolean controlado
 *   onChange  — handler(newValue: boolean)
 *   color     — clave de COLOR_MAP
 */

import { TOKENS, COLOR_MAP } from "../tokens";

export function Switch({ checked, onChange, color = "cyan" }) {
  const c = COLOR_MAP[color]?.main || TOKENS.cyan;

  return (
    <div
      onClick={() => onChange(!checked)}
      style={{
        width: 40,
        height: 22,
        borderRadius: 11,
        cursor: "pointer",
        background: checked ? `${c}33` : "rgba(255,255,255,0.06)",
        border: `1px solid ${checked ? c : TOKENS.borderMedium}`,
        position: "relative",
        transition: TOKENS.transBase,
        boxShadow: checked ? `0 0 10px ${c}44` : "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 2,
          left: checked ? 20 : 2,
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: checked ? c : TOKENS.textMuted,
          transition: TOKENS.transBase,
          boxShadow: checked ? `0 0 6px ${c}` : "none",
        }}
      />
    </div>
  );
}
