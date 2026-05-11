/**
 * NEXUS UI — ORGANISMS · TabBar.jsx
 * Barra de pestañas con indicador de línea inferior activa.
 *
 * Props:
 *   tabs     — array de { key: string, label: string }
 *   active   — key de la pestaña activa
 *   onChange — handler(key: string)
 *
 * Uso:
 *   const [tab, setTab] = useState("info");
 *   <TabBar
 *     tabs={[{ key: "info", label: "Info" }, { key: "docs", label: "Docs" }]}
 *     active={tab}
 *     onChange={setTab}
 *   />
 */

import { TOKENS } from "../tokens";

export function TabBar({ tabs = [], active, onChange }) {
  return (
    <div
      style={{
        display: "flex",
        borderBottom: `1px solid ${TOKENS.borderSubtle}`,
        gap: 4,
      }}
    >
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          style={{
            fontFamily: TOKENS.fontBody,
            fontWeight: 600,
            fontSize: 12,
            letterSpacing: 2,
            textTransform: "uppercase",
            padding: "10px 18px",
            background: "transparent",
            border: "none",
            color: active === t.key ? TOKENS.cyan : TOKENS.textMuted,
            cursor: "pointer",
            borderBottom: `2px solid ${active === t.key ? TOKENS.cyan : "transparent"}`,
            marginBottom: -1,
            transition: TOKENS.transBase,
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
