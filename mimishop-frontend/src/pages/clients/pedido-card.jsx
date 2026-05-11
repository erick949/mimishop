import { useState, useRef, useCallback } from 'react';
import './pedido-card.css';

/* ── Iconos por categoría ── */
const CAT_ICONS = {
  electronica:  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  ropa:         <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z"/></svg>,
  alimentos:    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></svg>,
  hogar:        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  default:      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-4 0v2"/><path d="M8 7V5a2 2 0 014 0"/></svg>,
};

function getCatIcon(cat) {
  if (!cat) return CAT_ICONS.default;
  const k = cat.toLowerCase();
  if (k.includes('electr'))   return CAT_ICONS.electronica;
  if (k.includes('ropa') || k.includes('vest')) return CAT_ICONS.ropa;
  if (k.includes('alim') || k.includes('food')) return CAT_ICONS.alimentos;
  if (k.includes('hogar') || k.includes('casa')) return CAT_ICONS.hogar;
  return CAT_ICONS.default;
}

function truncateId(id) {
  if (!id) return '';
  const str = String(id);
  if (str.length <= 10) return str;
  return str.slice(0, 8) + '…';
}

function useCopyId() {
  const [copiedId, setCopiedId] = useState(null);
  const timerRef = useRef(null);

  const copy = useCallback((text, key) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopiedId(key);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopiedId(null), 1800);
  }, []);

  return { copiedId, copy };
}

