/**
 * NEXUS UI — MOLECULES · StatCard.jsx
 * Tarjeta KPI con label, valor numérico grande, icono y barra de progreso.
 *
 * Props:
 *   label    — nombre del indicador
 *   value    — valor a mostrar (string o número)
 *   icon     — símbolo del icono
 *   color    — clave de COLOR_MAP
 *   progress — porcentaje 0–100 para la ProgressBar
 */

import { TOKENS, COLOR_MAP } from "../tokens";
import { Icon }        from "../atoms/Icon";
import { Text }        from "../atoms/Text";
import { ProgressBar } from "../atoms/ProgressBar";
import { Card }        from "./Card";

export function StatCard({ label, value, icon, color = "cyan", progress = 60 }) {
  const c = COLOR_MAP[color] || COLOR_MAP.cyan;

  return (
    <Card style={{ borderColor: "rgba(255,255,255,0.05)" }}>
      {/* Barra superior de acento */}
      <div
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${c.main}, transparent)`,
          opacity: 0.7,
        }}
      />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <Text variant="label" style={{ marginBottom: 8 }}>{label}</Text>
          <div
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: c.main,
              lineHeight: 1,
              fontFamily: TOKENS.fontMono,
              textShadow: `0 0 15px ${c.main}`,
            }}
          >
            {value}
          </div>
        </div>
        <Icon symbol={icon} color={color} size={24} style={{ opacity: 0.8 }} />
      </div>

      <ProgressBar value={progress} color={color} style={{ marginTop: 18 }} />
    </Card>
  );
}
