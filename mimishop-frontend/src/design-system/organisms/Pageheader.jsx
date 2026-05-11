/**
 * NEXUS UI — ORGANISMS · PageHeader.jsx
 * Cabecera de página con título display, subtítulo y acción principal.
 *
 * Props:
 *   title    — título principal (display grande)
 *   subtitle — línea secundaria en estilo label
 *   action   — nodo React con el botón de acción (opcional)
 *
 * Uso:
 *   <PageHeader
 *     title="Clientes"
 *     subtitle="Gestión de base de datos"
 *     action={<Button variant="clip" icon="+">Nuevo</Button>}
 *   />
 */

import { Text } from "../atoms/Text";

export function PageHeader({ title, subtitle, action }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 32,
      }}
    >
      <div>
        <Text as="h2" variant="display" style={{ fontSize: 24, letterSpacing: "-0.02em" }}>
          {title}
        </Text>
        {subtitle && (
          <Text
            variant="label"
            color="cyan"
            style={{ marginTop: 6, display: "block", letterSpacing: 1 }}
          >
            {subtitle}
          </Text>
        )}
      </div>
      {action}
    </div>
  );
}
