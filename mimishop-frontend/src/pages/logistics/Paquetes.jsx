

import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../api';
import { Table, Modal, Field, Badge } from '../../components/ui';
import { useApp } from '../../context/AppContext';

const EMPTY = {
  producto: '',
  proveedor: '',
  estado: '',
  codigo_activacion: '',
  fecha_pedido_proveedor: '',
  fecha_entrega_proveedor: ''
};

export default function Paquetes() {
  const { showToast } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const [paquetes, setPaquetes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);

  const [selected, setSelected] = useState(null);
  const [historial, setHistorial] = useState([]);

  const [estados, setEstados] = useState([]);
  const [productos, setProductos] = useState([]);
  const [proveedores, setProveedores] = useState([]);

  const [statusModal, setStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState({ estado: '', nota: '' });

  // 🔍 filtros
  const [search, setSearch] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('all');
  const [provFilter, setProvFilter] = useState('all');
  const [entregaFilter, setEntregaFilter] = useState('all');
  const [orden, setOrden] = useState('default');

  useEffect(() => {
    load();

    Promise.allSettled([
      api.estadosPaquete.list(),
      api.productos.list(),
      api.proveedores.list(),
    ]).then(([e, p, pr]) => {
      setEstados(e.value?.results ?? e.value ?? []);
      setProductos(p.value?.results ?? p.value ?? []);
      setProveedores(pr.value?.results ?? pr.value ?? []);
    });
  }, []);


  useEffect(() => {
  if (location.pathname === '/paquetes/nuevo') {
    setForm(EMPTY);
    setModal('new');
  }
}, [location.pathname]);

  async function load() {
    setLoading(true);
    try {
      const data = await api.paquetes.list();
      setPaquetes(data?.results ?? data ?? []);
    } catch (e) {
      showToast(e.message, 'error');
    }
    setLoading(false);
  }

  async function openDetail(paquete) {
    setSelected(paquete);
    const his = await api.historialPaquete.list(`?paquete=${paquete.id_paquete}`);
    setHistorial(his?.results ?? his ?? []);
  }

  function onChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function save() {
    try {
      const payload = {
        ...form,
        fecha_pedido_proveedor: form.fecha_pedido_proveedor || null,
        fecha_entrega_proveedor: form.fecha_entrega_proveedor || null,
      };

      if (modal === 'new') await api.paquetes.create(payload);
      else await api.paquetes.update(form.id_paquete, payload);

      showToast('Paquete guardado');
      setModal(null);
      load();
    } catch (e) {
      showToast(e.message, 'error');
    }
  }

  async function changeStatus() {
    await api.historialPaquete.create({
      paquete: selected.id_paquete,
      estado: newStatus.estado,
      nota: newStatus.nota,
      fecha_cambio: new Date().toISOString(),
    });

    await api.paquetes.update(selected.id_paquete, { estado: newStatus.estado });

    showToast('Estado actualizado');
    setStatusModal(false);
    openDetail(selected);
  }

  const hoy = new Date().toISOString().split('T')[0];

  // 🧠 FILTRO PRO
  const filtrados = useMemo(() => {
    let data = [...paquetes];

    if (search) {
      const s = search.toLowerCase();
      data = data.filter(r =>
        r.producto_nombre?.toLowerCase().includes(s) ||
        r.proveedor_nombre?.toLowerCase().includes(s) ||
        r.codigo_activacion?.toLowerCase().includes(s)
      );
    }

    if (estadoFilter !== 'all') {
      data = data.filter(r => r.estado == estadoFilter);
    }

    if (provFilter !== 'all') {
      data = data.filter(r => r.proveedor == provFilter);
    }

    if (entregaFilter !== 'all') {
      data = data.filter(r => {
        const entregado = r.fecha_entrega_proveedor && r.fecha_entrega_proveedor <= hoy;
        return entregaFilter === 'entregado' ? entregado : !entregado;
      });
    }

    if (orden === 'reciente') data.reverse();

    return data;
  }, [paquetes, search, estadoFilter, provFilter, entregaFilter, orden]);

  const estadoOpts = estados.map(e => ({ value: e.id_estado_paquete, label: e.descripcion }));
  const productoOpts = productos.map(p => ({ value: p.id_producto, label: p.nombre }));
  const provOpts = proveedores.map(p => ({ value: p.id_proveedor, label: p.nombre }));

  const columns = [
    { key: 'id_paquete', label: 'ID' },
    { key: 'producto', label: 'Producto', render: r => r.producto_nombre },
    { key: 'proveedor', label: 'Proveedor', render: r => r.proveedor_nombre },
    { key: 'estado', label: 'Estado', render: r => <Badge text={r.estado_nombre} color="blue" /> },
    { key: 'codigo_activacion', label: 'Código' },
    {
      key: 'fecha_entrega_proveedor',
      label: 'Entrega',
      render: r => r.fecha_entrega_proveedor?.split('T')[0] || '—'
    },
    { key: 'ver', label: '', render: r => <button className="btn-link" onClick={() => openDetail(r)}>Historial →</button> },
  ];

  return (
    <div className="clientes-root">

      {/* HEADER */}
      <div className="cl-header">
        <div className="cl-title">Logística / Paquetes</div>

        <button
          className="btn-new"
          onClick={() => {
            setForm(EMPTY);
            setModal('new');

            if (location.pathname !== '/paquetes/nuevo') {
              navigate('/paquetes/nuevo');
            }
          }}
        >
          <span>+ Nuevo</span>
        </button>
      </div>

      {!selected && (
        <>
          {/* TOOLBAR */}
          <div className="cl-toolbar">

            <div className="search-wrap">
              <span className="search-icon">⌕</span>
              <input
                className="cl-search"
                placeholder="Buscar producto, proveedor o código..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <select className="cl-select" onChange={e => setEstadoFilter(e.target.value)}>
              <option value="all">Estado</option>
              {estadoOpts.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
            </select>

            <select className="cl-select" onChange={e => setProvFilter(e.target.value)}>
              <option value="all">Proveedor</option>
              {provOpts.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>

            <select className="cl-select" onChange={e => setEntregaFilter(e.target.value)}>
              <option value="all">Entrega</option>
              <option value="pendiente">Pendiente</option>
              <option value="entregado">Entregado</option>
            </select>

            <button className="btn-sort" onClick={() => setOrden(o => o === 'reciente' ? 'default' : 'reciente')}>
              Orden reciente
            </button>

            <div className="cl-count">
              {filtrados.length} paquetes
            </div>

          </div>

          {/* TABLA */}
          <div className="cl-table-wrap">
            <Table
              columns={columns}
              data={filtrados}
              loading={loading}
              onEdit={r => { setForm(r); setModal('edit'); }}
            />
          </div>
        </>
      )}

      {/* DETALLE */}
      {selected && (
        <div>
          <div className="pf-section-header">
            <button className="btn-link" onClick={() => setSelected(null)}>← Volver</button>
            <button className="btn-new" onClick={() => setStatusModal(true)}>
              <span>Cambiar estado</span>
            </button>
          </div>

          <div className="cl-table-wrap" style={{ padding: 20 }}>
            <div className="info-grid">
              <div><strong>Producto:</strong> {selected.producto_nombre}</div>
              <div><strong>Proveedor:</strong> {selected.proveedor_nombre}</div>
              <div><strong>Código:</strong> {selected.codigo_activacion}</div>
              <div><strong>Entrega:</strong> {selected.fecha_entrega_proveedor}</div>
            </div>
          </div>

          <div className="cl-table-wrap">
            <Table columns={[
              { key: 'fecha_cambio', label: 'Fecha', render: r => r.fecha_cambio?.split('T')[0] },
              { key: 'estado', label: 'Estado', render: r => r.estado_nombre },
              { key: 'usuario', label: 'Usuario', render: r => r.usuario_nombre },
              { key: 'nota', label: 'Nota' },
            ]} data={historial} />
          </div>
        </div>
      )}

      {/* MODAL */}
      <Modal
        open={!!modal}
        title="Paquete"
        onClose={() => {
          setModal(null);
          navigate('/paquetes');
        }}
      >
        <Field label="Producto" name="producto" value={form.producto} onChange={onChange} options={productoOpts} />
        <Field label="Proveedor" name="proveedor" value={form.proveedor} onChange={onChange} options={provOpts} />
        <Field label="Estado" name="estado" value={form.estado} onChange={onChange} options={estadoOpts} />
        <Field label="Código" name="codigo_activacion" value={form.codigo_activacion} onChange={onChange} />
        <Field label="Fecha pedido" name="fecha_pedido_proveedor" type="date" value={form.fecha_pedido_proveedor} onChange={onChange} />
        <Field label="Entrega" name="fecha_entrega_proveedor" type="date" value={form.fecha_entrega_proveedor} onChange={onChange} />

        <div className="form-footer">
          <button className="btn-save" onClick={save}>Guardar</button>
          <button
            className="btn-cancel"
            onClick={() => {
              setModal(null);
              navigate('/paquetes');
            }}
          >Cancelar</button>
        </div>
      </Modal>

      {/* CAMBIO ESTADO */}
      <Modal open={statusModal} title="Cambiar estado" onClose={() => setStatusModal(false)}>
        <Field label="Estado" value={newStatus.estado}
          onChange={e => setNewStatus(s => ({ ...s, estado: e.target.value }))} options={estadoOpts} />

        <div className="field">
          <label>Nota</label>
          <textarea value={newStatus.nota}
            onChange={e => setNewStatus(s => ({ ...s, nota: e.target.value }))} />
        </div>

        <div className="form-footer">
          <button className="btn-save" onClick={changeStatus}>Guardar</button>
          <button className="btn-cancel" onClick={() => setStatusModal(false)}>Cancelar</button>
        </div>
      </Modal>

    </div>
  );
}