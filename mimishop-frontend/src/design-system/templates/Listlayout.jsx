/**
 * NEXUS UI — TEMPLATES · ListLayout.jsx
 * Layout base para páginas de listado/tabla con fondo sólido y grid CSS.
 *
 * Uso:
 *   <ListLayout>
 *     <PageHeader ... />
 *     <DataTable ... />
 *   </ListLayout>
 */

import { TOKENS } from "../tokens";

export function ListLayout({ children }) {
  return (
    <div
      className="nexus-grid-bg"
      style={{
        fontFamily: TOKENS.fontBody,
        background: TOKENS.bgLevel1,
        minHeight: "100vh",
        color: TOKENS.textPrimary,
        padding: "28px 32px",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      {children}
    </div>
  );
}
