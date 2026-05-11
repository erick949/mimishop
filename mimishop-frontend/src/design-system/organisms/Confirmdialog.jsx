/**
 * NEXUS UI — ORGANISMS · ConfirmDialog.jsx
 * Diálogo de confirmación destructiva con overlay y dos botones.
 *
 * Props:
 *   message      — pregunta de confirmación
 *   onConfirm    — handler al confirmar
 *   onCancel     — handler al cancelar / cerrar
 *   confirmLabel — texto del botón de confirmación (default "Eliminar")
 *   confirmColor — color del botón de confirmación (default "red")
 */

import { TOKENS } from "../tokens";
import { Button } from "../atoms/Button";
import { Text }   from "../atoms/Text";

export function ConfirmDialog({
  message,
  onConfirm,
  onCancel,
  confirmLabel = "Eliminar",
  confirmColor = "red",
}) {
  return (
    <>
      {/* ── Overlay ── */}
      <div
        onClick={onCancel}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(6,8,14,.75)",
          backdropFilter: "blur(6px)",
          zIndex: 250,
          animation: "fadeIn .2s ease",
        }}
      />

      {/* ── Dialog ── */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          zIndex: 300,
          width: "min(360px, 94vw)",
          background: TOKENS.bgLevel2,
          border: "1px solid rgba(255,0,85,.35)",
          borderRadius: TOKENS.radiusMd,
          boxShadow: `0 0 40px rgba(255,0,85,.1), 0 20px 60px rgba(0,0,0,.7)`,
          animation: "slideUp .2s ease",
          padding: "28px 28px 22px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 36, marginBottom: 14 }}>⚠️</div>
        <Text as="p" variant="body" style={{ lineHeight: 1.6, marginBottom: 22 }}>
          {message}
        </Text>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <Button variant="ghost" onClick={onCancel}>Cancelar</Button>
          <Button variant="danger" color={confirmColor} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </>
  );
}
