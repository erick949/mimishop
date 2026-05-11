import { useState, useEffect } from 'react';
import api from '../../api';
import { useApp } from '../../context/AppContext';

/* ═══════════════════════════════════════════════
   TEMA
═══════════════════════════════════════════════ */
const T = {
  bg:        '#0a0f1e',
  card:      '#111827',
  cardAlt:   '#161f30',
  hover:     '#1e2d45',
  border:    '#1e293b',
  border2:   '#263348',
  text:      '#f0f4ff',
  sub:       '#7c8da6',
  inputBg:   '#0a0f1e',
  accent:    '#3b82f6',
  accentDim: '#1d4ed8',
  green:     '#34d399',
  amber:     '#fbbf24',
  red:       '#f87171',
  purple:    '#a78bfa',
};

const inp = {
  background: T.inputBg,
  border: `1px solid ${T.border2}`,
  color: T.text,
  borderRadius: 8,
  padding: '9px 12px',
  fontSize: 13,
  width: '100%',
  outline: 'none',
  transition: 'border-color .15s',
  boxSizing: 'border-box',
};

/* ═══════════════════════════════════════════════
   HELPERS UI
═══════════════════════════════════════════════ */
function DarkField({ label, name, value, onChange, type = 'text', options, required, placeholder }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 11, color: T.sub, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 5 }}>
        {label}{required && <span style={{ color: T.red, marginLeft: 4 }}>*</span>}
      </label>
      {options ? (
        <select name={name} value={value ?? ''} onChange={onChange} style={{ ...inp, cursor: 'pointer' }}>
          <option value="">Seleccionar...</option>
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value ?? ''}
          onChange={onChange}
          placeholder={placeholder}
          style={inp}
          onFocus={e => e.target.style.borderColor = T.accent}
          onBlur={e => e.target.style.borderColor = T.border2}
        />
      )}
    </div>
  );
}

