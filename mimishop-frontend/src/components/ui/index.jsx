// ─── Table ───────────────────────────────────────────────────────
export function Table({ columns, data, onEdit, onDelete, loading }) {
  if (loading) return <div className="loading">Cargando...</div>;
  if (!data?.length) return <div className="empty">Sin registros</div>;
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {columns.map(c => <th key={c.key}>{c.label}</th>)}
            {(onEdit || onDelete) && <th></th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={row.id || i}>
              {columns.map(c => (
                <td key={c.key}>
                  {c.render ? c.render(row) : (row[c.key] ?? '—')}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="actions">
                  {onEdit && (
                    <button className="btn-icon" onClick={() => onEdit(row)} title="Editar">
                      ✏️
                    </button>
                  )}
                  {onDelete && (
                    <button className="btn-icon danger" onClick={() => onDelete(row)} title="Eliminar">
                      🗑
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Modal ───────────────────────────────────────────────────────
export function Modal({ open, title, onClose, children }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

// ─── Field ───────────────────────────────────────────────────────
export function Field({ label, name, value, onChange, type = 'text', options, required }) {
  return (
    <div className="field">
      <label>{label}{required && ' *'}</label>
      {options ? (
        <select name={name} value={value} onChange={onChange} required={required}>
          <option value="">— Seleccionar —</option>
          {options.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
        />
      )}
    </div>
  );
}

// ─── Badge ───────────────────────────────────────────────────────
export function Badge({ text, color = 'default' }) {
  return <span className={`badge badge-${color}`}>{text}</span>;
}

// ─── PageHeader ──────────────────────────────────────────────────
export function PageHeader({ title, action }) {
  return (
    <div className="page-header">
      <h2>{title}</h2>
      {action && <div>{action}</div>}
    </div>
  );
}

// ─── StatCard ─────────────────────────────────────────────────────
export function StatCard({ label, value, icon, color = 'blue' }) {
  return (
    <div className={`stat-card stat-${color}`}>
      <div className="stat-icon">{icon}</div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────
export function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className={`toast toast-${toast.type}`}>
      {toast.type === 'success' ? '✓' : '✗'} {toast.message}
    </div>
  );
}

// ─── Confirm ─────────────────────────────────────────────────────
export function Confirm({ open, message, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal confirm-modal" onClick={e => e.stopPropagation()}>
        <p>{message}</p>
        <div className="confirm-actions">
          <button className="btn btn-danger" onClick={onConfirm}>Eliminar</button>
          <button className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}