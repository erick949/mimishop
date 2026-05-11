import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/layout/Layout';
import { Toast } from './components/ui';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/clients/Clientes';
import Pedidos from './pages/orders/Pedidos';
import Productos from './pages/products/Productos';
import Proveedores from './pages/providers/Proveedores';
import Paquetes from './pages/logistics/Paquetes';
import Pagos from './pages/payments/Pagos';
import Usuarios from './pages/users/Usuarios';
import Socios from './pages/users/Socios';
import Login from './pages/Login';
import Cupones from './pages/providers/Cupones';
import Pruebas from './pages/prueba/Prueba';

function PrivateRoute() {
  const { user } = useApp();
  return user ? <Outlet /> : <Navigate to="/login" />;
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}

function AppInner() {
  const { toast } = useApp();

  return (
    <>
      <Toast toast={toast} />
      <BrowserRouter>
        <Routes>

          {/* Ruta pública */}
          <Route path="/login" element={<Login />} />

          {/* Rutas protegidas */}
          <Route element={<PrivateRoute />}>
            <Route element={<Layout><Outlet /></Layout>}>

              <Route path="/" element={<Dashboard />} />
              <Route path="/clientes" element={<Clientes />} />
              <Route path="/clientes/nuevo" element={<Clientes />} />

              <Route path="/pedidos" element={<Pedidos />} />
              <Route path="/pedidos/nuevo" element={<Pedidos />} />

              <Route path="/productos" element={<Productos />} />
              <Route path="/productos/nuevo" element={<Productos />} />

              <Route path="/proveedores" element={<Proveedores />} />
              <Route path="/proveedores/nuevo" element={<Proveedores />} />

              <Route path="/paquetes" element={<Paquetes />} />
              <Route path="/paquetes/nuevo" element={<Paquetes />} />

              <Route path="/pagos" element={<Pagos />} />
              <Route path="/pagos/nuevo" element={<Pagos />} />

              <Route path="/usuarios" element={<Usuarios />} />
              <Route path="/usuarios/nuevo" element={<Usuarios />} />

              <Route path="/socios" element={<Socios />} />
              <Route path="/socios/nuevo" element={<Socios />} />

              <Route path="/cupones"     element={<Cupones />}    />
              <Route path="/cupones/nuevo" element={<Cupones />}    />

              <Route path="/pruebas"    element={<Pruebas />}   />
              <Route path="/pruebas/nuevo" element={<Pruebas />}   />

            </Route>
          </Route>

        </Routes>
      </BrowserRouter>
    </>
  );
}