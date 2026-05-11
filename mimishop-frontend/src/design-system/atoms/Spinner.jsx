/**
 * NEXUS UI — ATOMS · Spinner.jsx
 * Indicador de carga con anillo giratorio y label.
 *
 * Props:
 *   size   — diámetro del anillo en px
 *   color  — clave de COLOR_MAP
 *   label  — texto bajo el spinner (false para ocultar)
 */

import { TOKENS, COLOR_MAP } from "../tokens";
import { Text } from "./Text";

export function Spinner({ size = 40, color = "cyan", label = "CARGANDO..." }) {
  const c = COLOR_MAP[color]?.main || TOKENS.cyan;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <div
        style={{
          width: size,
          height: size,
          border: "2px solid rgba(255,255,255,0.08)",
          borderTopColor: c,
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          boxShadow: `0 0 15px ${c}`,
        }}
      />
      {label && (
        <Text
          variant="label"
          color={color}
          style={{ letterSpacing: 2, animation: "pulse-glow 1.2s ease-in-out infinite" }}
        >
          {label}
        </Text>
      )}
    </div>
  );
}
