/**
 * NEXUS UI — ORGANISMS · KPIGrid.jsx
 * Grid de tarjetas KPI (StatCards) en una sola fila responsiva.
 *
 * Props:
 *   stats — array de objetos con las props de StatCard:
 *           { label, value, icon, color, progress }
 *
 * Uso:
 *   <KPIGrid stats={[
 *     { label: "Clientes", value: "1,240", icon: "👥", color: "cyan", progress: 72 },
 *     { label: "Ventas",   value: "$48k",  icon: "💰", color: "green", progress: 55 },
 *   ]} />
 */

import { StatCard } from "../molecules/StatCard";

export function KPIGrid({ stats = [] }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${stats.length}, 1fr)`,
        gap: 20,
        marginBottom: 24,
      }}
    >
      {stats.map((s, i) => (
        <StatCard key={i} {...s} />
      ))}
    </div>
  );
}
