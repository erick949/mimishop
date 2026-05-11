import { useState, useEffect } from 'react';
import api from '../../api';
import { Table, Modal, Field, Badge, Confirm } from '../../components/ui';
import { useApp } from '../../context/AppContext';

const EMPTY = { usuario: '', password: '', nivel_acceso: '1', socio: '', activo: true };

const NIVELES = [
  { value: '1', label: 'Nivel 1 - Básico' },
  { value: '2', label: 'Nivel 2 - Operador' },
  { value: '3', label: 'Nivel 3 - Admin' },
];

export default function Usuarios() {
  const { showToast } = useApp();

  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [confirm, setConfirm] = useState(null);

  const [socios, setSocios] = useState([]);

  useEffect(() => {
    load();
    api.socios.list().then(d => setSocios(d?.results ?? d ?? []));
  }, []);

  async function load() {
    setLoading(true);
    try {
      const data = await api.usuarios.list();
      setUsuarios(data?.results ?? data ?? []);
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
      const payload = { ...form };

      if (modal === 'edit' && !payload.password) delete payload.password;

      if (modal === 'new') await api.usuarios.create(payload);
      else await api.usuarios.update(form.id_usuario, payload);

      showToast(`Usuario ${modal === 'new' ? 'creado' : 'actualizado'}`);
      setModal(null);
      load();

    } catch (e) {
      showToast(e.message, 'error');
    }
  }

  async function remove(row) {
    try {
      await api.usuarios.delete(row.id_usuario);
      showToast('Usuario eliminado');
      setConfirm(null);
      load();
    } catch (e) {
      showToast(e.message, 'error');
    }
  }

  const socioOpts = socios.map(s => ({
    value: s.id_socio,
    label: s.nombre
  }));

  const columns = [
    { key: 'id_usuario', label: 'ID' },

    {
      key: 'usuario',
      label: 'Usuario',
      render: r => (
        <span style={{
          fontFamily: 'Orbitron',
          letterSpacing: '1.5px',
          color: 'var(--accent)'
        }}>
          {r.usuario}
        </span>
      )
    },

    {
      key: 'socio',
      label: 'Socio',
      render: r => r.socio_nombre || r.socio || '—'
    },

    {
      key: 'nivel_acceso',
      label: 'Nivel',
      render: r => (
        <Badge
          text={`Nivel ${r.nivel_acceso}`}
          color={r.nivel_acceso === '3' ? 'red' : r.nivel_acceso === '2' ? 'yellow' : 'green'}
        />
      )
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
      key: 'ultimo_login',
      label: 'Último acceso',
      render: r => r.ultimo_login?.split('T')[0] || '—'
    }
  ];

  return (
    <div className="clientes-root usuarios-root">

      {/* HEADER */}
      <div className="cl-header">
        <div className="cl-title">Usuarios del sistema</div>

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
          data={usuarios}
          loading={loading}
          onEdit={r => { setForm({ ...r, password: '' }); setModal('edit'); }}
          onDelete={r => setConfirm(r)}
        />
      </div>

      {/* MODAL */}
      <Modal open={!!modal} title="Usuario" onClose={() => setModal(null)}>

        <Field
          label="Usuario"
          name="usuario"
          value={form.usuario}
          onChange={onChange}
        />

        <Field
          label={modal === 'edit'
            ? 'Nueva contraseña (opcional)'
            : 'Contraseña'}
          name="password"
          type="password"
          value={form.password}
          onChange={onChange}
        />

        <Field
          label="Socio vinculado"
          name="socio"
          value={form.socio}
          onChange={onChange}
          options={socioOpts}
        />

        <Field
          label="Nivel de acceso"
          name="nivel_acceso"
          value={form.nivel_acceso}
          onChange={onChange}
          options={NIVELES}
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
        message={`Eliminar usuario "${confirm?.usuario}"`}
        onConfirm={() => remove(confirm)}
        onCancel={() => setConfirm(null)}
      />

    </div>
  );
}