/* ── Resaltar coincidencias de búsqueda en texto ── */
function Highlight({ text, query }) {
  if (!query || !text) return <>{text}</>;
  const str = String(text);
  const idx = str.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{str}</>;
  return (
    <>
      {str.slice(0, idx)}
      <mark className="pc-highlight">{str.slice(idx, idx + query.length)}</mark>
      {str.slice(idx + query.length)}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   PedidoCard — ahora recibe globalSearch desde el padre
   - open = true por defecto (desplegado)
   - Sin barra de búsqueda interna
   - Resalta coincidencias con globalSearch
═══════════════════════════════════════════════════════════════════ */
export default function PedidoCard({
  pedido,
  selectedProducts,
  onToggleProduct,
  onToggleAllProducts,
  globalSearch = '',        // ← nuevo prop
  forceOpen,                // ← controlado externamente (expand/collapse all)
}) {
  // Abierto por defecto; si el padre controla forceOpen lo usamos
  const [localOpen, setLocalOpen] = useState(true);
  const open = forceOpen !== undefined ? forceOpen : localOpen;
  const setOpen = (val) => setLocalOpen(typeof val === 'function' ? val(localOpen) : val);

  const [filterStatus, setFilterStatus] = useState('todos');
  const { copiedId, copy } = useCopyId();

  const detalles = pedido.detalles || [];

  const total = detalles.reduce(
    (s, d) => s + parseFloat(d.subtotal || (d.precio_unitario || 0) * (d.cantidad || 1)),
    0
  );

  const subtotal = detalles.reduce(
    (s, d) => s + parseFloat(d.precio_unitario || d.precio || 0) * (d.cantidad || 1),
    0
  );

  const allSelected   = detalles.length > 0 && detalles.every((d) => selectedProducts.has(d.id_detalle));
  const someSelected  = detalles.some((d) => selectedProducts.has(d.id_detalle));
  const selectedCount = detalles.filter((d) => selectedProducts.has(d.id_detalle)).length;
  const isPartial     = someSelected && !allSelected;

  const selectedTotal = detalles
    .filter((d) => selectedProducts.has(d.id_detalle))
    .reduce((s, d) => {
      const precio = parseFloat(d.precio_unitario || d.precio || 0);
      return s + precio * (d.cantidad || 1);
    }, 0);

  /* ── Filtrado: búsqueda global + filtro de estado ── */
  const filteredDetalles = detalles.filter((d) => {
    const nombre = (d.producto_nombre || d.producto?.nombre || d.producto || '').toLowerCase();
    const sku    = (d.sku || d.codigo || d.producto?.codigo || '').toLowerCase();
    const query  = globalSearch.toLowerCase();
    const matchSearch = !query || nombre.includes(query) || sku.includes(query);

    let matchStatus = true;
    if (filterStatus === 'activo')   matchStatus = d.activo === true;
    if (filterStatus === 'inactivo') matchStatus = d.activo === false;

    return matchSearch && matchStatus;
  });

  // Si hay búsqueda global y este pedido no tiene resultados, no renderizar
  if (globalSearch && filteredDetalles.length === 0) return null;

  const statusColor = pedido.estado
    ? pedido.estado === 'completado' ? 'status-green'
    : pedido.estado === 'cancelado'  ? 'status-red'
    : pedido.estado === 'pendiente'  ? 'status-amber'
    : 'status-blue'
    : 'status-blue';

  function handleIdClick(e) {
    e.stopPropagation();
    copy(pedido.id_pedido, 'header');
  }

  return (
    <div className={`pc-root ${open ? 'pc-root--open' : ''}`}>

      {/* ── HEADER ── */}
      <div className="pc-header" onClick={() => setOpen((o) => !o)}>
        <div className="pc-indicator" />

        <div className="pc-header-main">
          <div className="pc-icon-wrap">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
          </div>

          <div className="pc-info">
            <div className="pc-nombre">
              {pedido.nombre || pedido.codigo || `Pedido #${String(pedido.id_pedido).padStart(4, '0')}`}
            </div>
            <div className="pc-meta-row">
              <span
                className={`pc-id ${copiedId === 'header' ? 'pc-id--copied' : ''}`}
                data-tooltip={copiedId === 'header' ? '¡Copiado!' : 'Copiar ID'}
                onClick={handleIdClick}
                title={String(pedido.id_pedido)}
              >
                #{truncateId(pedido.id_pedido)}
              </span>

              {pedido.created_at && (
                <span className="pc-fecha">
                  {new Date(pedido.created_at).toLocaleDateString('es-MX', {
                    day: '2-digit', month: 'short', year: 'numeric',
                  })}
                </span>
              )}
              {pedido.updated_at && pedido.updated_at !== pedido.created_at && (
                <span className="pc-fecha-mod">
                  Mod. {new Date(pedido.updated_at).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="pc-header-stats">
          {pedido.estado && (
            <span className={`pc-status ${statusColor}`}>{pedido.estado}</span>
          )}
          <div className="pc-stat">
            <span className="pc-stat-val">{detalles.length}</span>
            <span className="pc-stat-lbl">productos</span>
          </div>
          {someSelected && (
            <div className={`pc-stat ${isPartial ? 'pc-stat--partial' : 'pc-stat--selected'}`}>
              <span className="pc-stat-val">{selectedCount}</span>
              <span className="pc-stat-lbl">selec.</span>
            </div>
          )}
          <div className="pc-total">
            <span className="pc-total-currency">MXN</span>
            <span className="pc-total-amount">
              ${total.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div className={`pc-chevron ${open ? 'pc-chevron--open' : ''}`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </div>

      {/* ── TABLA DE PRODUCTOS ── */}
      {open && (
        <div className="pc-products">

          {/* Toolbar de selección + filtros de estado */}
          <div className="pc-table-toolbar">
            <div className="pc-table-toolbar-left">
              <label className="pc-check-all-label" onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  className="pc-checkbox"
                  checked={allSelected}
                  ref={(el) => el && (el.indeterminate = someSelected && !allSelected)}
                  onChange={() => onToggleAllProducts(pedido)}
                />
                <span>Seleccionar todo</span>
              </label>

              {someSelected && (
                <span className={`pc-selection-badge ${isPartial ? 'pc-selection-badge--partial' : ''}`}>
                  {selectedCount} de {detalles.length}
                </span>
              )}

              {/* Filtros de estado movidos aquí */}
              <div className="pc-filter-chips">
                {['todos', 'activo', 'inactivo'].map((s) => (
                  <button
                    key={s}
                    className={`pc-filter-chip ${filterStatus === s ? 'pc-filter-chip--active' : ''}`}
                    onClick={(e) => { e.stopPropagation(); setFilterStatus(s); }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="pc-table-toolbar-right">
              {pedido.descuento != null && (
                <span className="pc-discount-pill">Desc. {pedido.descuento}%</span>
              )}
              <span className="pc-subtotal-label">
                Subtotal: <strong>${subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</strong>
              </span>
            </div>
          </div>

          {detalles.length === 0 ? (
            <div className="pc-empty">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>Sin productos en este pedido</span>
            </div>
          ) : filteredDetalles.length === 0 ? (
            <div className="pc-empty-search">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <span>Sin resultados para <span>"{globalSearch}"</span></span>
            </div>
          ) : (
            <div className="pc-table-wrap">
              {globalSearch && (
                <div className="pc-search-notice">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  {filteredDetalles.length} resultado{filteredDetalles.length !== 1 ? 's' : ''} para "<strong>{globalSearch}</strong>"
                </div>
              )}
              <table className="pc-table">
                <thead>
                  <tr>
                    <th className="pc-th pc-th--check"></th>
                    <th className="pc-th pc-th--num">#</th>
                    <th className="pc-th pc-th--nombre">Producto</th>
                    <th className="pc-th pc-th--sku">SKU / Cód.</th>
                    <th className="pc-th pc-th--cat">Categoría</th>
                    <th className="pc-th pc-th--qty">Cant.</th>
                    <th className="pc-th pc-th--precio">Precio U.</th>
                    <th className="pc-th pc-th--total">Total</th>
                    <th className="pc-th pc-th--status">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDetalles.map((d, i) => {
                    const isSelected  = selectedProducts.has(d.id_detalle);
                    const precioUnit  = parseFloat(d.precio_unitario || d.precio || 0);
                    const lineTotal   = precioUnit * (d.cantidad || 1);
                    const cat         = d.categoria || d.producto?.categoria;
                    const skuFull     = d.sku || d.codigo || d.producto?.codigo || '';
                    const nombreText  = d.producto_nombre || d.producto?.nombre || d.producto || 'Sin nombre';

                    return (
                      <tr
                        key={d.id_detalle || i}
                        className={`pc-tr ${isSelected ? 'pc-tr--selected' : ''}`}
                        onClick={() => onToggleProduct(d)}
                      >
                        <td className="pc-td pc-td--check">
                          <input
                            type="checkbox"
                            className="pc-checkbox"
                            checked={isSelected}
                            onChange={() => onToggleProduct(d)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </td>

                        <td className="pc-td pc-td--num">
                          <span className="pc-row-num">{i + 1}</span>
                        </td>

                        <td className="pc-td pc-td--nombre">
                          <div className="pc-prod-nombre">
                            <Highlight text={nombreText} query={globalSearch} />
                          </div>
                          {d.descripcion && (
                            <div className="pc-prod-desc">{d.descripcion}</div>
                          )}
                        </td>

                        <td className="pc-td pc-td--sku">
                          {skuFull ? (
                            <span
                              className="pc-sku"
                              title={skuFull}
                              onClick={(e) => { e.stopPropagation(); copy(skuFull, `sku-${d.id_detalle}`); }}
                            >
                              <Highlight text={truncateId(skuFull)} query={globalSearch} />
                            </span>
                          ) : (
                            <span className="pc-empty-cell">—</span>
                          )}
                        </td>

                        <td className="pc-td pc-td--cat">
                          {cat ? (
                            <span className="pc-cat-pill">
                              {getCatIcon(cat)}
                              {cat}
                            </span>
                          ) : (
                            <span className="pc-empty-cell">—</span>
                          )}
                        </td>

                        <td className="pc-td pc-td--qty">
                          <span className="pc-qty-badge">{d.cantidad || 1}</span>
                        </td>

                        <td className="pc-td pc-td--precio">
                          <span className="pc-precio">
                            ${precioUnit.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                          </span>
                        </td>

                        <td className="pc-td pc-td--total">
                          <span className={`pc-line-total ${isSelected ? 'pc-line-total--active' : ''}`}>
                            ${lineTotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                          </span>
                        </td>

                        <td className="pc-td pc-td--status">
                          {d.activo != null ? (
                            <span className={`pc-prod-status ${d.activo ? 'pc-prod-status--active' : 'pc-prod-status--inactive'}`}>
                              {d.activo ? 'Activo' : 'Inact.'}
                            </span>
                          ) : (
                            <span className="pc-empty-cell">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>

                <tfoot>
                  <tr className="pc-tfoot-row">
                    <td colSpan="7" className="pc-tfoot-label">Total del pedido</td>
                    <td className="pc-tfoot-total">
                      ${total.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td></td>
                  </tr>
                  {someSelected && (
                    <tr className="pc-tfoot-row pc-tfoot-row--selected">
                      <td colSpan="7" className="pc-tfoot-label">
                        Total seleccionado ({selectedCount} {selectedCount === 1 ? 'item' : 'items'})
                      </td>
                      <td className="pc-tfoot-total pc-tfoot-total--selected">
                        ${selectedTotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </td>
                      <td></td>
                    </tr>
                  )}
                </tfoot>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════════
   GlobalSearchBar — úsala UNA sola vez en el componente padre,
   encima de la lista de pedidos.

   Ejemplo de uso en el padre:

     const [globalSearch, setGlobalSearch] = useState('');
     const [allOpen, setAllOpen] = useState(true);

     <GlobalSearchBar
       value={globalSearch}
       onChange={setGlobalSearch}
       allOpen={allOpen}
       onToggleAll={() => setAllOpen(o => !o)}
       totalPedidos={pedidos.length}
     />

     {pedidos.map(p => (
       <PedidoCard
         key={p.id_pedido}
         pedido={p}
         globalSearch={globalSearch}
         forceOpen={allOpen}
         ...
       />
     ))}
═══════════════════════════════════════════════════════════════════ */
export function GlobalSearchBar({ value, onChange, allOpen, onToggleAll, totalPedidos = 0 }) {
  return (
    <div className="pc-global-bar">
      {/* Búsqueda */}
      <div className="pc-global-search-wrap">
        <span className="pc-search-icon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </span>
        <input
          className="pc-global-search-input"
          type="text"
          placeholder="Buscar en todos los pedidos por nombre o SKU…"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {value && (
          <button className="pc-global-clear" onClick={() => onChange('')} title="Limpiar búsqueda">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        )}
      </div>

      {/* Controles de expansión */}
      <div className="pc-global-controls">
        <span className="pc-global-count">{totalPedidos} pedidos</span>
        <button className="pc-expand-all-btn" onClick={onToggleAll}>
          {allOpen ? (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="18 15 12 9 6 15"/>
              </svg>
              Comprimir todos
            </>
          ) : (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
              Expandir todos
            </>
          )}
        </button>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════════
   FloatingActionBar — sin cambios
═══════════════════════════════════════════════════════════════════ */
export function FloatingActionBar({ selectedProducts, allDetalles = [], onGenerar, onClear }) {
  const hasSelection = selectedProducts.size > 0;

  const selectedTotal = allDetalles
    .filter((d) => selectedProducts.has(d.id_detalle))
    .reduce((s, d) => {
      const precio = parseFloat(d.precio_unitario || d.precio || 0);
      return s + precio * (d.cantidad || 1);
    }, 0);

  return (
    <div className={`pc-floating-bar ${hasSelection ? 'pc-floating-bar--visible' : ''}`}>
      <div className="pc-floating-bar-info">
        <span className="pc-floating-count">{selectedProducts.size}</span>
        <span className="pc-floating-label">
          {selectedProducts.size === 1 ? 'producto' : 'productos'}
        </span>
      </div>

      <div className="pc-floating-total">
        <span className="pc-floating-label">Total</span>
        <span className="pc-floating-total-amount">
          ${selectedTotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
        </span>
      </div>

      <button className="pc-floating-btn pc-floating-btn--primary" onClick={onGenerar}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
        Generar reporte
      </button>

      <button className="pc-floating-btn pc-floating-btn--clear" onClick={onClear} title="Limpiar selección">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  );
}