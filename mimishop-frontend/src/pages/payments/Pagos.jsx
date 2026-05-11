import { useState, useEffect } from 'react';
import api from '../../api';
import { Table, Modal, Field, PageHeader, Badge } from '../../components/ui';
import { useApp } from '../../context/AppContext';

const EMPTY = { pedido: '', monto: '', metodo: '', referencia: '', fecha_pago: '', estado: 'pendiente' };
const METODOS = [
  { value: 'efectivo', label: 'Efectivo' },
  { value: 'transferencia', label: 'Transferencia' },
  { value: 'tarjeta', label: 'Tarjeta' },
  { value: 'otro', label: 'Otro' },
];
const ESTADOS_PAGO = [
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'completado', label: 'Completado' },
  { value: 'cancelado', label: 'Cancelado' },
];

export default function Pagos() {
  const { showToast } = useApp();
  const [pagos, setPagos] = useState([]);
  const [comisiones, setComisiones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [pedidos, setPedidos] = useState([]);
  const [activeTab, setActiveTab] = useState('pagos');

  useEffect(() => {
    load();
    api.pedidos.list().then(d => setPedidos(d?.results ?? d ?? [])).catch(() => {});
  }, []);

  async function load() {
    setLoading(true);
    try {
      const [p, c] = await Promise.allSettled([api.pagos.list(), api.comisiones.list()]);
      setPagos(p.value?.results ?? p.value ?? []);
      setComisiones(c.value?.results ?? c.value ?? []);
    } catch (e) { showToast(e.message, 'error'); }
    setLoading(false);
  }

  function onChange(e) { setForm(f => ({ ...f, [e.target.name]: e.target.value })); }

  async function save() {
    try {
      if (modal === 'new') await api.pagos.create(form);
      else await api.pagos.update(form.id_pago, form);
      showToast('Pago guardado'); setModal(null); load();
    } catch (e) { showToast(e.message, 'error'); }
  }

  const pedidoOpts = pedidos.map(p => ({ value: p.id_pedido, label: `#${p.id_pedido}` }));

  const estadoColor = { pendiente: 'amber', completado: 'green', cancelado: 'red' };

  const pagoColumns = [
    { key: 'id_pago', label: 'ID' },
    { key: 'pedido', label: 'Pedido', render: r => `#${r.pedido}` },
    { key: 'monto', label: 'Monto', render: r => `$${parseFloat(r.monto || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}` },
    { key: 'metodo', label: 'Método', render: r => r.metodo || '—' },
    { key: 'referencia', label: 'Referencia', render: r => r.referencia || '—' },
    { key: 'estado', label: 'Estado', render: r => <Badge text={r.estado} color={estadoColor[r.estado] || 'default'} /> },
    { key: 'fecha_pago', label: 'Fecha', render: r => r.fecha_pago?.split('T')[0] || '—' },
  ];

  const comisionColumns = [
    { key: 'id_comision', label: 'ID' },
    { key: 'pedido', label: 'Pedido', render: r => `#${r.pedido}` },
    { key: 'socio', label: 'Socio', render: r => r.socio_nombre || r.socio },
    { key: 'monto_comision', label: 'Comisión', render: r => `$${parseFloat(r.monto_comision || 0).toFixed(2)}` },
    { key: 'estado', label: 'Estado', render: r => <Badge text={r.estado} color={estadoColor[r.estado] || 'default'} /> },
    { key: 'fecha_calculo', label: 'Calculado', render: r => r.fecha_calculo?.split('T')[0] || '—' },
    { key: 'fecha_pago', label: 'Pagado', render: r => r.fecha_pago?.split('T')[0] || '—' },
  ];

  return (
    <div className="page">
      <PageHeader title="Pagos y Comisiones" action={
        activeTab === 'pagos' && (
          <button className="btn btn-primary" onClick={() => { setForm(EMPTY); setModal('new'); }}>
            + Registrar pago
          </button>
        )
      } />

      <div className="tabs">
        <button className={`tab ${activeTab === 'pagos' ? 'active' : ''}`} onClick={() => setActiveTab('pagos')}>💳 Pagos</button>
        <button className={`tab ${activeTab === 'comisiones' ? 'active' : ''}`} onClick={() => setActiveTab('comisiones')}>🤝 Comisiones</button>
      </div>

      <div className="card">
        {activeTab === 'pagos' && (
          <Table columns={pagoColumns} data={pagos} loading={loading}
            onEdit={r => { setForm(r); setModal('edit'); }} />
        )}
        {activeTab === 'comisiones' && (
          <Table columns={comisionColumns} data={comisiones} loading={loading} />
        )}
      </div>

      <Modal open={!!modal} title={modal === 'new' ? 'Registrar pago' : 'Editar pago'} onClose={() => setModal(null)}>
        <Field label="Pedido" name="pedido" value={form.pedido} onChange={onChange} options={pedidoOpts} required />
        <Field label="Monto" name="monto" value={form.monto} onChange={onChange} type="number" required />
        <Field label="Método de pago" name="metodo" value={form.metodo} onChange={onChange} options={METODOS} required />
        <Field label="Referencia" name="referencia" value={form.referencia} onChange={onChange} />
        <Field label="Estado" name="estado" value={form.estado} onChange={onChange} options={ESTADOS_PAGO} required />
        <Field label="Fecha de pago" name="fecha_pago" value={form.fecha_pago} onChange={onChange} type="date" />
        <div className="modal-footer">
          <button className="btn btn-primary" onClick={save}>Guardar</button>
          <button className="btn btn-secondary" onClick={() => setModal(null)}>Cancelar</button>
        </div>
      </Modal>
    </div>
  );
}