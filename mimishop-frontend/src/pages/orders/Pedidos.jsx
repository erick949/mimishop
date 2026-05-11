
import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../api';
import { Table } from '../../components/ui';
import { useApp } from '../../context/AppContext';
import NuevoPedidoWizard from './NuevoPedidoWizard';

import {Text} from '@/design-system/atoms/Text';
/* ═══════════════════════════════════════════════
   TEMA FUTURISTA / SYSTEM UI
═══════════════════════════════════════════════ */
const T = {
  bg:        '#02050a', // Fondo base casi negro
  card:      'rgba(8, 15, 30, 0.65)', // Cristal oscuro
  cardAlt:   'rgba(12, 22, 45, 0.6)',
  hover:     'rgba(0, 243, 255, 0.04)', // Hover cian sutil
  border:    'rgba(0, 243, 255, 0.12)', // Bordes cian
  border2:   'rgba(188, 19, 254, 0.15)', // Bordes magenta
  text:      '#e2e8f0', // Texto principal claro
  sub:       '#64748b', // Texto secundario
  inputBg:   'rgba(0, 0, 0, 0.4)', // Inputs oscuros
  accent:    '#00f3ff', // Cian neón principal
  accentDim: '#0e7490',
  green:     '#00ff9d', // Verde neón éxito
  amber:     '#ffc107', // Ámbar advertencia
  red:       '#ff0055', // Rojo neón peligro
  purple:    '#d946ef', // Púrpura neón
};

const STAT_CFG = {
  total:      { grad: ['rgba(0, 243, 255, 0.05)', 'rgba(0, 243, 255, 0.01)'], accent: '#00f3ff', icon: '◈', label: 'Total Unidades' },
  ingresos:   { grad: ['rgba(0, 255, 157, 0.05)', 'rgba(0, 255, 157, 0.01)'], accent: '#00ff9d', icon: '◎', label: 'Créditos'      },
  completado: { grad: ['rgba(0, 255, 157, 0.05)', 'rgba(0, 255, 157, 0.01)'], accent: '#00ff9d', icon: '◉', label: 'Completados'   },
  pendiente:  { grad: ['rgba(255, 193, 7, 0.05)', 'rgba(255, 193, 7, 0.01)'], accent: '#ffc107', icon: '◌', label: 'Pendientes'    },
  cancelado:  { grad: ['rgba(255, 0, 85, 0.05)', 'rgba(255, 0, 85, 0.01)'], accent: '#ff0055', icon: '✕', label: 'Cancelados'    },
};

/* ── helpers de estado ── */
const STATUS_COLOR = { 1: '#00f3ff', 2: '#ffc107', 3: '#00ff9d', 4: '#ff0055' };
const STATUS_LABEL = { 1: 'Pendiente', 2: 'En proceso', 3: 'Entregado', 4: 'Cancelado' };

function clrStatus(p) { return STATUS_COLOR[p?.estado] || T.sub; }
function lblStatus(p) { return p?.estado_descripcion || STATUS_LABEL[p?.estado] || `#${p?.estado}`; }

/* ── input base ── */
const inp = {
  background: T.inputBg,
  border: `1px solid ${T.border}`,
  color: T.text,
  borderRadius: 6, // Cuadrado futuristic
  padding: '10px 14px',
  fontSize: 13,
  fontFamily: "'Courier New', Courier, monospace", // Monospace style
  width: '100%',
  outline: 'none',
  transition: 'all 0.2s ease',
  boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)'
};

const cardStyle = {
  background: T.card,
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: `1px solid ${T.border}`,
  borderRadius: 4, // Angular corners
  overflow: 'hidden',
  boxShadow: `0 0 20px rgba(0, 243, 255, 0.05), 0 4px 6px rgba(0,0,0,0.3)`,
  position: 'relative',
};

