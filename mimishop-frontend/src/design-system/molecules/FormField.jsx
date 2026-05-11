/**
 * NEXUS UI — MOLECULES · FormField.jsx
 * Wrapper de campo de formulario: Label + input + mensaje de error.
 *
 * Props:
 *   label     — texto del label (opcional)
 *   required  — boolean, muestra asterisco rojo en el label
 *   error     — string con mensaje de error (opcional)
 *   children  — el átomo de input (Input, SelectInput, TextArea…)
 *
 * Uso:
 *   <FormField label="Email" required error="Campo obligatorio">
 *     <Input ... />
 *   </FormField>
 */

import { TOKENS } from "../tokens";
import { Label } from "../atoms/Label";
import { Text }  from "../atoms/Text";

export function FormField({ label, required, error, children, style = {} }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, ...style }}>
      {label && <Label required={required}>{label}</Label>}
      {children}
      {error && (
        <Text variant="caption" style={{ color: TOKENS.red }}>
          {error}
        </Text>
      )}
    </div>
  );
}
