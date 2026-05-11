/**
 * NEXUS UI — MOLECULES · AlertBanner.jsx
 * Banner de alerta con icono, mensaje y botón de cierre opcional.
 *
 * Props:
 *   message — texto del mensaje
 *   color   — clave de COLOR_MAP ("yellow" | "red" | "green" | "cyan"…)
 *   icon    — símbolo del icono
 *   onClose — callback al pulsar ✕ (omitir para ocultar botón)
 */

import { TOKENS, COLOR_MAP } from "../tokens";
import { Icon } from "../atoms/Icon";
import { Text } from "../atoms/Text";

export function AlertBanner({ message, color = "yellow", icon = "⚠", onClose }) {
  const c = COLOR_MAP[color] || COLOR_MAP.yellow;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 16px",
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: TOKENS.radiusSm,
      }}
    >
      <Icon symbol={icon} color={color} size={16} />
      <Text variant="body" style={{ flex: 1, color: c.main }}>
        {message}
      </Text>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: c.main,
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
}