function DarkModal({ open, title, onClose, children, wide }) {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.75)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: T.card, border: `1px solid ${T.border2}`, borderRadius: 20, padding: 28, width: '100%', maxWidth: wide ? 640 : 440, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 32px 64px rgba(0,0,0,.6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: T.text }}>{title}</h3>
          <button onClick={onClose} style={{ background: T.hover, border: 'none', color: T.sub, width: 28, height: 28, borderRadius: 8, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   TOGGLE: Existente / Nuevo producto
═══════════════════════════════════════════════ */
function ProductoModeToggle({ mode, onChange }) {
  const btn = (label, val) => (
    <button
      onClick={() => onChange(val)}
      style={{
        flex: 1,
        padding: '8px 0',
        fontSize: 12,
        fontWeight: 700,
        borderRadius: 8,
        border: 'none',
        cursor: 'pointer',
        transition: 'all .2s',
        background: mode === val ? T.accent : 'transparent',
        color: mode === val ? '#fff' : T.sub,
      }}
    >
      {label}
    </button>
  );
  return (
    <div style={{ display: 'flex', background: T.hover, borderRadius: 10, padding: 3, marginBottom: 16, border: `1px solid ${T.border}` }}>
      {btn('+ Nuevo producto', 'nuevo')}
      {btn('Producto existente', 'existente')}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   CAMPOS REUTILIZABLES: Cantidad + Precio
═══════════════════════════════════════════════ */
function CantPrecioFields({ item, setItem, lockPrecio }) {
  return (
    <>
      <div style={{ flex: '0 0 80px' }}>
        <label style={{ display: 'block', fontSize: 11, color: T.sub, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 5 }}>
          Cant. <span style={{ color: T.red }}>*</span>
        </label>
        <input
          type="number" min={1}
          value={item.cantidad}
          onChange={e => setItem(c => ({ ...c, cantidad: e.target.value }))}
          style={inp}
          onFocus={e => e.target.style.borderColor = T.accent}
          onBlur={e => e.target.style.borderColor = T.border2}
        />
      </div>
      <div style={{ flex: '1 1 100px', minWidth: 90 }}>
        <label style={{ display: 'block', fontSize: 11, color: T.sub, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 5 }}>
          Precio unit.
          {lockPrecio && <span style={{ color: T.sub, fontWeight: 400, marginLeft: 4, textTransform: 'none', letterSpacing: 0, fontSize: 10 }}>(auto)</span>}
        </label>
        <input
          type="number"
          value={item.precio_unitario}
          onChange={e => setItem(c => ({ ...c, precio_unitario: e.target.value }))}
          placeholder="Auto"
          disabled={lockPrecio}
          style={{ ...inp, opacity: lockPrecio ? 0.45 : 1, cursor: lockPrecio ? 'not-allowed' : 'text' }}
          onFocus={e => { if (!lockPrecio) e.target.style.borderColor = T.accent; }}
          onBlur={e => e.target.style.borderColor = T.border2}
        />
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════
   PANEL: PRODUCTO EXISTENTE
═══════════════════════════════════════════════ */
function SelectorExistente({ item, setItem, productos }) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', flexWrap: 'wrap' }}>
      <div style={{ flex: '2 1 200px', minWidth: 180 }}>
        <label style={{ display: 'block', fontSize: 11, color: T.sub, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 5 }}>
          Producto <span style={{ color: T.red }}>*</span>
        </label>
        <select
          value={item.producto}
          onChange={e => {
            const p = productos.find(x => String(x.id_producto) === e.target.value);
            setItem(c => ({ ...c, producto: e.target.value, precio_unitario: p?.precio || '' }));
          }}
          style={inp}
        >
          <option value="">Seleccionar...</option>
          {productos.map(p => (
            <option key={p.id_producto} value={p.id_producto}>{p.nombre} — ${p.precio}</option>
          ))}
        </select>
      </div>
      <CantPrecioFields item={item} setItem={setItem} lockPrecio={false} />
    </div>
  );
}

/* ═══════════════════════════════════════════════
   PANEL: NUEVO PRODUCTO (inline)
═══════════════════════════════════════════════ */
const EMPTY_NEW_PROD = { nombre: '', descripcion: '', precio: '', proveedor: '', categoria: '', activo: true };

function FormNuevoProducto({ newProd, setNewProd, item, setItem, provOpts, catOpts }) {
  const onChange = e => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setNewProd(f => ({ ...f, [name]: val }));
    if (name === 'precio') setItem(c => ({ ...c, precio_unitario: val }));
  };

  return (
    <div style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 12, padding: 16, marginBottom: 4 }}>
      <div style={{ fontSize: 11, color: T.accent, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 14 }}>
        Datos del nuevo producto
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 14px' }}>
        <DarkField label="Nombre"    name="nombre"    value={newProd.nombre}    onChange={onChange} required />
        <DarkField label="Precio"    name="precio"    value={newProd.precio}    onChange={onChange} type="number" required />
        <DarkField label="Proveedor" name="proveedor" value={newProd.proveedor} onChange={onChange} options={provOpts} />
        <DarkField label="Categoría" name="categoria" value={newProd.categoria} onChange={onChange} options={catOpts} />
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={{ display: 'block', fontSize: 11, color: T.sub, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 5 }}>Descripción</label>
        <textarea
          name="descripcion"
          value={newProd.descripcion}
          onChange={onChange}
          placeholder="Descripción del producto..."
          rows={2}
          style={{ ...inp, resize: 'vertical', fontFamily: 'inherit' }}
          onFocus={e => e.target.style.borderColor = T.accent}
          onBlur={e => e.target.style.borderColor = T.border2}
        />
      </div>

      <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginBottom: 16 }}>
        <input
          type="checkbox" name="activo"
          checked={!!newProd.activo}
          onChange={onChange}
          style={{ accentColor: T.accent, width: 14, height: 14 }}
        />
        <span style={{ fontSize: 12, color: T.sub }}>Marcar como activo</span>
      </label>

      {/* Cantidad para el pedido */}
      <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 14 }}>
        <div style={{ fontSize: 11, color: T.sub, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 10 }}>
          Cantidad para este pedido
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          <CantPrecioFields item={item} setItem={setItem} lockPrecio={true} />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   CONSTANTES
═══════════════════════════════════════════════ */
const EMPTY_ORDER = { cliente: '', socio: '', direccion: '', cupon: '', estado: '', fecha_entrega: '' };
const EMPTY_ITEM  = { producto: '', cantidad: 1, precio_unitario: '' };

