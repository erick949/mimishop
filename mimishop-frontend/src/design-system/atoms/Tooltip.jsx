/**
 * NEXUS UI — ATOMS · Tooltip.jsx
 * Tooltip flotante sobre cualquier elemento hijo.
 *
 * Props:
 *   tip      — texto que aparece en el tooltip
 *   children — elemento trigger (wrapeado)
 *
 * Uso:
 *   <Tooltip tip="Información adicional">
 *     <Button>Hover me</Button>
 *   </Tooltip>
 */

import { useState } from "react";
import { TOKENS } from "../tokens";

export function Tooltip({ tip, children }) {
  const [visible, setVisible] = useState(false);

  return (
    <div
      style={{ position: "relative", display: "inline-flex" }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div
          style={{
            position: "absolute",
            bottom: "calc(100% + 8px)",
            left: "50%",
            transform: "translateX(-50%)",
            background: TOKENS.bgLevel2,
            border: `1px solid ${TOKENS.borderMedium}`,
            borderRadius: TOKENS.radiusSm,
            padding: "6px 10px",
            fontFamily: TOKENS.fontMono,
            fontSize: 10,
            color: TOKENS.textPrimary,
            whiteSpace: "nowrap",
            zIndex: 9999,
            boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
            animation: "fadeIn .15s ease",
            pointerEvents: "none",
          }}
        >
          {tip}
        </div>
      )}
    </div>
  );
}
