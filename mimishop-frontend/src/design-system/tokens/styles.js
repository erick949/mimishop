/**
 * NEXUS UI — TOKENS · styles.js
 * CSS global: reset, variables :root, scrollbar, animaciones y clases utilitarias.
 * Se inyecta en <head> una sola vez al arrancar la app.
 *
 * Uso:
 *   import { injectGlobalStyles } from "@/design-system/tokens";
 *   // Llámalo en el entry point, p.ej. main.jsx o App.jsx:
 *   injectGlobalStyles();
 */

import { TOKENS } from "./colors";
import { TYPOGRAPHY } from "./typography";

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Rajdhani:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── Variables CSS globales ─────────────── */
  :root {
    --bg-base:    ${TOKENS.bgBase};
    --bg-1:       ${TOKENS.bgLevel1};
    --bg-2:       ${TOKENS.bgLevel2};
    --bg-3:       ${TOKENS.bgLevel3};
    --bg-panel:   ${TOKENS.bgPanel};

    --border:     ${TOKENS.borderSubtle};
    --border-2:   ${TOKENS.borderMedium};
    --border-acc: ${TOKENS.borderAccent};

    --cyan:       ${TOKENS.cyan};
    --magenta:    ${TOKENS.magenta};
    --green:      ${TOKENS.green};
    --red:        ${TOKENS.red};
    --yellow:     ${TOKENS.yellow};
    --blue:       ${TOKENS.blue};

    --text:       ${TOKENS.textPrimary};
    --text-dim:   ${TOKENS.textMuted};

    --font-mono:  ${TYPOGRAPHY.fontMono};
    --font-disp:  ${TYPOGRAPHY.fontDisplay};
    --font-body:  ${TYPOGRAPHY.fontBody};
  }

  /* ── Base ───────────────────────────────── */
  body {
    font-family: var(--font-body);
    background: var(--bg-base);
    color: var(--text);
    -webkit-font-smoothing: antialiased;
  }

  /* ── Scrollbar ──────────────────────────── */
  ::-webkit-scrollbar       { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg-1); }
  ::-webkit-scrollbar-thumb { background: var(--border-2); border-radius: 2px; }

  /* ── Animaciones ────────────────────────── */
  @keyframes spin       { to { transform: rotate(360deg); } }
  @keyframes pulse-glow { 0%,100%{opacity:.4} 50%{opacity:1} }
  @keyframes fadeIn     { from{opacity:0} to{opacity:1} }
  @keyframes slideUp {
    from { opacity:0; transform: translate(-50%, calc(-50% + 20px)); }
    to   { opacity:1; transform: translate(-50%, -50%); }
  }
  @keyframes scanline {
    0%   { transform: translateY(-100%); }
    100% { transform: translateY(100vh); }
  }
  @keyframes glitch {
    0%,100%{ clip-path: inset(0 0 100% 0); transform: translateX(0); }
    20%    { clip-path: inset(10% 0 60% 0); transform: translateX(-4px); }
    40%    { clip-path: inset(50% 0 20% 0); transform: translateX(4px); }
    60%    { clip-path: inset(80% 0 5%  0); transform: translateX(-2px); }
    80%    { clip-path: inset(25% 0 70% 0); transform: translateX(2px); }
  }
  @keyframes bootup {
    0%   { opacity: 0; letter-spacing: 8px; }
    50%  { opacity: 1; letter-spacing: 4px; }
    100% { opacity: 1; letter-spacing: 2px; }
  }
  @keyframes borderFlash {
    0%,100% { border-color: rgba(0,243,255,0.15); }
    50%     { border-color: rgba(0,243,255,0.6);  }
  }

  /* ── Utilidad: fondo de cuadrícula ──────── */
  .nexus-grid-bg::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(rgba(0,243,255,.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,243,255,.025) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
    z-index: 0;
  }
  .nexus-grid-bg > * { position: relative; z-index: 1; }

  /* ── Utilidad: barra superior de card ───── */
  .nexus-card-accent-top::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, currentColor, transparent);
    opacity: 0.7;
  }

  /* ── Utilidad: fila de tabla con hover ──── */
  .nexus-tr { transition: background .15s; }
  .nexus-tr:hover { background: rgba(0, 243, 255, 0.03) !important; }
  .nexus-tr .nexus-row-bar {
    position: absolute; left: 0; top: 0; bottom: 0;
    width: 2px; background: var(--cyan); opacity: 0; transition: opacity .15s;
  }
  .nexus-tr:hover .nexus-row-bar { opacity: 1; }
`;

export function injectGlobalStyles() {
  if (document.getElementById("nexus-ds-global")) return;
  const el = document.createElement("style");
  el.id    = "nexus-ds-global";
  el.textContent = GLOBAL_CSS;
  document.head.appendChild(el);
}
