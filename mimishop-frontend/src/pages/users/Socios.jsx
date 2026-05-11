import { useState, useEffect } from 'react';
import api from '../../api';
import { Table, Modal, Field, Badge, Confirm } from '../../components/ui';
import { useApp } from '../../context/AppContext';

const EMPTY = { nombre: '', porcentaje_comision: '', activo: true };

export default function Socios() {
  const { showToast } = useApp();

  const [socios, setSocios] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [confirm, setConfirm] = useState(null);

  const [selected, setSelected] = useState(null);
  const [comisiones, setComisiones] = useState([]);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const data = await api.socios.list();
      setSocios(data?.results ?? data ?? []);
    } catch (e) {
      showToast(e.message, 'error');
    }
    setLoading(false);
  }

  async function openDetail(socio) {
    setSelected(socio);
    const c = await api.comisiones.list(`?socio=${socio.id_socio}`);
    setComisiones(c?.results ?? c ?? []);
  }

  function onChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  }

  async function save() {
    try {
      if (modal === 'new') await api.socios.create(form);
      else await api.socios.update(form.id_socio, form);

      showToast('Socio guardado');
      setModal(null);
      load();
    } catch (e) {
      showToast(e.message, 'error');
    }
  }

  async function remove(row) {
    try {
      await api.socios.delete(row.id_socio);
      showToast('Socio eliminado');
      setConfirm(null);
      load();
    } catch (e) {
      showToast(e.message, 'error');
    }
  }

  const columns = [
    { key: 'id_socio', label: 'ID' },

    {
      key: 'nombre',
      label: 'Nombre',
      render: r => (
        <span style={{
          fontFamily: 'Orbitron',
          color: 'var(--accent)'
        }}>
          {r.nombre}
        </span>
      )
    },

    {
      key: 'porcentaje_comision',
      label: 'Comisión',
      render: r => `${r.porcentaje_comision}%`
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
    },

    {
      key: 'created_at',
      label: 'Creado',
      render: r => r.created_at?.split('T')[0]
    },

    {
      key: 'ver',
      label: '',
      render: r => (
        <button
          className="btn-sort"
          onClick={() => openDetail(r)}
        >
          Ver →
        </button>
      )
    }
  ];

  const comisionColumns = [
    { key: 'id_comision', label: 'ID' },
    { key: 'pedido', label: 'Pedido', render: r => `#${r.pedido}` },
    { key: 'monto_comision', label: 'Monto', render: r => `$${parseFloat(r.monto_comision || 0).toFixed(2)}` },
    {
      key: 'estado',
      label: 'Estado',
      render: r => (
        <Badge
          text={r.estado}
          color={r.estado === 'pagado' ? 'green' : 'yellow'}
        />
      )
    },
    { key: 'fecha_calculo', label: 'Calculado', render: r => r.fecha_calculo?.split('T')[0] || '—' },
    { key: 'fecha_pago', label: 'Pagado', render: r => r.fecha_pago?.split('T')[0] || '—' },
  ];

  return (
    <div className="clientes-root socios-root">

      {/* HEADER */}
      {!selected && (
        <div className="cl-header">
          <div className="cl-title">Socios</div>

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
      )}

      {/* LISTA */}
      {!selected && (
        <div className="cl-table-wrap">
          <Table
            columns={columns}
            data={socios}
            loading={loading}
            onEdit={r => { setForm(r); setModal('edit'); }}
            onDelete={r => setConfirm(r)}
          />
        </div>
      )}

      {/* DETALLE */}
      {selected && (
        <div className="profile-card">

          <div className="pf-banner">
            <div className="pf-banner-line"></div>
          </div>

          <div className="pf-head">
            <div className="pf-avatar">
              {selected.nombre?.charAt(0)}
            </div>

            <div className="pf-info">
              <div className="pf-name">{selected.nombre}</div>

              <div className="pf-meta">
                <span className="pf-id">SOCIO</span>

                <Badge
                  text={`${selected.porcentaje_comision}% comisión`}
                  color="purple"
                />
              </div>
            </div>

            <button
              className="pf-close"
              onClick={() => setSelected(null)}
            >
              ✕
            </button>
          </div>

          <div className="pf-body">

            <div className="pf-section-header">
              <div className="pf-section-title">
                Comisiones
              </div>
            </div>

            <div className="cl-table-wrap">
              <Table
                columns={comisionColumns}
                data={comisiones}
              />
            </div>

          </div>
        </div>
      )}

      {/* MODAL */}
      <Modal open={!!modal} title="Socio" onClose={() => setModal(null)}>

        <Field
          label="Nombre"
          name="nombre"
          value={form.nombre}
          onChange={onChange}
        />

        <Field
          label="Comisión (%)"
          name="porcentaje_comision"
          type="number"
          value={form.porcentaje_comision}
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
          <button className="btn-save" onClick={save}>Guardar</button>
          <button className="btn-cancel" onClick={() => setModal(null)}>Cancelar</button>
        </div>

      </Modal>

      {/* CONFIRM */}
      <Confirm
        open={!!confirm}
        message={`Eliminar socio "${confirm?.nombre}"`}
        onConfirm={() => remove(confirm)}
        onCancel={() => setConfirm(null)}
      />

    </div>
  );
}