/* ═══════════════════════════════════════════════
   STAT CARD (System HUD Style)
═══════════════════════════════════════════════ */
function StatCard({ value, sub, colorKey }) {
  const c = STAT_CFG[colorKey];
  return (
    <div
      style={{
        background: `linear-gradient(160deg, ${c.grad[0]}, ${c.grad[1]})`,
        border: `1px solid ${c.accent}25`,
        borderLeft: `3px solid ${c.accent}`, // Barra lateral de acento
        borderRadius: 4,
        padding: '18px 20px',
        flex: '1 1 160px',
        minWidth: 140,
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform .2s, box-shadow .2s',
        cursor: 'default',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 0 25px ${c.accent}30`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
    >
      {/* Línea de escaneo decorativa */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: `linear-gradient(90deg, transparent, ${c.accent}, transparent)` }} />
      
      <div style={{ fontSize: 10, color: c.accent, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 8, fontFamily: 'monospace' }}>{c.label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: '#fff', lineHeight: 1, textShadow: `0 0 15px ${c.accent}`, fontFamily: 'monospace' }}>{value}</div>
      {sub && <div style={{ fontSize: 10, color: T.sub, marginTop: 6, fontFamily: 'monospace' }}>{sub}</div>}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   DONUT CHART
═══════════════════════════════════════════════ */
function DonutChart({ data }) {
  const total = data.reduce((s, d) => s + d.count, 0);
  if (!total) return <div style={{ color: T.sub, textAlign: 'center', padding: 24, fontSize: 13 }}>Sin datos</div>;

  let cum = -Math.PI / 2;
  const slices = data.map(d => {
    const a = (d.count / total) * 2 * Math.PI;
    const s = cum; cum += a;
    return { ...d, a, s, e: cum };
  });

  const arc = ({ s, e, a }) => {
    const r = 52, cr = 28, cx = 64, cy = 64;
    const x1 = cx + r * Math.cos(s),  y1 = cy + r * Math.sin(s);
    const x2 = cx + r * Math.cos(e),  y2 = cy + r * Math.sin(e);
    const i1 = cx + cr * Math.cos(s), j1 = cy + cr * Math.sin(s);
    const i2 = cx + cr * Math.cos(e), j2 = cy + cr * Math.sin(e);
    return `M${i1} ${j1} L${x1} ${y1} A${r} ${r} 0 ${a > Math.PI ? 1 : 0} 1 ${x2} ${y2} L${i2} ${j2} A${cr} ${cr} 0 ${a > Math.PI ? 1 : 0} 0 ${i1} ${j1}Z`;
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
      <svg width={128} height={128} viewBox="0 0 128 128" style={{ filter: 'drop-shadow(0 0 5px rgba(0,0,0,0.5))' }}>
        {slices.map((s, i) => <path key={i} d={arc(s)} fill={s.color} style={{ filter: `drop-shadow(0 0 3px ${s.color})` }} />)}
        <circle cx={64} cy={64} r={20} fill={T.bg} />
        <text x={64} y={61} textAnchor="middle" fontSize={12} fontWeight="700" fill="#fff" fontFamily="monospace">{total}</text>
        <text x={64} y={74} textAnchor="middle" fontSize={9} fill={T.sub} fontFamily="monospace">TOTAL</text>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {data.map((d, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: d.color, flexShrink: 0, boxShadow: `0 0 8px ${d.color}` }} />
            <span style={{ color: T.sub, fontFamily: 'monospace' }}>{d.label}</span>
            <span style={{ color: T.text, fontWeight: 600, marginLeft: 'auto', paddingLeft: 16, fontFamily: 'monospace' }}>
              {d.count}
              <span style={{ color: T.sub, fontWeight: 400, marginLeft: 4 }}>({((d.count / total) * 100).toFixed(0)}%)</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   STATUS BADGE
═══════════════════════════════════════════════ */
function StatusBadge({ pedido }) {
  const color = clrStatus(pedido);
  const label = lblStatus(pedido);
  return (
    <span style={{
      background: 'transparent',
      color,
      border: `1px solid ${color}60`,
      borderRadius: 2, // Border box style
      padding: '2px 8px',
      fontSize: 10,
      fontWeight: 700,
      whiteSpace: 'nowrap',
      fontFamily: 'monospace',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      boxShadow: `0 0 8px ${color}20`,
      textShadow: `0 0 4px ${color}`
    }}>
      {label}
    </span>
  );
}

/* ═══════════════════════════════════════════════
   PANEL GESTOR DE ESTADOS
═══════════════════════════════════════════════ */
function StatusManager({ estados, onAdd, onEdit }) {
  return (
    <div style={{ ...cardStyle, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '14px 18px', borderBottom: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: T.accent, textTransform: 'uppercase', letterSpacing: '1.5px', fontFamily: 'monospace' }}>System Status</span>
        <button
          onClick={onAdd}
          style={{ background: 'transparent', border: `1px solid ${T.accent}`, color: T.accent, fontSize: 10, padding: '5px 12px', borderRadius: 2, cursor: 'pointer', fontWeight: 600, fontFamily: 'monospace' }}
        >
          + NEW
        </button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {estados.length === 0 && (
          <div style={{ padding: 20, color: T.sub, fontSize: 13, textAlign: 'center' }}>No data</div>
        )}
        {estados.map(est => (
          <div
            key={est.id_estado_pedido}
            onClick={() => onEdit(est)}
            style={{ padding: '11px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', transition: 'background .15s', borderBottom: `1px solid ${T.border}18` }}
            onMouseEnter={e => e.currentTarget.style.background = T.hover}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: est.color || '#666', boxShadow: `0 0 8px ${est.color || '#666'}` }} />
              <span style={{ fontSize: 12, color: T.text, fontFamily: 'monospace' }}>{est.descripcion}</span>
            </div>
            <span style={{ fontSize: 10, color: T.sub, opacity: 0.6 }}>EDIT</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   DARK FIELD
═══════════════════════════════════════════════ */
function DarkField({ label, name, value, onChange, type = 'text', options, required }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 10, color: T.accent, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6, fontFamily: 'monospace' }}>
        {label}{required && <span style={{ color: T.red, marginLeft: 4 }}>*</span>}
      </label>
      {options ? (
        <select name={name} value={value ?? ''} onChange={onChange} style={{ ...inp, cursor: 'pointer' }}>
          <option value="">Select...</option>
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value ?? ''}
          onChange={onChange}
          style={inp}
          onFocus={e => { e.target.style.borderColor = T.accent; e.target.style.boxShadow = `0 0 10px ${T.accent}40, inset 0 0 10px rgba(0,0,0,0.5)`; }}
          onBlur={e => { e.target.style.borderColor = T.border; e.target.style.boxShadow = 'inset 0 0 10px rgba(0,0,0,0.5)'; }}
        />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   DARK MODAL
═══════════════════════════════════════════════ */
function DarkModal({ open, title, onClose, children, wide }) {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: T.card, border: `1px solid ${T.accent}30`, borderRadius: 4, padding: 28, width: '100%', maxWidth: wide ? 640 : 440, maxHeight: '90vh', overflowY: 'auto', boxShadow: `0 0 40px rgba(0, 243, 255, 0.1), 0 0 10px rgba(0,0,0,0.8)`, position: 'relative' }}>
        {/* Corner accents */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '20px', height: '20px', borderTop: `2px solid ${T.accent}`, borderLeft: `2px solid ${T.accent}` }} />
        <div style={{ position: 'absolute', bottom: 0, right: 0, width: '20px', height: '20px', borderBottom: `2px solid ${T.accent}`, borderRight: `2px solid ${T.accent}` }} />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: T.accent, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '1px' }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'transparent', border: `1px solid ${T.border}`, color: T.sub, width: 28, height: 28, borderRadius: 2, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   CONFIRM MODAL
═══════════════════════════════════════════════ */
function ConfirmModal({ open, message, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.9)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: T.card, border: `1px solid ${T.red}50`, borderRadius: 4, padding: 28, width: '100%', maxWidth: 360, textAlign: 'center', boxShadow: `0 0 40px ${T.red}20` }}>
        <div style={{ fontSize: 36, marginBottom: 14, color: T.red }}>⚠</div>
        <p style={{ fontSize: 13, color: T.text, lineHeight: 1.6, marginBottom: 22, fontFamily: 'monospace' }} dangerouslySetInnerHTML={{ __html: message }} />
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <button onClick={onCancel} style={{ background: 'transparent', border: `1px solid ${T.border}`, color: T.sub, fontWeight: 600, fontSize: 12, padding: '9px 20px', borderRadius: 2, cursor: 'pointer', fontFamily: 'monospace' }}>
            CANCEL
          </button>
          <button onClick={onConfirm} style={{ background: 'transparent', border: `1px solid ${T.red}`, color: T.red, fontWeight: 700, fontSize: 12, padding: '9px 20px', borderRadius: 2, cursor: 'pointer', fontFamily: 'monospace', boxShadow: `0 0 10px ${T.red}40` }}>
            DELETE
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════════ */
export default function Pedidos() {
  const location = useLocation();
  const navigate = useNavigate();

  const { showToast } = useApp();

  // ── Datos ──
  const [pedidos,               setPedidos]               = useState([]);
  const [clientes,              setClientes]              = useState([]);
  const [socios,                setSocios]                = useState([]);
  const [estados,               setEstados]               = useState([]);
  const [productos,             setProductos]             = useState([]);
  const [direccionesPorCliente, setDireccionesPorCliente] = useState([]);
  const [detalles,              setDetalles]              = useState([]);
  const [historial,             setHistorial]             = useState([]);

  // ── UI ──
  const [loading,    setLoading]    = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selected,   setSelected]   = useState(null);

  // ── Modales ──
  const [wizardOpen,  setWizardOpen]  = useState(false);
  const [editModal,   setEditModal]   = useState(false);
  const [editForm,    setEditForm]    = useState({});
  const [statusModal, setStatusModal] = useState(false);
  const [newStatus,   setNewStatus]   = useState({ estado: '', nota: '' });
  const [detModal,    setDetModal]    = useState(false);
  const [detForm,     setDetForm]     = useState({ producto: '', cantidad: 1, precio_unitario: '' });
  const [stsMgr,      setStsMgr]      = useState(null); // null | 'new' | 'edit'
  const [stsForm,     setStsForm]     = useState({ descripcion: '', color: '#3b82f6' });
  const [confirmDel,  setConfirmDel]  = useState(null);

  // ── Carga inicial ──
  useEffect(() => {
    load();
    Promise.allSettled([
      api.clientes.list(),
      api.socios.list(),
      api.estadosPedido.list(),
      api.productos.list(),
    ]).then(([c, s, e, p]) => {
      setClientes(c.value?.results  ?? c.value ?? []);
      setSocios(s.value?.results    ?? s.value ?? []);
      setEstados(e.value?.results   ?? e.value ?? []);
      setProductos(p.value?.results ?? p.value ?? []);
    });
  }, []);

  useEffect(() => {
  if (location.pathname === '/pedidos/nuevo') {
    setWizardOpen(true);
  }
}, [location.pathname]);

  async function load() {
    setLoading(true);
    try {
      const data = await api.pedidos.list();
      setPedidos(data?.results ?? data ?? []);
    } catch (e) { showToast(e.message, 'error'); }
    setLoading(false);
  }

  // ── Cargar direcciones al seleccionar cliente en wizard ──
  async function handleClienteChange(clienteId) {
    try {
      const data = await api.direcciones.list(`?cliente_id=${clienteId}`);
      setDireccionesPorCliente(data?.results ?? data ?? []);
    } catch {
      setDireccionesPorCliente([]);
    }
  }

  // ── Abrir detalle de pedido ──
  async function openDetail(pedido) {
    setSelected(pedido);
    setDetalles([]);
    setHistorial([]);
    const [det, his] = await Promise.allSettled([
      api.detalles.list(`?pedido=${pedido.id_pedido}`),
      api.historialPedido.list(`?pedido=${pedido.id_pedido}`),
    ]);
    setDetalles(det.value?.results  ?? det.value ?? []);
    setHistorial(his.value?.results ?? his.value ?? []);
  }

  // ── Actualizar total del pedido seleccionado ──
  async function recalcTotal(pedidoId, newDetalles) {
    const nuevoTotal = newDetalles.reduce((s, d) => s + parseFloat(d.subtotal || 0), 0).toFixed(2);
    try {
      await api.pedidos.update(pedidoId, { total: nuevoTotal });
      setSelected(prev => prev ? { ...prev, total: nuevoTotal } : prev);
      setPedidos(prev => prev.map(p => p.id_pedido === pedidoId ? { ...p, total: nuevoTotal } : p));
    } catch { /* silencioso */ }
  }

  // ── Editar pedido ──
  async function saveEdit() {
    try {
      await api.pedidos.update(editForm.id_pedido, editForm);
      showToast('Pedido actualizado');
      setEditModal(false);
      load();
      if (selected?.id_pedido === editForm.id_pedido) openDetail({ ...selected, ...editForm });
    } catch (e) { showToast(e.message, 'error'); }
  }

  // ── Eliminar pedido ──
  function requestDelete(pedido) { setConfirmDel(pedido); }

  async function confirmDelete() {
    if (!confirmDel) return;
    try {
      await api.pedidos.delete(confirmDel.id_pedido);
      showToast('Pedido eliminado correctamente');
      if (selected?.id_pedido === confirmDel.id_pedido) setSelected(null);
      setConfirmDel(null);
      load();
    } catch (e) { showToast(e.message || 'Error al eliminar el pedido', 'error'); }
  }

  // ── Cambiar estado ──
  async function changeStatus() {
    if (!newStatus.estado) { showToast('Selecciona un estado', 'error'); return; }
    try {
      await api.historialPedido.create({
        pedido: selected.id_pedido,
        estado: newStatus.estado,
        nota: newStatus.nota,
        fecha_cambio: new Date().toISOString(),
      });
      await api.pedidos.update(selected.id_pedido, { estado: newStatus.estado });
      showToast('Estado actualizado');
      setStatusModal(false);
      const updatedPedido = { ...selected, estado: newStatus.estado };
      setSelected(updatedPedido);
      setPedidos(prev => prev.map(p => p.id_pedido === selected.id_pedido ? updatedPedido : p));
      openDetail(updatedPedido);
    } catch (e) { showToast(e.message, 'error'); }
  }

  // ── Agregar producto al detalle ──
  async function addDetalle() {
    if (!detForm.producto || !detForm.cantidad) { showToast('Selecciona producto y cantidad', 'error'); return; }
    const prod    = productos.find(p => String(p.id_producto) === String(detForm.producto));
    const precio  = parseFloat(detForm.precio_unitario || prod?.precio || 0);
    const subtotal = (detForm.cantidad * precio).toFixed(2);
    try {
      await api.detalles.create({ pedido: selected.id_pedido, producto: detForm.producto, cantidad: detForm.cantidad, precio_unitario: precio, subtotal });
      showToast('Producto agregado');
      setDetModal(false);
      setDetForm({ producto: '', cantidad: 1, precio_unitario: '' });
      const det = await api.detalles.list(`?pedido=${selected.id_pedido}`);
      const newDetalles = det?.results ?? det ?? [];
      setDetalles(newDetalles);
      await recalcTotal(selected.id_pedido, newDetalles);
    } catch (e) { showToast(e.message, 'error'); }
  }

  // ── Eliminar producto del detalle ──
  async function removeDetalle(id) {
    try {
      await api.detalles.delete(id);
      showToast('Producto eliminado');
      const det = await api.detalles.list(`?pedido=${selected.id_pedido}`);
      const newDetalles = det?.results ?? det ?? [];
      setDetalles(newDetalles);
      await recalcTotal(selected.id_pedido, newDetalles);
    } catch (e) { showToast(e.message, 'error'); }
  }

  // ── Gestión global de estados ──
  async function saveGlobalStatus() {
    try {
      if (stsMgr === 'new') await api.estadosPedido.create(stsForm);
      else await api.estadosPedido.update(stsForm.id_estado_pedido, stsForm);
      showToast('Estado guardado');
      setStsMgr(null);
      const e = await api.estadosPedido.list();
      setEstados(e?.results ?? e ?? []);
    } catch (e) { showToast(e.message, 'error'); }
  }

  // ── Estadísticas ──
  const stats = useMemo(() => {
    const total    = pedidos.length;
    const ingresos = pedidos.reduce((s, p) => s + parseFloat(p.total || 0), 0);
    const match    = (p, id, keyword) => p.estado === id || (p.estado_descripcion || '').toLowerCase().includes(keyword);
    const completado = pedidos.filter(p => match(p, 3, 'entregad')).length;
    const pendiente  = pedidos.filter(p => match(p, 1, 'pendiente')).length;
    const proceso    = pedidos.filter(p => match(p, 2, 'proceso')).length;
    const cancelado  = pedidos.filter(p => match(p, 4, 'cancel')).length;
    return { total, ingresos, completado, pendiente, proceso, cancelado, ticket: total ? ingresos / total : 0 };
  }, [pedidos]);

  const donutData = [
    { label: 'Entregado',  count: stats.completado, color: '#00ff9d' },
    { label: 'En proceso', count: stats.proceso,    color: '#00f3ff' },
    { label: 'Pendiente',  count: stats.pendiente,  color: '#ffc107' },
    { label: 'Cancelado',  count: stats.cancelado,  color: '#ff0055' },
  ].filter(d => d.count > 0);

  const filteredPedidos = useMemo(() => {
    if (!searchTerm) return pedidos;
    const term = searchTerm.toLowerCase();
    return pedidos.filter(p =>
      String(p.id_pedido).includes(term) ||
      (p.cliente_nombre || '').toLowerCase().includes(term) ||
      (p.estado_descripcion || '').toLowerCase().includes(term)
    );
  }, [pedidos, searchTerm]);

  const estadoOpts   = estados.map(e  => ({ value: e.id_estado_pedido, label: e.descripcion }));
  const productoOpts = productos.map(p => ({ value: p.id_producto, label: `${p.nombre} — $${p.precio}` }));

  const totalDetalles = detalles.reduce((s, d) => s + parseFloat(d.subtotal || 0), 0);

  /* ─────────────────────────────────────────────
     VISTA DETALLE
  ───────────────────────────────────────────── */
  if (selected) {
    return (
      <div style={{ background: T.bg, color: T.text, minHeight: '100vh', padding: 24 }}>
        <div style={{ position: 'fixed', inset: 0, background: `radial-gradient(circle at 50% 50%, rgba(0, 243, 255, 0.03), transparent 70%)`, pointerEvents: 'none' }} />

        <button
          onClick={() => setSelected(null)}
          style={{ background: 'transparent', border: `1px solid ${T.border}`, color: T.sub, padding: '8px 16px', borderRadius: 2, fontSize: 11, cursor: 'pointer', marginBottom: 20, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '1px' }}
        >
          ← Volver
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={{ margin: '0 0 8px', fontSize: 24, fontWeight: 700, color: '#fff', fontFamily: 'monospace', textShadow: `0 0 10px ${T.accent}` }}>Pedido #{selected.id_pedido}</h2>
            <StatusBadge pedido={selected} />
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              onClick={() => requestDelete(selected)}
              style={{ background: 'transparent', border: `1px solid ${T.red}50`, color: T.red, fontWeight: 600, fontSize: 11, padding: '9px 18px', borderRadius: 2, cursor: 'pointer', fontFamily: 'monospace' }}
            >
              Eliminar
            </button>
            <button
              onClick={() => { setEditForm(selected); setEditModal(true); }}
              style={{ background: 'transparent', border: `1px solid ${T.border2}`, color: T.text, fontWeight: 600, fontSize: 11, padding: '9px 18px', borderRadius: 2, cursor: 'pointer', fontFamily: 'monospace' }}
            >
              Editar
            </button>
            <button
              onClick={() => { setNewStatus({ estado: selected.estado || '', nota: '' }); setStatusModal(true); }}
              style={{ background: T.accent, border: 'none', color: T.bg, fontWeight: 700, fontSize: 11, padding: '9px 18px', borderRadius: 2, cursor: 'pointer', boxShadow: `0 0 15px ${T.accent}60`, fontFamily: 'monospace' }}
            >
              Cambiar Estado
            </button>
          </div>
        </div>

        {/* Info general */}
        <div style={{ ...cardStyle, padding: 20, marginBottom: 20, borderLeft: `3px solid ${T.accent}` }}>
          <h4 style={{ margin: '0 0 16px', fontSize: 10, fontWeight: 700, color: T.accent, textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'monospace' }}>Información General</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
            {[
              ['Cliente',  selected.cliente_nombre || selected.cliente || '—'],
              ['Socio',    selected.socio_nombre   || selected.socio   || '—'],
              ['Cupón',    selected.cupon          || '—'],
              ['Total',    `$${parseFloat(selected.total || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`],
              ['Creado',   selected.fecha_creacion?.split('T')[0] ?? '—'],
              ['Entrega',  selected.fecha_entrega?.split('T')[0]  ?? '—'],
            ].map(([lbl, val]) => (
              <div key={lbl}>
                <div style={{ fontSize: 10, color: T.sub, marginBottom: 3, textTransform: 'uppercase', letterSpacing: '.5px', fontFamily: 'monospace' }}>{lbl}</div>
                <div style={{ fontSize: 14, color: lbl === 'Total' ? T.green : T.text, fontWeight: lbl === 'Total' ? 700 : 400, fontFamily: 'monospace' }}>{val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Productos del pedido */}
        <div style={{ ...cardStyle, padding: 20, marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h4 style={{ margin: 0, fontSize: 10, fontWeight: 700, color: T.accent, textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'monospace' }}>Items List</h4>
            <button
              onClick={() => setDetModal(true)}
              style={{ background: 'transparent', border: `1px solid ${T.accent}`, color: T.accent, fontWeight: 600, fontSize: 10, padding: '6px 14px', borderRadius: 2, cursor: 'pointer', fontFamily: 'monospace' }}
            >
              + Agregar
            </button>
          </div>
          <Table
            columns={[
              { key: 'producto',        label: 'Producto',     render: r => <span style={{fontFamily: 'monospace'}}>{r.producto_nombre || r.producto}</span> },
              { key: 'cantidad',        label: 'Cant.' },
              { key: 'precio_unitario', label: 'Precio U.', render: r => <span style={{ color: T.sub }}>$${parseFloat(r.precio_unitario || 0).toFixed(2)}</span> },
              { key: 'subtotal',        label: 'Subtotal',     render: r => <span style={{ color: T.green }}>$${parseFloat(r.subtotal || 0).toFixed(2)}</span> },
            ]}
            data={detalles}
            onDelete={r => removeDetalle(r.id_detalle)}
          />
          {detalles.length > 0 && (
            <div style={{ textAlign: 'right', marginTop: 14, padding: '12px 0 0', borderTop: `1px solid ${T.border}` }}>
              <span style={{ fontSize: 10, color: T.sub, textTransform: 'uppercase', letterSpacing: '1px', marginRight: 12, fontFamily: 'monospace' }}>Total</span>
              <span style={{ fontSize: 18, fontWeight: 700, color: T.green, fontFamily: 'monospace', textShadow: `0 0 10px ${T.green}40` }}>${totalDetalles.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
            </div>
          )}
        </div>

        {/* Historial de estados */}
        <div style={{ ...cardStyle, padding: 20 }}>
          <h4 style={{ margin: '0 0 14px', fontSize: 10, fontWeight: 700, color: T.accent, textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'monospace' }}>Log de Estados</h4>
          <Table
            columns={[
              { key: 'fecha_cambio', label: 'Fecha',   render: r => <span style={{color: T.sub, fontFamily: 'monospace'}}>{r.fecha_cambio?.split('T')[0] ?? '—'}</span> },
              { key: 'estado',       label: 'Estado',  render: r => r.estado_descripcion || `Estado ${r.estado}` },
              { key: 'usuario',      label: 'Usuario', render: r => r.usuario_nombre || r.usuario || '—' },
              { key: 'nota',         label: 'Nota', render: r => <span style={{color: T.sub, fontSize: 11}}>{r.nota || '—'}</span> },
            ]}
            data={historial}
          />
          {historial.length === 0 && (
            <div style={{ textAlign: 'center', padding: '20px 0', color: T.sub, fontSize: 13 }}>Sin historial</div>
          )}
        </div>

        {/* ── Modales del detalle ── */}

        <DarkModal open={statusModal} title="Actualizar Estado" onClose={() => setStatusModal(false)}>
          <DarkField label="Nuevo estado" name="estado" value={newStatus.estado}
            onChange={e => setNewStatus(s => ({ ...s, estado: e.target.value }))} options={estadoOpts} required />
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 10, color: T.accent, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 5, fontFamily: 'monospace' }}>Nota interna</label>
            <textarea rows={3} value={newStatus.nota} onChange={e => setNewStatus(s => ({ ...s, nota: e.target.value }))} style={{ ...inp, resize: 'vertical' }} />
          </div>
          <button onClick={changeStatus} style={{ width: '100%', background: T.accent, border: 'none', color: T.bg, fontWeight: 700, fontSize: 12, padding: '11px 0', borderRadius: 2, cursor: 'pointer', boxShadow: `0 0 15px ${T.accent}40`, fontFamily: 'monospace' }}>
            CONFIRMAR
          </button>
        </DarkModal>

        <DarkModal open={detModal} title="Agregar Item" onClose={() => setDetModal(false)}>
          <DarkField label="Producto" name="producto" value={detForm.producto}
            onChange={e => {
              const p = productos.find(x => String(x.id_producto) === e.target.value);
              setDetForm(f => ({ ...f, producto: e.target.value, precio_unitario: p?.precio ?? '' }));
            }}
            options={productoOpts} required />
          <DarkField label="Cantidad" name="cantidad" value={detForm.cantidad}
            onChange={e => setDetForm(f => ({ ...f, cantidad: e.target.value }))} type="number" required />
          <DarkField label="Precio unitario" name="precio_unitario" value={detForm.precio_unitario}
            onChange={e => setDetForm(f => ({ ...f, precio_unitario: e.target.value }))} type="number" />
          <div style={{ fontSize: 12, color: T.sub, marginBottom: 14, fontFamily: 'monospace' }}>
            Subtotal: <span style={{ color: T.green, fontWeight: 700 }}>${((detForm.cantidad || 0) * (detForm.precio_unitario || 0)).toFixed(2)}</span>
          </div>
          <button onClick={addDetalle} style={{ width: '100%', background: T.accent, border: 'none', color: T.bg, fontWeight: 700, fontSize: 12, padding: '11px 0', borderRadius: 2, cursor: 'pointer', boxShadow: `0 0 15px ${T.accent}40`, fontFamily: 'monospace' }}>
            AGREGAR
          </button>
        </DarkModal>

        <DarkModal open={editModal} title="Editar Datos" onClose={() => setEditModal(false)} wide>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <DarkField label="Estado" name="estado" value={editForm.estado}
              onChange={e => setEditForm(f => ({ ...f, estado: e.target.value }))} options={estadoOpts} />
            <DarkField label="Total" name="total" value={editForm.total}
              onChange={e => setEditForm(f => ({ ...f, total: e.target.value }))} type="number" />
            <DarkField label="Fecha de entrega" name="fecha_entrega" value={editForm.fecha_entrega}
              onChange={e => setEditForm(f => ({ ...f, fecha_entrega: e.target.value }))} type="date" />
            <DarkField label="Cupón" name="cupon" value={editForm.cupon}
              onChange={e => setEditForm(f => ({ ...f, cupon: e.target.value }))} />
          </div>
          <button onClick={saveEdit} style={{ width: '100%', background: T.accent, border: 'none', color: T.bg, fontWeight: 700, fontSize: 12, padding: '11px 0', borderRadius: 2, cursor: 'pointer', marginTop: 4, boxShadow: `0 0 15px ${T.accent}40`, fontFamily: 'monospace' }}>
            GUARDAR
          </button>
        </DarkModal>

        <ConfirmModal
          open={!!confirmDel}
          message={`¿Eliminar el pedido <strong>#${confirmDel?.id_pedido}</strong>? Esta acción es irreversible.`}
          onConfirm={confirmDelete}
          onCancel={() => setConfirmDel(null)}
        />
      </div>
    );
  }

  /* ─────────────────────────────────────────────
     VISTA PRINCIPAL
  ───────────────────────────────────────────── */
  return (
    <div style={{ background: T.bg, color: T.text, minHeight: '100vh', padding: 24 }}>
      {/* Background decorative grid */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(0, 243, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 243, 255, 0.03) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, position: 'relative' }}>
        <div>
          <Text as="h1" variant="display" className="cl-title">Pedidos</Text>
          <p style={{ margin: '4px 0 0', fontSize: 11, color: T.sub, fontFamily: 'monospace' }}>{pedidos.length} REGISTROS ENCONTRADOS</p>
        </div>
        <button
          onClick={() => {
            setWizardOpen(true);

            if (location.pathname !== '/pedidos/nuevo') {
              navigate('/pedidos/nuevo');
            }
          }}
          style={{ background: 'transparent', border: `1px solid ${T.accent}`, color: T.accent, fontWeight: 700, fontSize: 12, padding: '11px 22px', borderRadius: 2, cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'monospace', boxShadow: `0 0 15px ${T.accent}30` }}
          onMouseEnter={e => { e.currentTarget.style.background = T.accent; e.currentTarget.style.color = T.bg; e.currentTarget.style.boxShadow = `0 0 20px ${T.accent}60`; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = T.accent; e.currentTarget.style.boxShadow = `0 0 15px ${T.accent}30`; }}
        >
          + NUEVO PEDIDO
        </button>
      </div>

      {/* KPI cards */}
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 24 }}>
        <StatCard value={stats.total} colorKey="total" />
        <StatCard
          value={`$${stats.ingresos.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`}
          sub={`Avg. $${stats.ticket.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`}
          colorKey="ingresos"
        />
        <StatCard
          value={stats.completado}
          sub={stats.total > 0 ? `${((stats.completado / stats.total) * 100).toFixed(1)}% eficiencia` : ''}
          colorKey="completado"
        />
        <StatCard
          value={stats.pendiente}
          sub={stats.total > 0 ? `${((stats.pendiente / stats.total) * 100).toFixed(1)}% cola` : ''}
          colorKey="pendiente"
        />
        <StatCard value={stats.cancelado} colorKey="cancelado" />
      </div>

      {/* Fila media */}
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 260px', gap: 20, marginBottom: 24, alignItems: 'start' }}>

        {/* Donut */}
        <div style={{ ...cardStyle, padding: 18 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: T.accent, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 14, fontFamily: 'monospace' }}>Distribución</div>
          <DonutChart data={donutData} />
        </div>

        {/* Pedidos recientes */}
        <div style={{ ...cardStyle }}>
          <div style={{ padding: '14px 18px', borderBottom: `1px solid ${T.border}`, fontSize: 10, fontWeight: 700, color: T.accent, textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'monospace' }}>
            últimos ingresos
          </div>
          <div style={{ padding: '4px 8px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr>
                  {['ID', 'Cliente', 'Total', 'Estado', 'Fecha', ''].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '6px 10px', color: T.sub, fontWeight: 600, fontSize: 9, textTransform: 'uppercase', letterSpacing: '.5px', borderBottom: `1px solid ${T.border}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...pedidos]
                  .sort((a, b) => (b.fecha_creacion || '').localeCompare(a.fecha_creacion || ''))
                  .slice(0, 6)
                  .map(p => (
                    <tr
                      key={p.id_pedido}
                      style={{ borderBottom: `1px solid ${T.border}18`, cursor: 'pointer', transition: 'background .15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = T.hover}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '8px 10px', fontWeight: 700, color: T.accent, fontFamily: 'monospace' }}>#{p.id_pedido}</td>
                      <td style={{ padding: '8px 10px', color: T.text }}>{p.cliente_nombre || p.cliente}</td>
                      <td style={{ padding: '8px 10px', color: T.green, fontWeight: 600, fontFamily: 'monospace' }}>${parseFloat(p.total || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                      <td style={{ padding: '8px 10px' }}><StatusBadge pedido={p} /></td>
                      <td style={{ padding: '8px 10px', color: T.sub, fontFamily: 'monospace' }}>{p.fecha_creacion?.split('T')[0] ?? '—'}</td>
                      <td style={{ padding: '8px 10px' }}>
                        <button
                          onClick={() => openDetail(p)}
                          style={{ background: 'transparent', border: `1px solid ${T.border}`, color: T.text, fontSize: 10, padding: '3px 10px', borderRadius: 2, cursor: 'pointer', fontFamily: 'monospace' }}
                        >
                          Scan →
                        </button>
                      </td>
                    </tr>
                  ))}
                {pedidos.length === 0 && (
                  <tr><td colSpan={6} style={{ padding: 24, textAlign: 'center', color: T.sub }}>Sin datos</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Status manager */}
        <StatusManager
          estados={estados}
          onAdd={() => { setStsForm({ descripcion: '', color: '#3b82f6' }); setStsMgr('new'); }}
          onEdit={e => { setStsForm(e); setStsMgr('edit'); }}
        />
      </div>

      {/* Tabla completa */}
      <div style={{ ...cardStyle }}>
        <div style={{ padding: '14px 18px', borderBottom: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: T.accent, textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'monospace' }}>Database View</span>
            {searchTerm && (
              <span style={{ fontSize: 10, color: T.text, background: T.accent + '10', border: `1px solid ${T.accent}30`, borderRadius: 2, padding: '2px 8px', fontFamily: 'monospace' }}>
                {filteredPedidos.length} resultados
              </span>
            )}
          </div>
          <input
            type="text"
            placeholder="Buscar por ID, cliente..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ ...inp, width: 260, fontSize: 11, fontFamily: 'monospace' }}
            onFocus={e => e.target.style.borderColor = T.accent}
            onBlur={e => e.target.style.borderColor = T.border}
          />
        </div>
        <Table
          columns={[
            { key: 'id_pedido',      label: 'ID',      render: r => <span style={{ fontWeight: 700, color: T.accent, fontFamily: 'monospace' }}>#{r.id_pedido}</span> },
            { key: 'cliente',        label: 'Cliente',  render: r => r.cliente_nombre || r.cliente },
            { key: 'total',          label: 'Total',    render: r => <span style={{ color: T.green, fontWeight: 600, fontFamily: 'monospace' }}>${parseFloat(r.total || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span> },
            { key: 'estado',         label: 'Estado',   render: r => <StatusBadge pedido={r} /> },
            { key: 'fecha_creacion', label: 'Fecha',    render: r => <span style={{ color: T.sub, fontFamily: 'monospace' }}>{r.fecha_creacion?.split('T')[0] ?? '—'}</span> },
            { key: '_ver',           label: '',         render: r => (
              <button onClick={() => openDetail(r)} style={{ background: 'transparent', border: `1px solid ${T.border}`, color: T.text, fontSize: 10, padding: '4px 12px', borderRadius: 2, cursor: 'pointer', fontFamily: 'monospace' }}>
                Ver
              </button>
            )},
          ]}
          data={filteredPedidos}
          loading={loading}
          onEdit={r => { setEditForm(r); setEditModal(true); }}
          onDelete={requestDelete}
        />
        {!loading && filteredPedidos.length === 0 && (
          <div style={{ textAlign: 'center', padding: '32px 0', color: T.sub, fontSize: 13 }}>
            {searchTerm ? `Sin resultados para "${searchTerm}"` : 'Database empty'}
          </div>
        )}
      </div>

      {/* ── Wizard ── */}
      <NuevoPedidoWizard
        open={wizardOpen}
        onClose={() => {
          setWizardOpen(false);
          navigate('/pedidos');
        }}
        onSaved={load}
        clientes={clientes}
        socios={socios}
        estados={estados}
        productos={productos}
        direccionesPorCliente={direccionesPorCliente}
        onClienteChange={handleClienteChange}
      />

      {/* ── Modal gestión estado global ── */}
      <DarkModal open={!!stsMgr} title={stsMgr === 'new' ? 'Nuevo Estado' : 'Editar Estado'} onClose={() => setStsMgr(null)}>
        <DarkField label="Nombre" name="descripcion" value={stsForm.descripcion}
          onChange={e => setStsForm(s => ({ ...s, descripcion: e.target.value }))} required />
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 10, color: T.accent, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 8, fontFamily: 'monospace' }}>Color</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <input type="color" value={stsForm.color} onChange={e => setStsForm(s => ({ ...s, color: e.target.value }))} style={{ width: 44, height: 36, border: 'none', borderRadius: 2, cursor: 'pointer', background: 'none' }} />
            <span style={{ fontSize: 11, color: T.sub, fontFamily: 'monospace' }}>{stsForm.color}</span>
            <span style={{ background: stsForm.color + '15', color: stsForm.color, border: `1px solid ${stsForm.color}50`, borderRadius: 2, padding: '3px 12px', fontSize: 10, fontWeight: 600, fontFamily: 'monospace' }}>
              {stsForm.descripcion || 'Preview'}
            </span>
          </div>
        </div>
        <button onClick={saveGlobalStatus} style={{ width: '100%', background: T.accent, border: 'none', color: T.bg, fontWeight: 700, fontSize: 12, padding: '11px 0', borderRadius: 2, cursor: 'pointer', boxShadow: `0 0 15px ${T.accent}40`, fontFamily: 'monospace' }}>
          GUARDAR
        </button>
      </DarkModal>

      {/* ── Modal editar pedido (desde lista principal) ── */}
      <DarkModal open={editModal} title="Editar Pedido" onClose={() => setEditModal(false)} wide>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
          <DarkField label="Estado" name="estado" value={editForm.estado}
            onChange={e => setEditForm(f => ({ ...f, estado: e.target.value }))} options={estadoOpts} />
          <DarkField label="Total" name="total" value={editForm.total}
            onChange={e => setEditForm(f => ({ ...f, total: e.target.value }))} type="number" />
          <DarkField label="Fecha de entrega" name="fecha_entrega" value={editForm.fecha_entrega}
            onChange={e => setEditForm(f => ({ ...f, fecha_entrega: e.target.value }))} type="date" />
          <DarkField label="Cupón" name="cupon" value={editForm.cupon}
            onChange={e => setEditForm(f => ({ ...f, cupon: e.target.value }))} />
        </div>
        <button onClick={saveEdit} style={{ width: '100%', background: T.accent, border: 'none', color: T.bg, fontWeight: 700, fontSize: 12, padding: '11px 0', borderRadius: 2, cursor: 'pointer', marginTop: 4, boxShadow: `0 0 15px ${T.accent}40`, fontFamily: 'monospace' }}>
          GUARDAR
        </button>
      </DarkModal>

      {/* ── Confirm eliminar ── */}
      <ConfirmModal
        open={!!confirmDel}
        message={`¿Eliminar el pedido <strong>#${confirmDel?.id_pedido}</strong>? Esta acción es irreversible.`}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmDel(null)}
      />
    </div>
  );
}