import { useState, useEffect } from 'react';
import api from '../../api';
import { Table, Modal, Field, PageHeader, Confirm } from '../../components/ui';
import { useApp } from '../../context/AppContext';

const EMPTY = { nombre: '', descripcion: '' };

export default function Categorias() {
  const { showToast } = useApp();
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [confirm, setConfirm] = useState(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const data = await api.categorias.list();
      setCategorias(data?.results ?? data ?? []);
    } catch (e) { showToast(e.message, 'error'); }
    setLoading(false);
  }

  function onChange(e) { setForm(f => ({ ...f, [e.target.name]: e.target.value })); }

  async function save() {
    try {
      if (modal === 'new') await api.categorias.create(form);
      else await api.categorias.update(form.id_categoria, form);
      showToast('Categoría guardada'); setModal(null); load();
    } catch (e) { showToast(e.message, 'error'); }
  }

  const columns = [
    { key: 'id_categoria', label: 'ID' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'descripcion', label: 'Descripción' },
  ];

  return (
    <div className="page">
      <PageHeader title="Categorías de productos" action={
        <button className="btn btn-primary" onClick={() => { setForm(EMPTY); setModal('new'); }}>
          + Nueva categoría
        </button>
      } />
      <div className="card">
        <Table columns={columns} data={categorias} loading={loading}
          onEdit={r => { setForm(r); setModal('edit'); }}
          onDelete={r => setConfirm(r)} />
      </div>
      <Modal open={!!modal} title={modal === 'new' ? 'Nueva categoría' : 'Editar categoría'} onClose={() => setModal(null)}>
        <Field label="Nombre" name="nombre" value={form.nombre} onChange={onChange} required />
        <div className="field">
          <label>Descripción</label>
          <textarea name="descripcion" value={form.descripcion} onChange={onChange} rows={3} />
        </div>
        <div className="modal-footer">
          <button className="btn btn-primary" onClick={save}>Guardar</button>
          <button className="btn btn-secondary" onClick={() => setModal(null)}>Cancelar</button>
        </div>
      </Modal>
      <Confirm open={!!confirm} message={`¿Eliminar "${confirm?.nombre}"?`}
        onConfirm={async () => { await api.categorias.delete(confirm.id_categoria); setConfirm(null); load(); }}
        onCancel={() => setConfirm(null)} />
    </div>
  );
}