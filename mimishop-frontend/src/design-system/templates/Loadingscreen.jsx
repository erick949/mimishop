/**
 * NEXUS UI — TEMPLATES · LoadingScreen.jsx
 * Pantalla de carga fullscreen con scanline, spinner y barra de progreso.
 *
 * Props:
 *   label — texto mostrado bajo el spinner
 */

import { TOKENS }  from "../tokens";
import { Spinner } from "../atoms/Spinner";
import { Text }    from "../atoms/Text";

export function LoadingScreen({ label = "INICIALIZANDO SISTEMA..." }) {
  return (
    <div
      style={{
        background: TOKENS.bgBase,
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Línea scanline animada */}
      <div
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${TOKENS.cyan}88, transparent)`,
          animation: "scanline 2s linear infinite",
          pointerEvents: "none",
        }}
      />

      <div style={{ textAlign: "center" }}>
        <Spinner size={48} color="cyan" label="" />

        <Text
          variant="label"
          color="cyan"
          style={{
            marginTop: 16,
            letterSpacing: 3,
            display: "block",
            animation: "bootup 1.5s ease forwards",
          }}
        >
          {label}
        </Text>

        {/* Barra de progreso indeterminada */}
        <div
          style={{
            marginTop: 24,
            width: 200,
            height: 2,
            background: "rgba(0,243,255,0.1)",
            borderRadius: 1,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: "40%",
              background: TOKENS.cyan,
              animation: "scanline 1.5s linear infinite",
              boxShadow: `0 0 8px ${TOKENS.cyan}`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
