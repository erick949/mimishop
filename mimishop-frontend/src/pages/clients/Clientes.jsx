import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import api from '../../api';
import { useApp } from '../../context/AppContext';
import './clientes.css';
import PedidoCard from './pedido-card';

// ─── utilidad: iniciales ──────────────────────────────────────────────────────
function initials(name = '') {
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?';
}

// ─── Badge ────────────────────────────────────────────────────────────────────
function Badge({ active }) {
  return (
    <span className={`badge ${active ? 'badge-green' : 'badge-red'}`}>
      {active ? 'Activo' : 'Inactivo'}
    </span>
  );
}

// ─── Modal formulario genérico ────────────────────────────────────────────────
function FormModal({ title, onClose, onSave, children }) {
  return (
    <>
      <div className="overlay" style={{ zIndex: 150 }} onClick={onClose} />
      <div className="form-card">
        <div className="form-header">
          <span className="form-title">{title}</span>
          <button className="pf-close" style={{ position: 'static' }} onClick={onClose}>✕</button>
        </div>
        <div className="form-body">{children}</div>
        <div className="form-footer">
          <button className="btn-cancel" onClick={onClose}>Cancelar</button>
          <button className="btn-save" onClick={onSave}>Guardar</button>
        </div>
      </div>
    </>
  );
}

