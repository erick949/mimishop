/**
 * NEXUS UI — ORGANISMS · DataTable.jsx
 * Tabla de datos completa con cabecera, filas hover y estado vacío.
 * Requiere injectGlobalStyles() para los estilos .nexus-tr y .nexus-row-bar-cell.
 *
 * Props:
 *   title       — título del bloque
 *   subtitle    — subtítulo opcional
 *   actionLabel — texto del botón de acción (opcional)
 *   onAction    — handler del botón de acción
 *   columns     — array de strings con los encabezados
 *   rows        — array de arrays; cada inner-array son las celdas (nodos React)
 *   emptyText   — texto cuando no hay filas
 */

import { TOKENS } from "../tokens";
import { Text }   from "../atoms/Text";
import { Button } from "../atoms/Button";
import { Card }   from "../molecules/Card";

export function DataTable({
  title,
  subtitle,
  actionLabel,
  onAction,
  columns = [],
  rows = [],
  emptyText = "Sin datos",
  style = {},
}) {
  return (
    <Card style={style}>
      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <div>
          <Text as="h3" variant="label" style={{ fontSize: 13, color: "#fff" }}>
            {title}
          </Text>
          {subtitle && (
            <Text variant="caption" style={{ marginTop: 4, display: "block" }}>
              {subtitle}
            </Text>
          )}
        </div>
        {actionLabel && (
          <Button variant="ghost" size="sm" onClick={onAction}>
            {actionLabel} →
          </Button>
        )}
      </div>

      {/* ── Body ── */}
      {rows.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            color: TOKENS.textMuted,
            padding: "40px 0",
            fontSize: 13,
          }}
        >
          {emptyText}
        </div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  style={{
                    color: TOKENS.textMuted,
                    fontWeight: 600,
                    textAlign: "left",
                    padding: "10px 12px",
                    borderBottom: `1px solid ${TOKENS.borderAccent}`,
                    fontSize: 10,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    fontFamily: TOKENS.fontMono,
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className="nexus-tr"
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(0,243,255,0.03)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                {row.map((cell, j) => (
                  <td
                    key={j}
                    className={j === 0 ? "nexus-row-bar-cell" : undefined}
                    style={{
                      padding: "12px",
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                      verticalAlign: "middle",
                      position: "relative",
                    }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Card>
  );
}