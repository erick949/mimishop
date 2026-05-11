import { NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const NAV = [
  { section: 'OPERACIONES' },
  { to: '/',            icon: '📊', label: 'Dashboard'  },
  { to: '/pedidos',     icon: '📑', label: 'Pedidos'    },
  { to: '/paquetes',    icon: '🚚', label: 'Logística'  },
  { to: '/pagos',       icon: '💳', label: 'Pagos'      },
  { section: 'CATÁLOGOS' },
  { to: '/clientes',    icon: '👤', label: 'Clientes'   },
  { to: '/productos',   icon: '🛍️', label: 'Productos'  },
  { to: '/proveedores', icon: '🏢', label: 'Proveedores'},
  { to: '/cupones',     icon: '🏷️', label: 'Cupones'    },
  { section: 'SISTEMA' },
  { to: '/usuarios',    icon: '🔑', label: 'Usuarios'   },
  { to: '/socios',      icon: '🤝', label: 'Socios'     },
];

export default function Layout({ children }) {
  const { user, logout } = useApp();

  const inicial = user?.usuario?.[0]?.toUpperCase() || 'U';
  const nivel   = user?.nivel_acceso ?? '?';

  return (
    <div className="app-layout">

      {/* ── Sidebar ── */}
      <aside className="sidebar">

        {/* Brand */}
        <div className="sidebar-brand">
          <span className="brand-icon">⚡</span>
          <span className="brand-name">CRM Panel</span>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          {NAV.map((item, i) =>
            item.section ? (
              <div key={i} className="nav-section">{item.section}</div>
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            )
          )}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{inicial}</div>
            <div>
              <div className="user-name">{user?.usuario || 'Usuario'}</div>
              <div className="user-role">Nivel {nivel}</div>
            </div>
          </div>
          <button className="logout-btn" onClick={logout}>
            Cerrar sesión
          </button>
        </div>

      </aside>

      {/* ── Contenido principal ── */}
      <main className="main-content">
        {children}
      </main>

    </div>
  );
}