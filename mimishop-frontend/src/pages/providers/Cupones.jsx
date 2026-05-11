import { useState, useEffect } from 'react';
import api from '../../api';
import { Table, Modal, Field, Badge, Confirm } from '../../components/ui';
import { useApp } from '../../context/AppContext';

const EMPTY = { proveedor: '', codigo: '', descuento_porcentaje: '', fecha_caducidad: '', activo: true };

export default function Cupones() {
  const { showToast } = useApp();

  const [cupones, setCupones] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [confirm, setConfirm] = useState(null);

  const [proveedores, setProveedores] = useState([]);

  useEffect(() => {
    load();
    api.proveedores.list().then(d => setProveedores(d?.results ?? d ?? []));
  }, []);

  async function load() {
    setLoading(true);
    try {
      const data = await api.cupones.list();
      setCupones(data?.results ?? data ?? []);
    } catch (e) {
      showToast(e.message, 'error');
    }
    setLoading(false);
  }

  function onChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  }

  async function save() {
    try {
      if (modal === 'new') await api.cupones.create(form);
      else await api.cupones.update(form.id_cupon, form);

      showToast('Cupón guardado');
      setModal(null);
      load();
    } catch (e) {
      showToast(e.message, 'error');
    }
  }

  async function remove(row) {
    try {
      await api.cupones.delete(row.id_cupon);
      showToast('Cupón eliminado');
      setConfirm(null);
      load();
    } catch (e) {
      showToast(e.message, 'error');
    }
  }

  const provOpts = proveedores.map(p => ({
    value: p.id_proveedor,
    label: p.nombre
  }));

  const hoy = new Date().toISOString().split('T')[0];

  const columns = [
    { key: 'id_cupon', label: 'ID' },

    {
      key: 'codigo',
      label: 'Código',
      render: r => (
        <span style={{
          fontFamily: 'Orbitron',
          fontSize: '12px',
          letterSpacing: '2px',
          color: 'var(--accent)'
        }}>
          {r.codigo}
        </span>
      )
    },

    {
      key: 'proveedor',
      label: 'Proveedor',
      render: r => r.proveedor_nombre || r.proveedor
    },

    {
      key: 'descuento_porcentaje',
      label: 'Descuento',
      render: r => `${r.descuento_porcentaje}%`
    },

    {
      key: 'fecha_caducidad',
      label: 'Caduca',
      render: r => {
        const vencido = r.fecha_caducidad && r.fecha_caducidad < hoy;

        return (
          <Badge
            text={r.fecha_caducidad || '—'}
            color={vencido ? 'red' : 'green'}
          />
        );
      }
    },

    {
      key: 'activo',
      label: 'Estado',
      render: r => (
        <Badge
          text={r.activo ? 'Activo' : 'Inactivo'}
          color={r.activo ? 'green' : 'red'}
        />
      )
    }
  ];

  return (
    <div className="clientes-root cupones-root">

      {/* HEADER */}
      <div className="cl-header">
        <div className="cl-title">Cupones</div>

        <button
          className="btn-new"
          onClick={() => {
            setForm(EMPTY);
            setModal('new');
          }}
        >
          <span>+ Nuevo</span>
        </button>
      </div>

      {/* TABLA */}
      <div className="cl-table-wrap">
        <Table
          columns={columns}
          data={cupones}
          loading={loading}
          onEdit={r => { setForm(r); setModal('edit'); }}
          onDelete={r => setConfirm(r)}
        />
      </div>

      {/* MODAL */}
      <Modal open={!!modal} title="Cupón" onClose={() => setModal(null)}>

        <Field
          label="Proveedor"
          name="proveedor"
          value={form.proveedor}
          onChange={onChange}
          options={provOpts}
        />

        <Field
          label="Código"
          name="codigo"
          value={form.codigo}
          onChange={onChange}
        />

        <Field
          label="Descuento (%)"
          name="descuento_porcentaje"
          type="number"
          value={form.descuento_porcentaje}
          onChange={onChange}
        />

        <Field
          label="Fecha de caducidad"
          name="fecha_caducidad"
          type="date"
          value={form.fecha_caducidad}
          onChange={onChange}
        />

        <label className="form-check">
          <input
            type="checkbox"
            name="activo"
            checked={!!form.activo}
            onChange={onChange}
          />
          <span className="form-check-label">Activo</span>
        </label>

        <div className="form-footer">
          <button className="btn-save" onClick={save}>
            Guardar
          </button>

          <button className="btn-cancel" onClick={() => setModal(null)}>
            Cancelar
          </button>
        </div>

      </Modal>

      {/* CONFIRM */}
      <Confirm
        open={!!confirm}
        message={`Eliminar cupón "${confirm?.codigo}"`}
        onConfirm={() => remove(confirm)}
        onCancel={() => setConfirm(null)}
      />

    </div>
  );
}