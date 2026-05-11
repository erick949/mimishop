import { useState, useEffect } from 'react';
import api from '../../api';
import { Table, Modal, Field, Badge, Confirm } from '../../components/ui';
import { useApp } from '../../context/AppContext';
import NuevoProductoForm, { EMPTY_PROD } from './NuevoProductoForm';

const EMPTY_CAT = { nombre: '', descripcion: '' };

export default function Productos() {
  const { showToast } = useApp();
  const [tab, setTab] = useState('productos');

  const [productos, setProductos] = useState([]);
  const [loadingP,  setLoadingP]  = useState(true);
  const [modalP,    setModalP]    = useState(null);
  const [formP,     setFormP]     = useState(EMPTY_PROD);
  const [confirmP,  setConfirmP]  = useState(null);

  const [categorias, setCategorias] = useState([]);
  const [loadingC,   setLoadingC]   = useState(true);
  const [modalC,     setModalC]     = useState(null);
  const [formC,      setFormC]      = useState(EMPTY_CAT);
  const [confirmC,   setConfirmC]   = useState(null);

  const [proveedores, setProveedores] = useState([]);

  useEffect(() => {
    loadProductos();
    loadCategorias();
    api.proveedores.list().then(d => setProveedores(d?.results ?? d ?? []));
  }, []);

  async function loadProductos() {
    setLoadingP(true);
    try {
      const data = await api.productos.list();
      setProductos(data?.results ?? data ?? []);
    } catch (e) { showToast(e.message, 'error'); }
    setLoadingP(false);
  }

  async function loadCategorias() {
    setLoadingC(true);
    try {
      const data = await api.categorias.list();
      setCategorias(data?.results ?? data ?? []);
    } catch (e) { showToast(e.message, 'error'); }
    setLoadingC(false);
  }

  function onChangeP(e) {
    const { name, value, type, checked } = e.target;
    setFormP(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  }

  function onChangeC(e) {
    setFormC(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function saveProducto() {
    try {
      if (modalP === 'new') await api.productos.create(formP);
      else await api.productos.update(formP.id_producto, formP);
      showToast(`Producto ${modalP === 'new' ? 'creado' : 'actualizado'}`);
      setModalP(null);
      loadProductos();
    } catch (e) { showToast(e.message, 'error'); }
  }

  async function saveCategoria() {
    try {
      if (modalC === 'new') await api.categorias.create(formC);
      else await api.categorias.update(formC.id_categoria, formC);
      showToast(`Categoría ${modalC === 'new' ? 'creada' : 'actualizada'}`);
      setModalC(null);
      loadCategorias();
    } catch (e) { showToast(e.message, 'error'); }
  }

  async function removeProducto(row) {
    await api.productos.delete(row.id_producto);
    showToast('Producto eliminado');
    setConfirmP(null);
    loadProductos();
  }

  async function removeCategoria(row) {
    await api.categorias.delete(row.id_categoria);
    showToast('Categoría eliminada');
    setConfirmC(null);
    loadCategorias();
  }

  const provOpts = proveedores.map(p => ({ value: p.id_proveedor, label: p.nombre }));
  const catOpts  = categorias.map(c  => ({ value: c.id_categoria, label: c.nombre }));

  const prodColumns = [
    { key: 'id_producto', label: 'ID' },
    { key: 'nombre',      label: 'Nombre' },
    { key: 'categoria',   label: 'Categoría', render: r => r.categoria_nombre || '—' },
    { key: 'proveedor',   label: 'Proveedor', render: r => r.proveedor_nombre || '—' },
    { key: 'precio',      label: 'Precio',    render: r => `$${parseFloat(r.precio || 0).toFixed(2)}` },
    { key: 'activo',      label: 'Estado',    render: r => <Badge text={r.activo ? 'Activo' : 'Inactivo'} color={r.activo ? 'green' : 'red'} /> },
  ];

  const catColumns = [
    { key: 'id_categoria', label: 'ID' },
    { key: 'nombre',       label: 'Nombre' },
    { key: 'descripcion',  label: 'Descripción' },
  ];

  return (
    <div className="clientes-root productos-root">

      {/* HEADER */}
      <div className="cl-header">
        <div className="cl-title">Inventario</div>
        <button
          className="btn-new"
          onClick={() => {
            if (tab === 'productos') { setFormP(EMPTY_PROD); setModalP('new'); }
            else                     { setFormC(EMPTY_CAT);  setModalC('new'); }
          }}
        >
          <span>+ Nuevo</span>
        </button>
      </div>

      {/* TABS */}
      <div className="pf-tabs">
        <button className={`pf-tab ${tab === 'productos'  ? 'active' : ''}`} onClick={() => setTab('productos')}>Productos</button>
        <button className={`pf-tab ${tab === 'categorias' ? 'active' : ''}`} onClick={() => setTab('categorias')}>Categorías</button>
      </div>

      {/* TABLAS */}
      {tab === 'productos' && (
        <div className="cl-table-wrap">
          <Table
            columns={prodColumns}
            data={productos}
            loading={loadingP}
            onEdit={r => { setFormP(r); setModalP('edit'); }}
            onDelete={r => setConfirmP(r)}
          />
        </div>
      )}

      {tab === 'categorias' && (
        <div className="cl-table-wrap">
          <Table
            columns={catColumns}
            data={categorias}
            loading={loadingC}
            onEdit={r => { setFormC(r); setModalC('edit'); }}
            onDelete={r => setConfirmC(r)}
          />
        </div>
      )}

      {/* MODAL PRODUCTO */}
      <NuevoProductoForm
        open={!!modalP}
        onClose={() => setModalP(null)}
        form={formP}
        onChange={onChangeP}
        onSave={saveProducto}
        provOpts={provOpts}
        catOpts={catOpts}
      />

      {/* MODAL CATEGORIA */}
      <Modal open={!!modalC} title="Categoría" onClose={() => setModalC(null)}>
        <Field label="Nombre" name="nombre" value={formC.nombre} onChange={onChangeC} />

        <textarea
          className="form-input"
          name="descripcion"
          value={formC.descripcion}
          onChange={onChangeC}
          placeholder="Descripción..."
        />

        <div className="form-footer">
          <button className="btn-save"   onClick={saveCategoria}>Guardar</button>
          <button className="btn-cancel" onClick={() => setModalC(null)}>Cancelar</button>
        </div>
      </Modal>

      {/* CONFIRM */}
      <Confirm open={!!confirmP} message={`Eliminar "${confirmP?.nombre}"`}
        onConfirm={() => removeProducto(confirmP)} onCancel={() => setConfirmP(null)} />

      <Confirm open={!!confirmC} message={`Eliminar "${confirmC?.nombre}"`}
        onConfirm={() => removeCategoria(confirmC)} onCancel={() => setConfirmC(null)} />

    </div>
  );
}