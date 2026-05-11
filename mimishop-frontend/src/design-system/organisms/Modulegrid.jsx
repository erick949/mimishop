/**
 * NEXUS UI — ORGANISMS · ModuleGrid.jsx
 * Grid 2×N de accesos rápidos a módulos con NavItem.
 *
 * Props:
 *   title   — título de la sección
 *   modules — array de { label, icon, color, onClick }
 */

import { Text }    from "../atoms/Text";
import { NavItem } from "../molecules/NavItem";
import { Card }    from "../molecules/Card";

export function ModuleGrid({ title = "Módulos", modules = [] }) {
  return (
    <Card>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <Text as="h3" variant="label" style={{ fontSize: 13, color: "#fff" }}>
          {title}
        </Text>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {modules.map(({ label, icon, onClick }) => (
          <NavItem key={label} icon={icon} label={label} onClick={onClick} />
        ))}
      </div>
    </Card>
  );
}