/* ═══════════════════════════════════════════════
   WIZARD NUEVO PEDIDO
═══════════════════════════════════════════════ */
export default function NuevoPedidoWizard({
  open,
  onClose,
  onSaved,
  clientes,
  socios,
  estados,
  productos,
  direccionesPorCliente,
  onClienteChange
}) {
  const { showToast } = useApp();
  const [proveedores, setProveedores] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [step, setStep]                 = useState(1);
  const [form, setForm]                 = useState(EMPTY_ORDER);
  const [items, setItems]               = useState([]);
  const [item, setItem]                 = useState(EMPTY_ITEM);
  const [saving, setSaving]             = useState(false);
  const [pedidoCreado, setPedidoCreado] = useState(null);
  const [prodMode, setProdMode]         = useState('nuevo');
  const [newProd, setNewProd]           = useState(EMPTY_NEW_PROD);

    useEffect(() => {
    async function loadCatalogos() {
        try {
        const [provData, catData] = await Promise.all([
            api.proveedores.list(),
            api.categorias.list()
        ]);

        setProveedores(provData?.results ?? provData ?? []);
        setCategorias(catData?.results ?? catData ?? []);
        } catch (e) {
        showToast('Error cargando proveedores/categorías', 'error');
        }
    }

    if (open) {
        loadCatalogos();
    }
    }, [open]);

    const provOpts = proveedores.map(p => ({
    value: p.id_proveedor,
    label: p.nombre
    }));

    const catOpts = categorias.map(c => ({
    value: c.id_categoria,
    label: c.nombre
    }));

    const clienteOpts = clientes.map(c => ({
    value: c.id_cliente,
    label: c.nombre
    }));

const direccionOpts = direccionesPorCliente.map(d => ({
    value: d.id_direccion,
    label: [d.calle, d.ciudad, d.estado, d.cp].filter(Boolean).join(', '),
  }));
  const socioOpts  = socios.map(s  => ({ value: s.id_socio,         label: s.nombre }));
  const estadoOpts = estados.map(e => ({ value: e.id_estado_pedido, label: e.descripcion }));

  const onChangeOrder = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value, ...(name === 'cliente' ? { direccion: '' } : {}) }));
    if (name === 'cliente' && value) onClienteChange(value);
  };

  const total = items.reduce((s, i) => s + parseFloat(i.subtotal || 0), 0);

  async function confirmarPedido() {
    if (!form.cliente || !form.estado) { showToast('Cliente y estado son requeridos', 'error'); return; }
    setSaving(true);
    try {
      const nuevo = await api.pedidos.create({ ...form, total: '0.00' });
      setPedidoCreado(nuevo.id_pedido);
      setStep(2);
    } catch (e) { showToast(e.message, 'error'); }
    setSaving(false);
  }

  async function handleAddItem() {
    if (!item.cantidad) { showToast('Indica la cantidad', 'error'); return; }

    let productoId = item.producto;
    let nombreProd = '';
    let precioProd = parseFloat(item.precio_unitario || 0);

    if (prodMode === 'nuevo') {
      if (!newProd.nombre || !newProd.precio) { showToast('Nombre y precio son requeridos', 'error'); return; }
      try {
        const creado = await api.productos.create(newProd);
        productoId = creado.id_producto;
        nombreProd = creado.nombre;
        precioProd = parseFloat(creado.precio || 0);
        showToast(`Producto "${creado.nombre}" creado ✓`);
        setNewProd(EMPTY_NEW_PROD);
      } catch (e) { showToast(e.message, 'error'); return; }
    } else {
      if (!item.producto) { showToast('Selecciona un producto', 'error'); return; }
      const prod = productos.find(p => String(p.id_producto) === String(item.producto));
      nombreProd = prod?.nombre || 'Producto';
      precioProd = parseFloat(item.precio_unitario || prod?.precio || 0);
    }

    const subtotal = (precioProd * parseInt(item.cantidad)).toFixed(2);
    setItems(prev => [...prev, { producto: productoId, nombre: nombreProd, cantidad: item.cantidad, precio_unitario: precioProd, subtotal }]);
    setItem(EMPTY_ITEM);
  }

  const removeItem = idx => setItems(prev => prev.filter((_, i) => i !== idx));

  async function guardarPedido() {
    setSaving(true);
    try {
      await Promise.all(
        items.map(i => api.detalles.create({ pedido: pedidoCreado, producto: i.producto, cantidad: i.cantidad, precio_unitario: i.precio_unitario, subtotal: i.subtotal }))
      );
      await api.pedidos.update(pedidoCreado, { total: total.toFixed(2) });
      showToast('Pedido guardado exitosamente ✓');
      onSaved(); onClose();
    } catch (e) { showToast(e.message, 'error'); }
    setSaving(false);
  }

  if (!open) return null;

  const stepStyle = n => ({
    width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 12, fontWeight: 700,
    background: step >= n ? T.accent : T.hover,
    color: step >= n ? '#fff' : T.sub,
    border: `2px solid ${step === n ? T.accent : 'transparent'}`,
    transition: 'all .3s',
  });

  // preview del subtotal en tiempo real
  const previewSubtotal = (() => {
    const precio = prodMode === 'nuevo'
      ? parseFloat(newProd.precio || 0)
      : parseFloat(item.precio_unitario || 0);
    return (precio * parseInt(item.cantidad || 0)).toFixed(2);
  })();

  return (
    <DarkModal open={open} title="" onClose={onClose} wide>

      {/* Indicador de pasos */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
        <div style={stepStyle(1)}>1</div>
        <div style={{ flex: 1, height: 2, margin: '0 8px', background: step >= 2 ? T.accent : T.border, transition: 'background .4s' }} />
        <div style={stepStyle(2)}>2</div>
        <div style={{ marginLeft: 12, fontSize: 13, color: T.sub }}>
          {step === 1 ? 'Datos del pedido' : 'Agregar productos'}
        </div>
      </div>

      {/* ── Paso 1 ── */}
      <div style={{ opacity: step === 1 ? 1 : 0.35, pointerEvents: step === 1 ? 'auto' : 'none', transition: 'opacity .3s' }}>
        <div style={{ background: step === 1 ? T.cardAlt : T.hover, border: `1px solid ${step === 1 ? T.border2 : 'transparent'}`, borderRadius: 14, padding: 20, marginBottom: step === 1 ? 0 : 12 }}>
          {step > 1 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: T.sub }}>Pedido #{pedidoCreado} creado ✓</span>
              <button onClick={() => setStep(1)} style={{ background: 'transparent', border: `1px solid ${T.border2}`, color: T.accent, fontSize: 11, padding: '3px 10px', borderRadius: 6, cursor: 'pointer' }}>Editar</button>
            </div>
          )}
          {step === 1 && (
            <>
              <h4 style={{ margin: '0 0 16px', fontSize: 12, fontWeight: 700, color: T.sub, textTransform: 'uppercase', letterSpacing: '.8px' }}>Datos del pedido</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                <DarkField label="Cliente"          name="cliente"       value={form.cliente}       onChange={onChangeOrder} options={clienteOpts}  required />
                <DarkField label="Socio"            name="socio"         value={form.socio}         onChange={onChangeOrder} options={socioOpts} />
                <DarkField label="Dirección"        name="direccion"     value={form.direccion}     onChange={onChangeOrder} options={direccionOpts} />
                <DarkField label="Estado inicial"   name="estado"        value={form.estado}        onChange={onChangeOrder} options={estadoOpts}   required />
                <DarkField label="Fecha de entrega" name="fecha_entrega" value={form.fecha_entrega} onChange={onChangeOrder} type="date" />
                <DarkField label="Cupón"            name="cupon"         value={form.cupon}         onChange={onChangeOrder} />
              </div>
              <button
                onClick={confirmarPedido} disabled={saving}
                style={{ width: '100%', background: T.accent, border: 'none', color: '#fff', fontWeight: 700, fontSize: 14, padding: '12px 0', borderRadius: 10, cursor: saving ? 'wait' : 'pointer', marginTop: 6, opacity: saving ? .7 : 1, transition: 'opacity .2s' }}
              >
                {saving ? 'Creando pedido...' : 'Confirmar y agregar productos →'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── Paso 2 ── */}
      {step === 2 && (
        <div style={{ marginTop: 16, animation: 'fadeIn .3s ease' }}>
          <h4 style={{ margin: '0 0 14px', fontSize: 12, fontWeight: 700, color: T.sub, textTransform: 'uppercase', letterSpacing: '.8px' }}>Productos del pedido</h4>

          {/* Bloque selector */}
          <div style={{ background: T.cardAlt, border: `1px solid ${T.border2}`, borderRadius: 12, padding: 16, marginBottom: 16 }}>

            <ProductoModeToggle mode={prodMode} onChange={m => { setProdMode(m); setItem(EMPTY_ITEM); }} />

            {prodMode === 'existente'
              ? <SelectorExistente item={item} setItem={setItem} productos={productos} />
              : <FormNuevoProducto newProd={newProd} setNewProd={setNewProd} item={item} setItem={setItem} provOpts={provOpts} catOpts={catOpts} />
            }

            {/* Preview subtotal + botón */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, paddingTop: 12, borderTop: `1px solid ${T.border}` }}>
              <div style={{ fontSize: 12, color: T.sub }}>
                Subtotal estimado:&nbsp;
                <span style={{ color: T.green, fontWeight: 700 }}>${previewSubtotal}</span>
              </div>
              <button
                onClick={handleAddItem}
                style={{ background: T.accentDim, border: 'none', color: '#fff', fontWeight: 700, fontSize: 13, padding: '9px 20px', borderRadius: 8, cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                + Agregar al pedido
              </button>
            </div>
          </div>

          {/* Lista de ítems */}
          <div style={{ minHeight: 72, marginBottom: 16 }}>
            {items.length === 0 ? (
              <div style={{ textAlign: 'center', color: T.sub, fontSize: 13, padding: '22px 0', border: `1px dashed ${T.border}`, borderRadius: 10 }}>
                Aún no hay productos. Agrega al menos uno para continuar.
              </div>
            ) : (
              items.map((it, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: T.hover, borderRadius: 9, marginBottom: 6, border: `1px solid ${T.border}` }}>
                  <div>
                    <span style={{ fontWeight: 600, color: T.text, fontSize: 13 }}>{it.nombre}</span>
                    <span style={{ color: T.sub, fontSize: 12, marginLeft: 8 }}>× {it.cantidad} · ${parseFloat(it.precio_unitario).toFixed(2)} c/u</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ color: T.green, fontWeight: 700, fontSize: 14 }}>${it.subtotal}</span>
                    <button onClick={() => removeItem(idx)} style={{ background: 'transparent', border: 'none', color: T.red, fontSize: 16, cursor: 'pointer', opacity: .7 }}>✕</button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${T.border}`, paddingTop: 16 }}>
            <div>
              <div style={{ fontSize: 11, color: T.sub, textTransform: 'uppercase', letterSpacing: '1px' }}>Total estimado</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: T.green }}>${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => { onSaved(); onClose(); }}
                style={{ background: T.hover, border: `1px solid ${T.border2}`, color: T.sub, fontWeight: 600, fontSize: 13, padding: '10px 18px', borderRadius: 10, cursor: 'pointer' }}
              >
                Omitir productos
              </button>
              <button
                onClick={guardarPedido}
                disabled={saving || items.length === 0}
                style={{
                  background: items.length > 0 ? T.green : T.hover,
                  border: 'none',
                  color: items.length > 0 ? '#001a0d' : T.sub,
                  fontWeight: 800, fontSize: 14, padding: '10px 24px', borderRadius: 10,
                  cursor: items.length > 0 ? 'pointer' : 'not-allowed',
                  opacity: saving ? .7 : 1, transition: 'all .2s',
                }}
              >
                {saving ? 'Guardando...' : `Guardar pedido (${items.length})`}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: none; }
        }
      `}</style>
    </DarkModal>
  );
}