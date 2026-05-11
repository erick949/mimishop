/**
 * NEXUS UI — ORGANISMS · ModalForm.jsx
 * Modal de formulario con header, body scrollable y footer de acciones.
 *
 * Props:
 *   title      — título del modal
 *   onClose    — handler para cerrar
 *   onSave     — handler para guardar
 *   saveLabel  — texto del botón primario (default "Guardar")
 *   children   — campos del formulario (FormField, Input…)
 */

import { TOKENS } from "../tokens";
import { Button } from "../atoms/Button";
import { Text }   from "../atoms/Text";

export function ModalForm({ title, onClose, onSave, saveLabel = "Guardar", children }) {
  return (
    <>
      {/* ── Overlay ── */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(6,8,14,.75)",
          backdropFilter: "blur(6px)",
          zIndex: 150,
          animation: "fadeIn .2s ease",
        }}
      />

      {/* ── Modal ── */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          zIndex: 200,
          width: "min(440px, 95vw)",
          background: TOKENS.bgLevel2,
          border: `1px solid ${TOKENS.borderMedium}`,
          borderRadius: TOKENS.radiusMd,
          boxShadow: `0 0 60px rgba(0,243,255,.1), 0 20px 60px rgba(0,0,0,.7)`,
          animation: "slideUp .2s cubic-bezier(.16,1,.3,1)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "18px 24px 16px",
            borderBottom: `1px solid ${TOKENS.borderSubtle}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text
            variant="label"
            style={{ color: TOKENS.cyan, fontSize: 12, letterSpacing: 3 }}
          >
            {title}
          </Text>
          <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
        </div>

        {/* Body */}
        <div
          style={{
            padding: "22px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {children}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: `1px solid ${TOKENS.borderSubtle}`,
            display: "flex",
            gap: 10,
            justifyContent: "flex-end",
          }}
        >
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button variant="primary" onClick={onSave}>{saveLabel}</Button>
        </div>
      </div>
    </>
  );
}
