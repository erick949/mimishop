const BASE_URL = 'https://mimishop-backend.onrender.com';
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Token ${token}`;

  const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Error ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

const api = {

  // ─── CLIENTS ─────────────────────────────────────────────────
  clientes: {
    list:   (params = '') => request(`/api/clients/clientes/${params}`),
    get:    (id)          => request(`/api/clients/clientes/${id}/`),
    create: (data)        => request('/api/clients/clientes/', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data)    => request(`/api/clients/clientes/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id)          => request(`/api/clients/clientes/${id}/`, { method: 'DELETE' }),
  },
  telefonos: {
    list:   (params = '') => request(`/api/clients/telefonos/${params}`),
    listByCliente: (id) => request(`/api/clients/telefonos/?cliente=${id}`),
    create: (data)        => request('/api/clients/telefonos/', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data)    => request(`/api/clients/telefonos/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id)          => request(`/api/clients/telefonos/${id}/`, { method: 'DELETE' }),
  },
  correos: {
    list:   (params = '') => request(`/api/clients/correos/${params}`),
    listByCliente: (id) => request(`/api/clients/correos/?cliente=${id}`),
    create: (data)        => request('/api/clients/correos/', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data)    => request(`/api/clients/correos/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id)          => request(`/api/clients/correos/${id}/`, { method: 'DELETE' }),
  },
  direcciones: {
    list:   (params = '') => request(`/api/clients/direcciones/${params}`),
    listByCliente: (id) => request(`/api/clients/direcciones/?cliente=${id}`),
    create: (data)        => request('/api/clients/direcciones/', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data)    => request(`/api/clients/direcciones/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id)          => request(`/api/clients/direcciones/${id}/`, { method: 'DELETE' }),
  },


  // ─── ORDERS ──────────────────────────────────────────────────

reportes: {
  generar: async (payload) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${BASE_URL}/api/orders/reporte/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Token ${token}` }),
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Error ${res.status}`);
    const blob = await res.blob();
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'reporte_cliente.pdf';
    a.click();
    URL.revokeObjectURL(url);
  },
},

  pedidos: {
    list:   (params = '') => request(`/api/orders/pedidos/${params}`),
    get:    (id)          => request(`/api/orders/pedidos/${id}/`),
    create: (data)        => request('/api/orders/pedidos/', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data)    => request(`/api/orders/pedidos/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id)          => request(`/api/orders/pedidos/${id}/`, { method: 'DELETE' }),
  },
  detalles: {
    list:   (params = '') => request(`/api/orders/detalles/${params}`),
    create: (data)        => request('/api/orders/detalles/', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data)    => request(`/api/orders/detalles/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id)          => request(`/api/orders/detalles/${id}/`, { method: 'DELETE' }),
  },
  estadosPedido: {
    list: () => request('/api/orders/estados/'),
  },
  historialPedido: {
    list:   (params = '') => request(`/api/orders/historial/${params}`),
    create: (data)        => request('/api/orders/historial/', { method: 'POST', body: JSON.stringify(data) }),
  },

  // ─── PRODUCTS ────────────────────────────────────────────────
  productos: {
    list:   (params = '') => request(`/api/products/productos/${params}`),
    get:    (id)          => request(`/api/products/productos/${id}/`),
    create: (data)        => request('/api/products/productos/', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data)    => request(`/api/products/productos/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id)          => request(`/api/products/productos/${id}/`, { method: 'DELETE' }),
  },
  categorias: {
    list:   ()         => request('/api/products/categorias/'),
    create: (data)     => request('/api/products/categorias/', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/api/products/categorias/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id)       => request(`/api/products/categorias/${id}/`, { method: 'DELETE' }),
  },

  // ─── PROVIDERS ───────────────────────────────────────────────
  proveedores: {
    list:   ()         => request('/api/providers/proveedores/'),
    get:    (id)       => request(`/api/providers/proveedores/${id}/`),
    create: (data)     => request('/api/providers/proveedores/', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/api/providers/proveedores/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id)       => request(`/api/providers/proveedores/${id}/`, { method: 'DELETE' }),
  },
  cupones: {
    list:   (params = '') => request(`/api/providers/cupones/${params}`),
    create: (data)        => request('/api/providers/cupones/', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data)    => request(`/api/providers/cupones/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id)          => request(`/api/providers/cupones/${id}/`, { method: 'DELETE' }),
  },

  // ─── LOGISTICS ───────────────────────────────────────────────
  paquetes: {
    list:   (params = '') => request(`/api/logistics/paquetes/${params}`),
    get:    (id)          => request(`/api/logistics/paquetes/${id}/`),
    create: (data)        => request('/api/logistics/paquetes/', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data)    => request(`/api/logistics/paquetes/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
  },
  estadosPaquete: {
    list: () => request('/api/logistics/estados/'),
  },
  historialPaquete: {
    list:   (params = '') => request(`/api/logistics/historial/${params}`),
    create: (data)        => request('/api/logistics/historial/', { method: 'POST', body: JSON.stringify(data) }),
  },

  // ─── PAYMENTS ────────────────────────────────────────────────
  pagos: {
    list:   (params = '') => request(`/api/payments/pagos/${params}`),
    get:    (id)          => request(`/api/payments/pagos/${id}/`),
    create: (data)        => request('/api/payments/pagos/', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data)    => request(`/api/payments/pagos/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
  },
  comisiones: {
    list:   (params = '') => request(`/api/payments/comisiones/${params}`),
    update: (id, data)    => request(`/api/payments/comisiones/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
  },

  // ─── USERS ───────────────────────────────────────────────────
  usuarios: {
    list:   ()         => request('/api/users/usuarios/'),
    create: (data)     => request('/api/users/usuarios/', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/api/users/usuarios/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id)       => request(`/api/users/usuarios/${id}/`, { method: 'DELETE' }),
  },
  socios: {
    list:   ()         => request('/api/users/socios/'),
    create: (data)     => request('/api/users/socios/', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/api/users/socios/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id)       => request(`/api/users/socios/${id}/`, { method: 'DELETE' }),
  },
};

export default api;
