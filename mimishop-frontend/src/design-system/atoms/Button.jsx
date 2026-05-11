/**
 * NEXUS UI — ATOMS · Button.jsx
 * Botón polimórfico con 6 variantes y efecto hover neon.
 *
 * Props:
 *   variant  — "primary" | "secondary" | "ghost" | "danger" | "icon" | "clip"
 *   color    — clave de COLOR_MAP
 *   size     — "sm" | "md" | "lg"
 *   icon     — símbolo opcional (string)
 *   disabled — boolean
 *   onClick  — handler
 */

import { useState } from "react";
import { TOKENS, COLOR_MAP } from "../tokens";
import { Icon } from "./Icon";

export function Button({
  variant = "primary",
  color = "cyan",
  size = "md",
  icon,
  disabled = false,
  onClick,
  children,
  style = {},
}) {
  const [hovered, setHovered] = useState(false);
  const c = COLOR_MAP[color] || COLOR_MAP.cyan;

  const sizes = {
    sm: { padding: "6px 14px",  fontSize: 10, letterSpacing: "0.08em" },
    md: { padding: "10px 22px", fontSize: 12, letterSpacing: "0.12em" },
    lg: { padding: "14px 32px", fontSize: 13, letterSpacing: "0.15em" },
  };

  const base = {
    fontFamily: TOKENS.fontBody,
    fontWeight: 700,
    textTransform: "uppercase",
    cursor: disabled ? "not-allowed" : "pointer",
    border: "none",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    transition: TOKENS.transBase,
    position: "relative",
    opacity: disabled ? 0.4 : 1,
    ...sizes[size],
  };

  const variants = {
    primary: {
      background: hovered ? c.main : "transparent",
      border: `1px solid ${c.main}`,
      color: hovered ? TOKENS.bgBase : c.main,
      boxShadow: hovered ? `0 0 20px ${c.main}55` : `0 0 8px ${c.bg}`,
      clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)",
    },
    secondary: {
      background: hovered ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)",
      border: `1px solid ${hovered ? c.main : TOKENS.borderMedium}`,
      color: hovered ? c.main : TOKENS.textPrimary,
      borderRadius: TOKENS.radiusSm,
      boxShadow: hovered ? `0 0 12px ${c.main}33` : "none",
    },
    ghost: {
      background: "transparent",
      border: `1px solid ${TOKENS.borderMedium}`,
      color: hovered ? TOKENS.textPrimary : TOKENS.textMuted,
      borderRadius: TOKENS.radiusSm,
    },
    danger: {
      background: hovered ? TOKENS.red : "transparent",
      border: `1px solid ${hovered ? TOKENS.red : "rgba(255,0,85,0.4)"}`,
      color: hovered ? "#fff" : TOKENS.red,
      borderRadius: TOKENS.radiusSm,
      boxShadow: hovered ? "0 0 15px rgba(255, 0, 85, 0.4)" : "none",
    },
    icon: {
      background: hovered ? "rgba(255,255,255,0.06)" : "transparent",
      border: `1px solid ${hovered ? c.main : TOKENS.borderSubtle}`,
      color: hovered ? c.main : TOKENS.textMuted,
      borderRadius: TOKENS.radiusSm,
      padding: "6px 10px",
      fontSize: 13,
    },
    clip: {
      background: hovered ? c.main : "transparent",
      border: "none",
      color: hovered ? TOKENS.bgBase : c.main,
      clipPath: "polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)",
      boxShadow: hovered ? `0 0 25px ${c.main}66` : "none",
      ...sizes[size],
    },
  };

  return (
    <button
      style={{ ...base, ...variants[variant], ...style }}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {icon && (
        <Icon
          symbol={icon}
          color={hovered && variant === "primary" ? "inherit" : color}
          size={14}
          glow={false}
          style={{ color: "inherit" }}
        />
      )}
      {children && <span style={{ position: "relative" }}>{children}</span>}
    </button>
  );
}
