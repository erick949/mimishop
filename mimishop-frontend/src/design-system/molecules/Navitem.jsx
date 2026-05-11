/**
 * NEXUS UI — MOLECULES · NavItem.jsx
 * Ítem de navegación vertical con icono y label.
 *
 * Props:
 *   icon   — símbolo del icono
 *   label  — texto bajo el icono
 *   active — boolean, resalta el ítem activo
 *   onClick — handler de navegación
 */

import { useState } from "react";
import { TOKENS } from "../tokens";
import { Icon } from "../atoms/Icon";
import { Text } from "../atoms/Text";

export function NavItem({ icon, label, active = false, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        background: "rgba(255,255,255,0.02)",
        border: `1px solid ${active || hovered ? TOKENS.cyan : "rgba(255,255,255,0.05)"}`,
        borderRadius: TOKENS.radiusMd,
        padding: "14px 10px",
        cursor: "pointer",
        width: "100%",
        transition: TOKENS.transBase,
        boxShadow: active || hovered ? `0 0 15px ${TOKENS.cyan}33` : "none",
      }}
    >
      <Icon symbol={icon} color={active ? "cyan" : "default"} size={18} />
      <Text
        variant="label"
        style={{ color: active ? TOKENS.cyan : TOKENS.textMuted, fontSize: 9 }}
      >
        {label}
      </Text>
    </button>
  );
}
