import { useState, useEffect } from 'react';
import api from '../../api';
import { Table, Modal, Field, Confirm } from '../../components/ui';
import { useApp } from '../../context/AppContext';

const EMPTY = { nombre: '', sitio_web: '' };

export default function Proveedores() {
  const { showToast } = useApp();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [confirm, setConfirm] = useState(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await api.proveedores.list();
      setData(res?.results ?? res ?? []);
    } catch (e) {
      showToast(e.message, 'error');
    }
    setLoading(false);
  }

  function onChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function save() {
    try {
      if (modal === 'new') await api.proveedores.create(form);
      else await api.proveedores.update(form.id_proveedor, form);

      showToast('Proveedor guardado');
      setModal(null);
      load();
    } catch (e) {
      showToast(e.message, 'error');
    }
  }

  async function remove(row) {
    try {
      await api.proveedores.delete(row.id_proveedor);
      showToast('Proveedor eliminado');
      setConfirm(null);
      load();
    } catch (e) {
      showToast(e.message, 'error');
    }
  }

  const columns = [
    { key: 'id_proveedor', label: 'ID' },
    { key: 'nombre', label: 'Nombre' },

    {
      key: 'sitio_web',
      label: 'Sitio',
      render: r =>
        r.sitio_web ? (
          <a
            href={r.sitio_web}
            target="_blank"
            rel="noreferrer"
            style={{
              color: 'var(--accent)',
              textDecoration: 'none',
              fontFamily: 'Orbitron',
              fontSize: '12px',
              letterSpacing: '1px'
            }}
          >
            {r.sitio_web}
          </a>
        ) : '—'
    },

    {
      key: 'created_at',
      label: 'Creado',
      render: r => r.created_at?.split('T')[0]
    }
  ];

  return (
    <div className="clientes-root proveedores-root">

      {/* HEADER */}
      <div className="cl-header">
        <div className="cl-title">Proveedores</div>

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
          data={data}
          loading={loading}
          onEdit={r => { setForm(r); setModal('edit'); }}
          onDelete={r => setConfirm(r)}
        />
      </div>

      {/* MODAL */}
      <Modal open={!!modal} title="Proveedor" onClose={() => setModal(null)}>

        <Field
          label="Nombre"
          name="nombre"
          value={form.nombre}
          onChange={onChange}
        />

        <Field
          label="Sitio web"
          name="sitio_web"
          type="url"
          value={form.sitio_web}
          onChange={onChange}
        />

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
        message={`Eliminar "${confirm?.nombre}"`}
        onConfirm={() => remove(confirm)}
        onCancel={() => setConfirm(null)}
      />

    </div>
  );
}