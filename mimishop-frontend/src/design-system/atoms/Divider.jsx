/**
 * NEXUS UI — ATOMS · Divider.jsx
 * Línea separadora con etiqueta central opcional.
 *
 * Props:
 *   label  — texto central (opcional)
 *   color  — clave de COLOR_MAP
 */

import { COLOR_MAP } from "../tokens";
import { Text } from "./Text";

export function Divider({ label, color = "cyan" }) {
  const c = COLOR_MAP[color]?.main || "#00f3ff";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "8px 0" }}>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, ${c}44)` }} />
      {label && (
        <Text variant="label" style={{ color: `${c}88`, whiteSpace: "nowrap" }}>
          {label}
        </Text>
      )}
      <div style={{ flex: 1, height: 1, background: `linear-gradient(to left, transparent, ${c}44)` }} />
    </div>
  );
}
