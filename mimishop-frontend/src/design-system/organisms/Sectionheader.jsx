/**
 * NEXUS UI — ORGANISMS · SectionHeader.jsx
 * Cabecera de sección con título, badge de conteo y acción opcional.
 *
 * Props:
 *   title  — texto de la sección
 *   count  — número mostrado en Badge (omitir para ocultar)
 *   action — nodo React con botón de acción (opcional)
 */

import { Text }  from "../atoms/Text";
import { Badge } from "../atoms/Badge";

export function SectionHeader({ title, count, action }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Text variant="label" style={{ fontSize: 13, color: "#fff" }}>
          {title}
        </Text>
        {count !== undefined && <Badge color="cyan">{count}</Badge>}
      </div>
      {action}
    </div>
  );
}
