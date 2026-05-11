/**
 * NEXUS UI — TEMPLATES · DashboardLayout.jsx
 * Layout base para páginas tipo dashboard con fondo de cuadrícula y gradientes.
 *
 * Uso:
 *   <DashboardLayout>
 *     <KPIGrid ... />
 *     <DataTable ... />
 *   </DashboardLayout>
 */

import { TOKENS } from "../tokens";

export function DashboardLayout({ children }) {
  return (
    <div
      className="nexus-grid-bg"
      style={{
        background: `
          radial-gradient(circle at top right,    rgba(188,19,254,0.1), transparent 40%),
          radial-gradient(circle at bottom left,  rgba(0,243,255,0.1),  transparent 40%),
          ${TOKENS.bgBase}
        `,
        minHeight: "100vh",
        padding: "24px 32px 48px",
        position: "relative",
      }}
    >
      {children}
    </div>
  );
}
