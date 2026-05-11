/**
 * NEXUS UI — MOLECULES · SearchBar.jsx
 * Input de búsqueda con icono lupa.
 *
 * Props:
 *   value       — valor controlado
 *   onChange    — handler
 *   placeholder — texto placeholder
 */

import { Input } from "../atoms/Input";

export function SearchBar({ value, onChange, placeholder = "Buscar...", style = {} }) {
  return (
    <div style={{ flex: 1, minWidth: 220, ...style }}>
      <Input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        icon="🔍"
      />
    </div>
  );
}
