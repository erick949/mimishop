/**
 * NEXUS UI — TEMPLATES · ClientesTableTemplate.jsx
 * Template completo de página de clientes: header, toolbar y tabla.
 *
 * Props:
 *   rows      — array de <tr> ya construidos (nodos React)
 *   loading   — boolean, muestra spinner en lugar de tabla
 *   emptyText — texto cuando no hay filas
 *   search    — valor del buscador
 *   onSearch  — handler(string)
 *   sortBy    — valor del select de ordenamiento
 *   onSortBy  — handler(string)
 *   order     — "asc" | "desc"
 *   onOrder   — handler para alternar orden
 *   total     — número total de resultados
 *   onNew     — handler del botón "Nuevo cliente"
 */

import { TOKENS }       from "../tokens";
import { Button }       from "../atoms/Button";
import { Spinner }      from "../atoms/Spinner";
import { Text }         from "../atoms/Text";
import { SelectInput }  from "../atoms/SelectInput";
import { SearchBar }    from "../molecules/SearchBar";
import { PageHeader }   from "../organisms/PageHeader";
import { ListLayout }   from "./ListLayout";

export function ClientesTableTemplate({
  rows = [],
  loading = false,
  emptyText = "Sin registros",
  search,
  onSearch,
  sortBy,
  onSortBy,
  order,
  onOrder,
  total,
  onNew,
}) {
  return (
    <ListLayout>
      {/* ── Header ── */}
      <PageHeader
        title="Clientes"
        subtitle="Gestión de base de datos de clientes"
        action={
          <Button variant="clip" size="md" color="cyan" icon="+" onClick={onNew}>
            Nuevo cliente
          </Button>
        }
      />

      {/* ── Toolbar ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 20,
          flexWrap: "wrap",
        }}
      >
        <SearchBar
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Buscar por nombre o ID..."
        />
        <SelectInput
          value={sortBy}
          onChange={(e) => onSortBy(e.target.value)}
          options={[
            { value: "nombre", label: "Ordenar: Nombre" },
            { value: "fecha",  label: "Ordenar: Fecha"  },
          ]}
        />
        <Button variant="ghost" size="sm" onClick={onOrder}>
          {order === "asc" ? "⬆ ASC" : "⬇ DESC"}
        </Button>
        <div
          style={{
            fontSize: 12,
            letterSpacing: 1,
            color: TOKENS.textMuted,
            fontFamily: TOKENS.fontMono,
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ color: TOKENS.cyan }}>{total}</span> resultados
        </div>
      </div>

      {/* ── Tabla ── */}
      <div
        style={{
          background: TOKENS.bgPanel,
          border: `1px solid ${TOKENS.borderSubtle}`,
          overflow: "hidden",
          borderRadius: TOKENS.radiusSm,
        }}
      >
        {loading ? (
          <div style={{ padding: 60, textAlign: "center" }}>
            <Spinner size={32} label="// CARGANDO DATOS..." />
          </div>
        ) : rows.length === 0 ? (
          <div style={{ padding: 60, textAlign: "center" }}>
            <Text variant="label" style={{ letterSpacing: 3 }}>{emptyText}</Text>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  background: TOKENS.bgLevel3,
                  borderBottom: `1px solid ${TOKENS.borderMedium}`,
                }}
              >
                {["Cliente", "Estado", "Registrado", ""].map((h) => (
                  <th
                    key={h}
                    style={{
                      fontFamily: TOKENS.fontDisplay,
                      fontSize: 10,
                      letterSpacing: 2,
                      textTransform: "uppercase",
                      color: TOKENS.textMuted,
                      padding: "14px 18px",
                      textAlign: "left",
                      fontWeight: 600,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </table>
        )}
      </div>
    </ListLayout>
  );
}
