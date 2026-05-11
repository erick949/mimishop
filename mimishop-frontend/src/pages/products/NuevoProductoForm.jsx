import { Modal, Field } from '../../components/ui';

const EMPTY_PROD = { nombre: '', descripcion: '', precio: '', proveedor: '', categoria: '', activo: true };

export { EMPTY_PROD };

export default function NuevoProductoForm({
  open,
  onClose,
  form,
  onChange,
  onSave,
  provOpts,
  catOpts,
}) {
  return (
    <Modal open={open} title="Producto" onClose={onClose}>
      <Field label="Nombre"    name="nombre"    value={form.nombre}    onChange={onChange} />
      <Field label="Proveedor" name="proveedor" value={form.proveedor} onChange={onChange} options={provOpts} />
      <Field label="Categoría" name="categoria" value={form.categoria} onChange={onChange} options={catOpts} />
      <Field label="Precio"    name="precio"    type="number" value={form.precio} onChange={onChange} />

      <textarea
        className="form-input"
        name="descripcion"
        value={form.descripcion}
        onChange={onChange}
        placeholder="Descripción..."
      />

      <label className="form-check">
        <input type="checkbox" name="activo" checked={!!form.activo} onChange={onChange} />
        <span className="form-check-label">Activo</span>
      </label>

      <div className="form-footer">
        <button className="btn-save"   onClick={onSave}>Guardar</button>
        <button className="btn-cancel" onClick={onClose}>Cancelar</button>
      </div>
    </Modal>
  );
}