// ─── Confirm ──────────────────────────────────────────────────────────────────
function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <>
      <div className="overlay" style={{ zIndex: 250 }} onClick={onCancel} />
      <div className="confirm-card">
        <div className="confirm-icon">⚠️</div>
        <p className="confirm-msg" dangerouslySetInnerHTML={{ __html: message }} />
        <div className="confirm-actions">
          <button className="btn-cancel" onClick={onCancel}>Cancelar</button>
          <button className="btn-confirm-del" onClick={onConfirm}>Eliminar</button>
        </div>
      </div>
    </>
  );
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function Clientes() {

  const location = useLocation();
  const navigate = useNavigate();

  const { showToast } = useApp();

  const [clientes, setClientes]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [sortBy, setSortBy]       = useState('nombre');
  const [order, setOrder]         = useState('asc');

  const [selectedProducts, setSelectedProducts] = useState(new Set());

  // Perfil seleccionado
  const [selected, setSelected]   = useState(null);
  const [subData, setSubData]     = useState(null);
  const [tab, setTab]             = useState('telefonos');

  // Modales
  const [clienteModal, setClienteModal] = useState(null); // null | 'new' | 'edit'
  const [clienteForm, setClienteForm]   = useState({ nombre: '', activo: true });

  const [subModal, setSubModal]   = useState(null); // null | 'new' | 'edit'
  const [subForm, setSubForm]     = useState({});

  const [confirm, setConfirm]     = useState(null); // { type:'cliente'|'sub', ... }

  useEffect(() => { load(); }, []);

  useEffect(() => { 
    if (location.pathname === '/clientes/nuevo') {
      openNewCliente();
    }
  }, [location.pathname]);

  async function load() {
    setLoading(true);
    try {
      const data = await api.clientes.list();
      setClientes(data?.results ?? data ?? []);
    } catch (e) { showToast(e.message, 'error'); }
    setLoading(false);
  }

  const filtered = useMemo(() => {
    return clientes
      .filter(c => {
        const t = search.toLowerCase();
        return c.nombre?.toLowerCase().includes(t) || String(c.id_cliente).includes(t);
      })
      .sort((a, b) => {
        let va = sortBy === 'nombre' ? (a.nombre?.toLowerCase() || '') : new Date(a.created_at || 0);
        let vb = sortBy === 'nombre' ? (b.nombre?.toLowerCase() || '') : new Date(b.created_at || 0);
        if (va < vb) return order === 'asc' ? -1 : 1;
        if (va > vb) return order === 'asc' ? 1 : -1;
        return 0;
      });
  }, [clientes, search, sortBy, order]);

  // ── Cargar subrecursos ──
  async function loadSub(cliente) {
  setSelected(cliente);
  setTab('telefonos');
  setSubData(null);
  setSelectedProducts(new Set());

  const params = `?cliente_id=${cliente.id_cliente}`;

  try {
    const [tel, cor, dir, pedidosRes] = await Promise.allSettled([
      api.telefonos.list(params),
      api.correos.list(params),
      api.direcciones.list(params),
      api.pedidos.list(params),
    ]);

    const telefonos   = tel.value?.results   ?? tel.value   ?? [];
    const correos     = cor.value?.results   ?? cor.value   ?? [];
    const direcciones = dir.value?.results   ?? dir.value   ?? [];
    // Los detalles ya vienen dentro de cada pedido gracias al serializer
    const pedidos     = pedidosRes.value?.results ?? pedidosRes.value ?? [];

    setSubData({ telefonos, correos, direcciones, pedidos });

  } catch (e) {
    console.error(e);
    showToast(e.message, 'error');
  }
}

  // ── CRUD clientes ──
  function openNewCliente() {
    setClienteForm({ nombre: '', activo: true });
    setClienteModal('new');

    if (location.pathname !== '/clientes/nuevo') {
      navigate('/clientes/nuevo');
    }
  }

  function openEditCliente() {
    setClienteForm({ ...selected });
    setClienteModal('edit');
  }
  // ── CRUD pedidos/productos ──
  function toggleProduct(detalle) {
    setSelectedProducts(prev => {
      const copy = new Set(prev);

      if (copy.has(detalle.id_detalle)) {
        copy.delete(detalle.id_detalle);
      } else {
        copy.add(detalle.id_detalle);
      }

      return copy;
    });
  }

  function toggleAllProducts(pedido) {
    const detalles = pedido.detalles || [];

    setSelectedProducts(prev => {
      const copy = new Set(prev);

      const allSelected = detalles.every(d =>
        copy.has(d.id_detalle)
      );

      if (allSelected) {
        detalles.forEach(d =>
          copy.delete(d.id_detalle)
        );
      } else {
        detalles.forEach(d =>
          copy.add(d.id_detalle)
        );
      }

      return copy;
    });
  }

  function clearSelections() {
    setSelectedProducts(new Set());
  }
async function generateReport() {
  const allProducts = subData.pedidos.flatMap(p => p.detalles || []);

  const isAllSelected =
    allProducts.length > 0 &&
    allProducts.every(p => selectedProducts.has(p.id_detalle));

  const payload = isAllSelected
    ? { cliente: selected.id_cliente, all: true }
    : { cliente: selected.id_cliente, all: false, productos: [...selectedProducts] };

  try {
    showToast('Generando PDF...');
    await api.reportes.generar(payload);
    showToast('PDF descargado');
  } catch (e) {
    showToast(e.message, 'error');
  }
}


  async function saveCliente() {
    try {
      if (clienteModal === 'new') {
        await api.clientes.create(clienteForm);
        showToast('Cliente creado');
      } else {
        await api.clientes.update(clienteForm.id_cliente, clienteForm);
        showToast('Cliente actualizado');
        setSelected(prev => ({ ...prev, ...clienteForm }));
      }
      setClienteModal(null);
      load();
    } catch (e) { showToast(e.message, 'error'); }
  }

  async function deleteCliente(row) {
    try {
      await api.clientes.delete(row.id_cliente);
      showToast('Cliente eliminado');
      setConfirm(null);
      setSelected(null);
      load();
    } catch (e) { showToast(e.message, 'error'); }
  }

  // ── CRUD subrecursos ──
  function openSubNew() {
    setSubForm({ resource: tab, activo: true });
    setSubModal('new');
  }

  function openSubEdit(resource, row, idKey) {
    setSubForm({ resource, id: row[idKey], ...row });
    setSubModal('edit');
  }

  async function saveSub() {
    const { resource, id, ...data } = subForm;
    const linked = { ...data, cliente: selected.id_cliente };
    try {
      if (!id) await api[resource].create(linked);
      else     await api[resource].update(id, linked);
      showToast('Guardado');
      setSubModal(null);
      loadSub(selected);
    } catch (e) { showToast(e.message, 'error'); }
  }

  async function deleteSub(resource, id) {
    try {
      await api[resource].delete(id);
      showToast('Eliminado');
      setConfirm(null);
      loadSub(selected);
    } catch (e) { showToast(e.message, 'error'); }
  }

  // ── Helpers ──
  function onClienteForm(e) {
    const { name, value, type, checked } = e.target;
    setClienteForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  }

  function onSubForm(e) {
    const { name, value, type, checked } = e.target;
    setSubForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  }

  // ── Tabs ──
  const TABS = [
    { key: 'telefonos',   label: '📞 Teléfonos',  idKey: 'id_telefono'  },
    { key: 'correos',     label: '✉️ Correos',    idKey: 'id_correo'    },
    { key: 'direcciones', label: '📍 Direcciones', idKey: 'id_direccion' },
    { key: 'pedidos',     label: '📦 Pedidos',     idKey: 'id_pedido'   },
  ];

  const activeTab = TABS.find(t => t.key === tab);

  return (
    <div className="clientes-root">

      {/* ── HEADER ── */}
      <div className="cl-header">
        <div className="cl-title">Clientes</div>
        <button className="btn-new" onClick={openNewCliente}>
          <span>+ Nuevo cliente</span>
        </button>
      </div>

      {/* ── TOOLBAR ── */}
      <div className="cl-toolbar">
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input
            className="cl-search"
            type="text"
            placeholder="Buscar por nombre o ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select className="cl-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="nombre">Ordenar: Nombre</option>
          <option value="fecha">Ordenar: Fecha</option>
        </select>
        <button className="btn-sort" onClick={() => setOrder(o => o === 'asc' ? 'desc' : 'asc')}>
          {order === 'asc' ? '⬆ ASC' : '⬇ DESC'}
        </button>
        <span className="cl-count">
          <span>{filtered.length}</span> resultados
        </span>
      </div>

      {/* ── TABLA ── */}
      <div className="cl-table-wrap">
        {loading ? (
          <div className="cl-loading">// CARGANDO DATOS...</div>
        ) : filtered.length === 0 ? (
          <div className="cl-empty">Sin registros</div>
        ) : (
          <table className="cl-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Estado</th>
                <th>Registrado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id_cliente} onClick={() => loadSub(c)} style={{ position: 'relative' }}>
                  <td>
                    <div className="row-accent" />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div className="row-avatar">{initials(c.nombre)}</div>
                      <div>
                        <div className="row-name">{c.nombre}</div>
                        <div className="row-id">ID · {String(c.id_cliente).padStart(4, '0')}</div>
                      </div>
                    </div>
                  </td>
                  <td><Badge active={c.activo} /></td>
                  <td>
                    <div className="row-date">
                      {c.created_at ? new Date(c.created_at).toLocaleDateString('es-MX') : '—'}
                    </div>
                  </td>
                  <td onClick={e => e.stopPropagation()}>
                    <button
                      className="btn-del"
                      onClick={() => setConfirm({ type: 'cliente', row: c })}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── PROFILE CARD ── */}
      {selected && (
        <>
          <div className="overlay" onClick={() => setSelected(null)} />
          <div className="profile-card">

            {/* Banner */}
            <div className="pf-banner">
              <div className="pf-banner-line" />
            </div>

            {/* Encabezado */}
            <div className="pf-head">
              <div className="pf-avatar">{initials(selected.nombre)}</div>
              <div className="pf-info">
                <div className="pf-name">{selected.nombre}</div>
                <div className="pf-meta">
                  <span className="pf-id">ID · {String(selected.id_cliente).padStart(4, '0')}</span>
                  <Badge active={selected.activo} />
                  {selected.created_at && (
                    <span className="pf-date">
                      Creado: {new Date(selected.created_at).toLocaleString('es-MX')}
                    </span>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', paddingBottom: 4 }}>
                <button
                  className="btn-add"
                  style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
                  onClick={openEditCliente}
                >
                  ✏️ Editar
                </button>
                <button className="pf-close" style={{ position: 'static' }} onClick={() => setSelected(null)}>✕</button>
              </div>
            </div>

            {/* Tabs */}
            <div className="pf-tabs">
              {TABS.map(t => (
                <button
                  key={t.key}
                  className={`pf-tab ${tab === t.key ? 'active' : ''}`}
                  onClick={() => setTab(t.key)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Body */}
            <div className="pf-body">

              {/* Header de sección — se oculta en pedidos */}
              {tab !== 'pedidos' && (
                <div className="pf-section-header">
                  <span className="pf-section-title">
                    {activeTab?.label?.replace(/^.{2}\s/, '')}
                  </span>
                  <button className="btn-add" onClick={openSubNew}>+ Agregar</button>
                </div>
              )}

              {/* Header especial para pedidos */}
              {tab === 'pedidos' && (() => {
                const allProducts =
                  subData?.pedidos?.flatMap(
                    p => p.detalles || []
                  ) || [];

                const totalProducts =
                  allProducts.length;

                const allSelected =
                  totalProducts > 0 &&
                  allProducts.every(prod =>
                    selectedProducts.has(
                      prod.id_detalle
                    )
                  );

                const selectedCount =
                  selectedProducts.size;

                function toggleAllGlobal() {
                  setSelectedProducts(prev => {
                    const copy = new Set(prev);

                    if (allSelected) {
                      allProducts.forEach(p =>
                        copy.delete(
                          p.id_detalle
                        )
                      );
                    } else {
                      allProducts.forEach(p =>
                        copy.add(
                          p.id_detalle
                        )
                      );
                    }

                    return copy;
                  });
                }

                return (
                  <div className="pedidos-section">

                    {/* Toolbar superior */}
                    <div className="pedidos-main-toolbar">
                      <div className="pedidos-toolbar-left">
                        <div className="pedidos-title-block">
                          <span className="pf-section-title">
                            Pedidos del cliente
                          </span>

                          <span className="pedidos-subtitle">
                            Selecciona productos para generar reporte
                          </span>
                        </div>

                        <div className="pedidos-stats">
                          <div className="pedidos-stat-box">
                            <span>
                              {subData?.pedidos?.length || 0}
                            </span>
                            <small>Pedidos</small>
                          </div>

                          <div className="pedidos-stat-box active">
                            <span>
                              {selectedCount}
                            </span>
                            <small>Seleccionados</small>
                          </div>
                        </div>
                      </div>

                      <div className="pedidos-toolbar-actions">
                        <label className="global-check">
                          <input
                            type="checkbox"
                            checked={allSelected}
                            onChange={toggleAllGlobal}
                          />
                          <span>
                            Seleccionar todo
                          </span>
                        </label>

                        <button
                          className="btn-cancel"
                          disabled={!selectedCount}
                          onClick={clearSelections}
                        >
                          Limpiar
                        </button>

                        <button
                          className={`btn-generate-report ${
                            selectedCount
                              ? 'active'
                              : ''
                          }`}
                          disabled={!selectedCount}
                          onClick={generateReport}
                        >
                          📄 Generar reporte
                        </button>
                      </div>
                    </div>

                    {/* Lista */}
                    {!subData ? (
                      <div className="cl-loading">
                        // CARGANDO...
                      </div>
                    ) : subData.pedidos?.length === 0 ? (
                      <div className="pf-empty-sub">
                        Sin pedidos registrados
                      </div>
                    ) : (
                      <div className="pedidos-container">

                        <div className="pedidos-divider">
                          <span>
                            Lista de pedidos
                          </span>
                        </div>

                        <div className="pedidos-list">
                          {subData.pedidos.map(
                            pedido => (
                              <PedidoCard
                                key={
                                  pedido.id_pedido
                                }
                                pedido={pedido}
                                selectedProducts={
                                  selectedProducts
                                }
                                onToggleProduct={
                                  toggleProduct
                                }
                                onToggleAllProducts={
                                  toggleAllProducts
                                }
                              />
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {!subData ? (
                <div className="cl-loading">// CARGANDO...</div>
              ) : tab === 'telefonos' ? (
                subData.telefonos?.length === 0 ? (
                  <div className="pf-empty-sub">Sin registros</div>
                ) : (
                  <div className="pf-chips">
                    {subData.telefonos.map(r => (
                      <div key={r.id_telefono} className="pf-chip">
                        <div className="chip-icon">📞</div>
                        <div className="chip-value">{r.telefono}</div>
                        <Badge active={r.activo} />
                        <div className="chip-actions">
                          <button className="btn-chip-edit" onClick={() => openSubEdit(tab, r, 'id_telefono')}>✏️</button>
                          <button className="btn-chip-del" onClick={() => setConfirm({ type: 'sub', resource: tab, id: r.id_telefono, label: r.telefono })}>🗑</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : tab === 'correos' ? (
                subData.correos?.length === 0 ? (
                  <div className="pf-empty-sub">Sin registros</div>
                ) : (
                  <div className="pf-chips">
                    {subData.correos.map(r => (
                      <div key={r.id_correo} className="pf-chip">
                        <div className="chip-icon">✉️</div>
                        <div className="chip-value">{r.correo}</div>
                        <Badge active={r.activo} />
                        <div className="chip-actions">
                          <button className="btn-chip-edit" onClick={() => openSubEdit(tab, r, 'id_correo')}>✏️</button>
                          <button className="btn-chip-del" onClick={() => setConfirm({ type: 'sub', resource: tab, id: r.id_correo, label: r.correo })}>🗑</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : tab === 'direcciones' ? (
                subData.direcciones?.length === 0 ? (
                  <div className="pf-empty-sub">Sin registros</div>
                ) : (
                  <div className="pf-chips">
                    {subData.direcciones.map(r => (
                      <div key={r.id_direccion} className="pf-chip chip-addr">
                        <div className="chip-addr-row">
                          <div className="chip-icon">📍</div>
                          <div className="chip-value">{r.calle}</div>
                          <Badge active={r.activo} />
                          <div className="chip-actions">
                            <button className="btn-chip-edit" onClick={() => openSubEdit(tab, r, 'id_direccion')}>✏️</button>
                            <button className="btn-chip-del" onClick={() => setConfirm({ type: 'sub', resource: tab, id: r.id_direccion, label: r.calle })}>🗑</button>
                          </div>
                        </div>
                        <div className="chip-addr-detail">
                          {[r.ciudad, r.estado, r.cp].filter(Boolean).join(' · ')}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ): null}
            </div>
          </div>
        </>
      )}

      {/* ── MODAL NUEVO/EDITAR CLIENTE ── */}
      {clienteModal && (
        <FormModal
          title={clienteModal === 'new' ? 'Nuevo Cliente' : 'Editar Cliente'}
          onClose={() => {
              setClienteModal(null);
              navigate('/clientes');
            }}  

          onSave={saveCliente}
        >
          <div className="form-field">
            <label className="form-label">Nombre</label>
            <input
              className="form-input"
              type="text"
              name="nombre"
              placeholder="Nombre del cliente"
              value={clienteForm.nombre}
              onChange={onClienteForm}
              autoFocus
            />
          </div>
          <label className="form-check">
            <input
              type="checkbox"
              name="activo"
              checked={!!clienteForm.activo}
              onChange={onClienteForm}
            />
            <span className="form-check-label">Cliente activo</span>
          </label>
        </FormModal>
      )}

      {/* ── MODAL NUEVO/EDITAR SUBRECURSO ── */}
      {subModal && (
        <FormModal
          title={subModal === 'new' ? `Agregar ${tab}` : `Editar ${tab}`}
          onClose={() => setSubModal(null)}
          onSave={saveSub}
        >
          {tab === 'telefonos' && (
            <div className="form-field">
              <label className="form-label">Teléfono</label>
              <input className="form-input" type="tel" name="telefono" placeholder="10 dígitos"
                value={subForm.telefono || ''} onChange={onSubForm} autoFocus />
            </div>
          )}

          {tab === 'correos' && (
            <div className="form-field">
              <label className="form-label">Correo electrónico</label>
              <input className="form-input" type="email" name="correo" placeholder="correo@ejemplo.com"
                value={subForm.correo || ''} onChange={onSubForm} autoFocus />
            </div>
          )}

          {tab === 'direcciones' && (
            <>
              <div className="form-field">
                <label className="form-label">Calle</label>
                <input className="form-input" type="text" name="calle" placeholder="Calle y número"
                  value={subForm.calle || ''} onChange={onSubForm} autoFocus />
              </div>
              <div className="form-field">
                <label className="form-label">Ciudad</label>
                <input className="form-input" type="text" name="ciudad" placeholder="Ciudad"
                  value={subForm.ciudad || ''} onChange={onSubForm} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-field">
                  <label className="form-label">Estado</label>
                  <input className="form-input" type="text" name="estado" placeholder="Estado"
                    value={subForm.estado || ''} onChange={onSubForm} />
                </div>
                <div className="form-field">
                  <label className="form-label">C.P.</label>
                  <input className="form-input" type="text" name="cp" placeholder="00000"
                    value={subForm.cp || ''} onChange={onSubForm} />
                </div>
              </div>
            </>
          )}

          <label className="form-check">
            <input type="checkbox" name="activo" checked={!!subForm.activo} onChange={onSubForm} />
            <span className="form-check-label">Activo</span>
          </label>
        </FormModal>
      )}

      {/* ── CONFIRM ── */}
      {confirm && (
        <>
          <div className="overlay" style={{ zIndex: 250 }} onClick={() => setConfirm(null)} />
          <div className="confirm-card">
            <div className="confirm-icon">⚠️</div>
            <p className="confirm-msg">
              {confirm.type === 'cliente'
                ? <>¿Eliminar cliente <strong>"{confirm.row.nombre}"</strong>? Esta acción no se puede deshacer.</>
                : <>¿Eliminar <strong>"{confirm.label}"</strong>?</>
              }
            </p>
            <div className="confirm-actions">
              <button className="btn-cancel" onClick={() => setConfirm(null)}>Cancelar</button>
              <button
                className="btn-confirm-del"
                onClick={() =>
                  confirm.type === 'cliente'
                    ? deleteCliente(confirm.row)
                    : deleteSub(confirm.resource, confirm.id)
                }
              >
                Eliminar
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}