/**
 * NEXUS UI — MOLECULES · TableRow.jsx
 * Fila de tabla con hover neon y barra lateral izquierda.
 * Requiere que el CSS de `.nexus-tr` y `.nexus-row-bar` esté inyectado
 * mediante injectGlobalStyles() al iniciar la app.
 *
 * Props:
 *   cells   — array de nodos React, uno por celda
 *   onClick — handler opcional (cursor pointer si se pasa)
 *
 * Uso:
 *   <table>
 *     <tbody>
 *       <TableRow cells={["Juan", <Badge color="green">Activo</Badge>, "MX"]} />
 *     </tbody>
 *   </table>
 */

export function TableRow({ cells = [], onClick }) {
  return (
    <tr
      className="nexus-tr"
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default", position: "relative" }}
    >
      <div className="nexus-row-bar" />
      {cells.map((cell, i) => (
        <td
          key={i}
          style={{
            padding: "12px 18px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            fontSize: 13,
            verticalAlign: "middle",
          }}
        >
          {cell}
        </td>
      ))}
    </tr>
  );
}
