/**
 * NEXUS UI — ORGANISMS · SidePanel.jsx
 * Modal centrado tipo panel de detalle con avatar, banner y acciones.
 *
 * Props:
 *   title    — nombre mostrado en el header (también genera el Avatar)
 *   subtitle — línea secundaria bajo el título
 *   onClose  — handler para cerrar
 *   actions  — nodos React con botones de acción (opcional)
 *   children — contenido del cuerpo del panel
 */

import { TOKENS }  from "../tokens";
import { Avatar }  from "../atoms/Avatar";
import { Button }  from "../atoms/Button";
import { Text }    from "../atoms/Text";

export function SidePanel({ title, subtitle, onClose, children, actions }) {
  return (
    <>
      {/* ── Overlay ── */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(6, 8, 14, 0.75)",
          backdropFilter: "blur(6px)",
          zIndex: 50,
          animation: "fadeIn .2s ease",
        }}
      />

      {/* ── Panel ── */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 100,
          width: "min(780px, 95vw)",
          maxHeight: "90vh",
          overflowY: "auto",
          background: TOKENS.bgLevel2,
          border: `1px solid ${TOKENS.borderMedium}`,
          boxShadow: `0 0 80px rgba(0,243,255,.08), 0 30px 80px rgba(0,0,0,.6)`,
          borderRadius: TOKENS.radiusMd,
          animation: "slideUp .25s cubic-bezier(.16,1,.3,1)",
        }}
      >
        {/* Banner decorativo */}
        <div
          style={{
            height: 90,
            position: "relative",
            overflow: "hidden",
            background:
              "linear-gradient(135deg, #0d1a2e 0%, #0a0f1a 40%, #1a0a2e 100%)",
          }}
        >
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 2,
              background: `linear-gradient(to right, transparent, ${TOKENS.cyan}, ${TOKENS.magenta}, transparent)`,
            }}
          />
        </div>

        {/* Head: avatar + título + acciones */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 20,
            padding: "0 28px 20px",
            marginTop: -38,
          }}
        >
          <Avatar name={title} size={76} />
          <div style={{ flex: 1, paddingBottom: 4 }}>
            <Text as="div" variant="display" style={{ fontSize: 18, marginBottom: 4 }}>
              {title}
            </Text>
            {subtitle && <Text variant="caption">{subtitle}</Text>}
          </div>
          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "flex-end",
              paddingBottom: 4,
            }}
          >
            {actions}
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>
        </div>

        {/* Cuerpo */}
        <div style={{ padding: "0 28px 28px" }}>{children}</div>
      </div>
    </>
  );
}
