/**
 * NEXUS UI — MOLECULES · ChipContact.jsx
 * Fila de contacto con icono, valor, badge de estado y acciones.
 *
 * Props:
 *   icon     — símbolo del tipo de contacto (📧, 📞…)
 *   value    — texto del contacto
 *   active   — boolean, controla badge Verde/Rojo
 *   onEdit   — callback para editar (omitir para ocultar botón)
 *   onDelete — callback para eliminar (omitir para ocultar botón)
 */

import { TOKENS } from "../tokens";
import { Badge }   from "../atoms/Badge";
import { Button }  from "../atoms/Button";
import { Text }    from "../atoms/Text";
import { Tooltip } from "../atoms/Tooltip";

export function ChipContact({ icon, value, active = true, onEdit, onDelete }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "12px 16px",
        background: TOKENS.bgLevel3,
        border: `1px solid ${TOKENS.borderSubtle}`,
        borderRadius: TOKENS.radiusSm,
        transition: TOKENS.transBase,
      }}
    >
      {/* Icono de tipo */}
      <div
        style={{
          width: 30,
          height: 30,
          background: TOKENS.bgPanel,
          border: `1px solid ${TOKENS.borderMedium}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 13,
          flexShrink: 0,
          color: TOKENS.cyan,
        }}
      >
        {icon}
      </div>

      <Text variant="body" style={{ flex: 1 }}>{value}</Text>

      <Badge color={active ? "green" : "red"}>
        {active ? "Activo" : "Inactivo"}
      </Badge>

      <div style={{ display: "flex", gap: 6 }}>
        {onEdit && (
          <Tooltip tip="Editar">
            <Button variant="icon" size="sm" onClick={onEdit}>✏️</Button>
          </Tooltip>
        )}
        {onDelete && (
          <Tooltip tip="Eliminar">
            <Button variant="icon" size="sm" color="red" onClick={onDelete}>🗑</Button>
          </Tooltip>
        )}
      </div>
    </div>
  );
}
