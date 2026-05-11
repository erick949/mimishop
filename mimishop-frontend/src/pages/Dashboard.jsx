import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useApp } from '../context/AppContext';
import { Chart, registerables } from 'chart.js';
import { Text } from '@/design-system/atoms/Text';
import { StatCard } from '@/design-system/molecules/StatCard';
import { DataTable } from '@/design-system/organisms/DataTable';
import { Button } from '@/design-system/atoms/Button';
import { Badge } from '@/design-system/atoms/Badge';
import { Spinner } from '@/design-system/atoms/Spinner';
import { PageHeader } from '@/design-system/organisms/PageHeader';
import { Card } from '@/design-system/molecules/Card';

Chart.register(...registerables);

// ── helpers & THEME ──────────────────────────────────────────────────────────
const THEME = {
  bg: '#030508',
  cardBg: 'rgba(10, 15, 25, 0.65)',
  cardBorder: 'rgba(0, 243, 255, 0.15)',
  primary: '#00f3ff',
  secondary: '#bc13fe',
  success: '#00ff9d',
  danger: '#ff0055',
  warning: '#ffc107',
  textMain: '#e2e8f0',
  textMuted: '#64748b',
  glowPrimary: '0 0 15px rgba(0, 243, 255, 0.4)',
  glowSuccess: '0 0 15px rgba(0, 255, 157, 0.4)',
};

const statusColor = id => ({ 1: 'cyan', 2: 'yellow', 3: 'green', 4: 'red' }[id] || 'default');
const pagoColor = e => ({ completado: 'green', pendiente: 'yellow', cancelado: 'red' }[e] || 'default');
const paqueteColor = (estadoNombre) => {
  const desc = (estadoNombre || '').toLowerCase();
  if (desc.includes('finalizado')) return 'green';
  if (desc.includes('tránsito') || desc.includes('transito')) return 'cyan';
  if (desc.includes('pendiente')) return 'yellow';
  if (desc.includes('aduana')) return 'magenta';
  if (desc.includes('devuelto')) return 'red';
  return 'default';
};

const DONUT_COLORS = [
  '#00f3ff', '#bc13fe', '#00ff9d', '#ff0055', '#ffc107', '#3b82f6'
];

function truncateId(id) {
  if (!id) return '—';
  const s = String(id);
  if (s.length > 12 && s.includes('-')) return `#${s.slice(0, 8)}`;
  return `#${s}`;
}

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('es-MX');
};

const centerTextPlugin = {
  id: 'centerText',
  afterDraw(chart) {
    if (chart.config.type !== 'doughnut') return;
    const { ctx, chartArea } = chart;
    if (!chartArea) return;
    const { left, right, top, bottom } = chartArea;
    const cx = (left + right) / 2;
    const cy = (top + bottom) / 2;
    const total = chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#00f3ff';
    ctx.font = 'bold 24px "Courier New", monospace';
    ctx.shadowColor = '#00f3ff';
    ctx.shadowBlur = 10;
    ctx.fillText(total, cx, cy - 7);
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#64748b';
    ctx.font = '10px "Courier New", monospace';
    ctx.fillText('TOTAL', cx, cy + 10);
    ctx.restore();
  },
};
Chart.register(centerTextPlugin);

// ── Main component ────────────────────────────────────────────────────
export default function Dashboard() {
  const { showToast } = useApp();
  const navigate = useNavigate();
  const lineRef = useRef(null);
  const donutRef = useRef(null);
  const balanceRef = useRef(null);
  const lineChart = useRef(null);
  const donutChart = useRef(null);
  const balanceChart = useRef(null);

  const [stats, setStats] = useState({ clientes: 0, pedidos: 0, paquetes: 0, ingresos: 0 });
  const [pedidos, setPedidos] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [paquetes, setPaquetes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clientesMap, setClientesMap] = useState({});
  const [estadosPedidoMap, setEstadosPedidoMap] = useState({});
  const [estadosPaqueteMap, setEstadosPaqueteMap] = useState({});
  const [pedidosPorEstado, setPedidosPorEstado] = useState({});
  const [weeklyData, setWeeklyData] = useState({ current: [], prev: [], labels: [] });
  const [balanceData, setBalanceData] = useState({ labels: [], ingresos: [], valor: [] });

  useEffect(() => {
    async function loadAll() {
      const [c, p, pr, pk, pa, estPed, estPaq] = await Promise.allSettled([
        api.clientes.list(),
        api.pedidos.list(),
        api.productos.list(),
        api.paquetes.list(),
        api.pagos.list(),
        api.estadosPedido.list(),
        api.estadosPaquete.list(),
      ]);

      const count = d => d.value?.count ?? d.value?.length ?? (Array.isArray(d.value) ? d.value.length : 0);

      const rawPedidos = p.value?.results ?? p.value ?? [];
      const rawPagos = pa.value?.results ?? pa.value ?? [];
      const rawPaquetes = pk.value?.results ?? pk.value ?? [];
      const rawClientes = c.value?.results ?? c.value ?? [];
      const rawEstadosPedido = Array.isArray(estPed.value) ? estPed.value : estPed.value?.results ?? [];
      const rawEstadosPaquete = Array.isArray(estPaq.value) ? estPaq.value : estPaq.value?.results ?? [];

      const mapaClientes = Object.fromEntries(rawClientes.map(cl => [cl.id_cliente, cl.nombre]));
      setClientesMap(mapaClientes);

      const mapaEstadosPedido = {};
      rawEstadosPedido.forEach(e => { mapaEstadosPedido[e.id_estado_pedido] = e.descripcion; });
      setEstadosPedidoMap(mapaEstadosPedido);

      const mapaEstadosPaquete = {};
      rawEstadosPaquete.forEach(e => { mapaEstadosPaquete[e.id_estado_paquete] = e.descripcion; });
      setEstadosPaqueteMap(mapaEstadosPaquete);

      const conteoPedidos = {};
      rawPedidos.forEach(pd => { conteoPedidos[pd.estado] = (conteoPedidos[pd.estado] || 0) + 1; });
      setPedidosPorEstado(conteoPedidos);

      const today = new Date();
      const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
      const labels = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(today); d.setDate(today.getDate() - 6 + i);
        return days[d.getDay()];
      });
      const countByDay = (orders, offset) =>
        Array.from({ length: 7 }, (_, i) => {
          const d = new Date(today); d.setDate(today.getDate() - 6 + i - offset * 7);
          const ds = d.toISOString().slice(0, 10);
          return orders.filter(o => (o.created_at || o.fecha_pedido || '').slice(0, 10) === ds).length;
        });

      const curWeek = countByDay(rawPedidos, 0);
      const prevWeek = countByDay(rawPedidos, 1);
      setWeeklyData({ current: curWeek, prev: prevWeek, labels });

      const ingresos = rawPagos
        .filter(pd => pd.estado === 'completado')
        .reduce((s, pd) => s + parseFloat(pd.monto || 0), 0);

      setStats({ clientes: count(c), pedidos: count(p), paquetes: count(pk), ingresos });
      setPedidos(rawPedidos.slice(0, 6));
      setPagos(rawPagos.slice(0, 5));
      setPaquetes(rawPaquetes.slice(0, 5));

      // Datos para comparativa financiera por cliente
      const clientValor = {};
      const clientIngresos = {};

      rawPedidos.forEach(pd => {
        const cid = pd.cliente;
        if (!cid) return;
        clientValor[cid] = (clientValor[cid] || 0) + parseFloat(pd.total || 0);
      });

      rawPagos.forEach(pg => {
        if (pg.estado !== 'completado') return;
        const pedido = rawPedidos.find(p => p.id_pedido === pg.pedido);
        if (pedido && pedido.cliente) {
          clientIngresos[pedido.cliente] = (clientIngresos[pedido.cliente] || 0) + parseFloat(pg.monto || 0);
        }
      });

      const sorted = Object.entries(clientValor)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6);

      setBalanceData({
        labels: sorted.map(([id]) => mapaClientes[id] ? mapaClientes[id].split(' ').slice(0, 2).join(' ') : `C-${String(id).slice(0, 5)}`),
        ingresos: sorted.map(([id]) => clientIngresos[id] || 0),
        valor: sorted.map(([, v]) => v),
      });

      setLoading(false);
    }
    loadAll();
  }, []);

  // Donut chart (estados de pedido)
  useEffect(() => {
    if (!donutRef.current || Object.keys(pedidosPorEstado).length === 0) return;
    if (donutChart.current) donutChart.current.destroy();

    const labels = Object.keys(pedidosPorEstado).map(k => estadosPedidoMap[k] || `Estado ${k}`);
    const data = Object.values(pedidosPorEstado);

    donutChart.current = new Chart(donutRef.current, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: DONUT_COLORS.slice(0, data.length),
          borderWidth: 2,
          borderColor: '#030508',
          hoverOffset: 8,
          hoverBorderColor: '#fff'
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: '72%',
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(5, 10, 20, 0.9)', borderColor: THEME.primary, borderWidth: 1,
            titleColor: '#fff', bodyColor: THEME.textMain, displayColors: false,
            callbacks: {
              label: ctx => {
                const val = ctx.parsed;
                const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                return ` ${val} unidades (${Math.round(val / total * 100)}%)`;
              },
            },
          },
        },
      },
    });
  }, [pedidosPorEstado, estadosPedidoMap]);

  // Line chart (actividad semanal de pedidos)
  useEffect(() => {
    if (!lineRef.current || weeklyData.current.length === 0) return;
    if (lineChart.current) lineChart.current.destroy();

    const ctx = lineRef.current.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 200);
    gradient.addColorStop(0, 'rgba(0, 243, 255, 0.2)');
    gradient.addColorStop(1, 'rgba(0, 243, 255, 0.0)');

    lineChart.current = new Chart(lineRef.current, {
      type: 'line',
      data: {
        labels: weeklyData.labels,
        datasets: [
          {
            label: 'Esta semana',
            data: weeklyData.current,
            borderColor: THEME.primary, backgroundColor: gradient,
            fill: true, tension: 0.4, borderJoinStyle: 'round',
            pointBackgroundColor: THEME.bg, pointBorderColor: THEME.primary, pointBorderWidth: 2,
            pointRadius: 4, pointHoverRadius: 6, pointHoverBackgroundColor: THEME.primary,
          },
          {
            label: 'Semana anterior',
            data: weeklyData.prev,
            borderColor: 'rgba(255, 255, 255, 0.2)', backgroundColor: 'transparent',
            fill: false, tension: 0.4, borderDash: [5, 5], pointRadius: 0,
          },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            display: true, position: 'top', align: 'end',
            labels: { color: THEME.textMuted, font: { size: 10, family: 'monospace' }, boxWidth: 12, boxHeight: 2, padding: 14 },
          },
          tooltip: {
            backgroundColor: 'rgba(5, 10, 20, 0.9)', borderColor: THEME.primary, borderWidth: 1,
            titleColor: '#fff', bodyColor: THEME.textMain,
          },
        },
        scales: {
          x: { grid: { color: 'rgba(255, 255, 255, 0.05)', drawBorder: false }, ticks: { color: THEME.textMuted, font: { size: 10, family: 'monospace' } } },
          y: { beginAtZero: true, grid: { color: 'rgba(255, 255, 255, 0.05)', drawBorder: false }, ticks: { color: THEME.textMuted, stepSize: 1, font: { size: 10, family: 'monospace' } } },
        },
      },
    });
  }, [weeklyData]);

  // Balance chart (comparativa financiera)
  useEffect(() => {
    if (!balanceRef.current || balanceData.labels.length === 0) return;
    if (balanceChart.current) balanceChart.current.destroy();

    const ctx = balanceRef.current.getContext('2d');

    const gradIngresos = ctx.createLinearGradient(0, 0, 0, 280);
    gradIngresos.addColorStop(0, 'rgba(0, 243, 255, 0.85)');
    gradIngresos.addColorStop(1, 'rgba(0, 243, 255, 0.25)');

    const gradValor = ctx.createLinearGradient(0, 0, 0, 280);
    gradValor.addColorStop(0, 'rgba(188, 19, 254, 0.85)');
    gradValor.addColorStop(1, 'rgba(188, 19, 254, 0.25)');

    balanceChart.current = new Chart(balanceRef.current, {
      type: 'bar',
      data: {
        labels: balanceData.labels,
        datasets: [
          {
            label: 'Ingresos',
            data: balanceData.ingresos,
            backgroundColor: gradIngresos, borderColor: '#00f3ff', borderWidth: 1,
            borderRadius: 4, borderSkipped: false, barPercentage: 0.7, categoryPercentage: 0.7,
          },
          {
            label: 'Valor Productos',
            data: balanceData.valor,
            backgroundColor: gradValor, borderColor: '#bc13fe', borderWidth: 1,
            borderRadius: 4, borderSkipped: false, barPercentage: 0.7, categoryPercentage: 0.7,
          },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            display: true, position: 'top', align: 'end',
            labels: { color: THEME.textMuted, font: { size: 10, family: 'monospace' }, boxWidth: 14, boxHeight: 8, borderRadius: 2, useBorderRadius: true, padding: 16 },
          },
          tooltip: {
            backgroundColor: 'rgba(5, 10, 20, 0.92)', borderColor: THEME.primary, borderWidth: 1,
            titleColor: '#fff', bodyColor: THEME.textMain, padding: 12,
            bodyFont: { family: 'monospace', size: 11 },
            callbacks: { label: ctx => ` ${ctx.dataset.label}: $${ctx.parsed.y.toLocaleString('es-MX', { minimumFractionDigits: 2 })}` },
          },
        },
        scales: {
          x: { grid: { color: 'rgba(255, 255, 255, 0.04)', drawBorder: false }, ticks: { color: THEME.textMuted, font: { size: 10, family: 'monospace' }, maxRotation: 30 } },
          y: { beginAtZero: true, grid: { color: 'rgba(255, 255, 255, 0.04)', drawBorder: false }, ticks: { color: THEME.textMuted, font: { size: 10, family: 'monospace' }, callback: val => `$${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}` } },
        },
      },
    });
  }, [balanceData]);

  if (loading) {
    return <Spinner size="lg" color="cyan" label="INICIALIZANDO SISTEMA..." />;
  }

  const totalPagos = pagos
    .filter(pd => pd.estado === 'completado')
    .reduce((sum, pd) => sum + parseFloat(pd.monto || 0), 0);

  const donutTotal = Object.values(pedidosPorEstado).reduce((a, b) => a + b, 0);

  const curSum = weeklyData.current.reduce((a, b) => a + b, 0);
  const prevSum = weeklyData.prev.reduce((a, b) => a + b, 0);
  const wowPct = prevSum === 0 ? null : Math.round((curSum - prevSum) / prevSum * 100);

  // Filas para DataTable: Pedidos Recientes
  const pedidosRows = pedidos.map(pd => [
    <Text key="f" variant="mono" glow color="cyan" style={{ fontWeight: 600 }}>
      {truncateId(pd.id_pedido)}
    </Text>,
    <Text key="c" variant="body" color={THEME.textMain}>{clientesMap[pd.cliente] || pd.cliente}</Text>,
    <Text key="t" variant="mono" glow color="success" style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>
      ${parseFloat(pd.total || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
    </Text>,
    <Badge color={statusColor(pd.estado)} dot>
      {estadosPedidoMap[pd.estado] || `ID ${pd.estado}`}
    </Badge>,
    <Button variant="secondary" color="cyan" size="sm" onClick={() => navigate(`/pedidos/${pd.id_pedido}`)}>
      Scan
    </Button>,
  ]);

  // Filas para DataTable: Logística de Envíos (Paquetes) - MODIFICADO
  const paquetesRows = paquetes.map(pk => [
    <Text key="c" variant="mono" glow color="magenta" style={{ fontWeight: 600 }}>
      {truncateId(pk.id_paquete)}
    </Text>,
    <Text key="prov" variant="body" color={THEME.textMain}>
      {pk.proveedor_nombre || '—'}
    </Text>,
    <Text key="fecha" variant="mono" color={THEME.textMuted} style={{ fontSize: 11 }}>
      {formatDate(pk.fecha_pedido_proveedor)}
    </Text>,
    <Badge key="est" color={paqueteColor(pk.estado_nombre || '')} dot>
      {pk.estado_nombre || 'N/A'}
    </Badge>,
  ]);

  return (
    <div className="page" style={{
      background: `radial-gradient(circle at top right, rgba(188, 19, 254, 0.1), transparent 40%),
                   radial-gradient(circle at bottom left, rgba(0, 243, 255, 0.1), transparent 40%),
                   ${THEME.bg}`,
      minHeight: '100vh', padding: '24px 32px 48px'
    }}>
      <PageHeader
        title="SYSTEM DASHBOARD"
        subtitle="Interfaz principal"
        glow
        breadcrumbs={[{ label: 'Inicio', path: '/' }, { label: 'Dashboard' }]}
      />

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 24 }}>
        <StatCard label="Usuarios Activos" value={stats.clientes} icon="◈" color="cyan" progress={72} />
        <StatCard label="Órdenes Totales" value={stats.pedidos} icon="◆" color="green" progress={55} />
        <StatCard label="Envíos" value={stats.paquetes} icon="◇" color="magenta" progress={38} />
        <StatCard label="Créditos" value={`$${totalPagos.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`} icon="●" color="yellow" progress={88} />
      </div>

      {/* Row 2: Line + Donut */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 24 }}>
        <Card accentColor="cyan" hoverable>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <Text as="h3" variant="label" glow color="cyan">Actividad Semanal</Text>
              {wowPct !== null && (
                <Text variant="caption" glow color={wowPct >= 0 ? 'green' : 'red'} style={{ fontWeight: 600, marginTop: 4, display: 'block' }}>
                  {wowPct >= 0 ? '▲' : '▼'} {Math.abs(wowPct)}% Eficiencia
                </Text>
              )}
            </div>
          </div>
          <div style={{ position: 'relative', width: '100%', height: 200 }}>
            <canvas ref={lineRef} />
          </div>
        </Card>

        <Card accentColor="magenta" hoverable>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <Text as="h3" variant="label" glow color="magenta">Estado del Sistema</Text>
          </div>
          <div style={{ position: 'relative', width: '100%', height: 170 }}>
            <canvas ref={donutRef} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
            {Object.entries(pedidosPorEstado).map(([id, cant], i) => (
              <div key={id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: DONUT_COLORS[i] || '#888', flexShrink: 0, boxShadow: `0 0 8px ${DONUT_COLORS[i]}` }} />
                  <Text variant="mono" color={THEME.textMain}>
                    {estadosPedidoMap[id] ? estadosPedidoMap[id].toUpperCase() : `ESTADO ${id}`}
                  </Text>
                </div>
                <Text variant="caption" color={THEME.textMuted} style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {cant} <span style={{ fontSize: 9 }}>({donutTotal ? Math.round(cant / donutTotal * 100) : 0}%)</span>
                </Text>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Row: Comparativa Financiera con línea animada */}
      <Card accentColor="cyan" hoverable style={{ marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: 0, left: 24, right: 24, height: 2,
          background: 'linear-gradient(90deg, #00f3ff, #bc13fe, #00f3ff)',
          backgroundSize: '200% 100%', borderRadius: '0 0 4px 4px',
          animation: 'shimmerLine 4s ease-in-out infinite',
          pointerEvents: 'none',
        }} />
        <style>{`@keyframes shimmerLine { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }`}</style>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <i className="fas fa-chart-simple" style={{ color: THEME.primary, fontSize: 15 }} />
            <Text as="h3" variant="label" glow color="warning">⚡ COMPARATIVA FINANCIERA</Text>
          </div>
        </div>

        <div style={{ position: 'relative', width: '100%', height: 280 }}>
          <canvas ref={balanceRef} />
        </div>

        <div style={{
          marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.04)',
          display: 'flex', alignItems: 'center', gap: 7,
        }}>
          <i className="fas fa-info-circle" style={{ color: THEME.primary, opacity: 0.7, fontSize: 12 }} />
          <Text variant="caption" color={THEME.textMuted}>
            Ingresos vs Valor de productos por cliente (USD)
          </Text>
        </div>
      </Card>

      {/* Row 3: Pedidos + Acciones */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 24 }}>
        <DataTable
          title="Registros Recientes"
          actionLabel="VER TODOS"
          onAction={() => navigate('/pedidos')}
          columns={['FOLIO', 'CLIENTE', 'TOTAL', 'ESTADO', '']}
          rows={pedidosRows}
          emptyText="No hay datos disponibles"
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Card accentColor="cyan" hoverable>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Text as="h3" variant="label" glow color="cyan">Módulos</Text>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { label: 'Nueva Orden', icon: '⬡', color: THEME.primary, route: '/pedidos/nuevo' },
                { label: 'NCliente', icon: '⬢', color: THEME.success, route: '/clientes/nuevo' },
                { label: 'Envío', icon: '◈', color: THEME.secondary, route: '/paquetes/nuevo' },
                { label: 'Pago', icon: '◆', color: THEME.warning, route: '/pagos/nuevo' },
              ].map(({ label, icon, color, route }) => (
                <button
                  key={label}
                  onClick={() => navigate(route)}
                  style={{
                    background: 'rgba(255,255,255,0.02)', border: `1px solid rgba(255,255,255,0.05)`, borderRadius: 8,
                    padding: '14px 10px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s', width: '100%',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = color; e.currentTarget.style.boxShadow = `0 0 15px ${color}33`; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{ fontSize: 18, color, textShadow: `0 0 5px ${color}` }}>{icon}</div>
                  <Text variant="label" color={THEME.textMuted}>{label}</Text>
                </button>
              ))}
            </div>
          </Card>

          <Card accentColor="green" hoverable style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Text as="h3" variant="label" glow color="green">Transacciones</Text>
              <Text variant="mono" glow color="success" style={{ fontSize: 12, fontWeight: 700 }}>
                +${totalPagos.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </Text>
            </div>
            {pagos.slice(0, 4).map(pd => (
              <div key={pd.id_pago} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: `1px solid rgba(255,255,255,0.05)`, fontSize: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: THEME.primary, boxShadow: `0 0 5px ${THEME.primary}` }} />
                  <Text variant="mono" color={THEME.textMain}>{truncateId(pd.pedido)}</Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Text variant="mono" glow color="white" style={{ fontWeight: 600 }}>
                    ${parseFloat(pd.monto || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </Text>
                  <Badge color={pagoColor(pd.estado)} dot>
                    {pd.estado}
                  </Badge>
                </div>
              </div>
            ))}
            {pagos.length === 0 && (
              <Text variant="caption" color={THEME.textMuted} style={{ textAlign: 'center', padding: '20px 0' }}>
                Sin actividad
              </Text>
            )}
          </Card>
        </div>
      </div>

      {/* Row 4: Logística - MODIFICADO */}
      <DataTable
        title="Logística de Envíos"
        subtitle={`${stats.paquetes} unidades`}
        actionLabel="MONITOREAR"
        onAction={() => navigate('/paquetes')}
        columns={['CÓDIGO', 'PROVEEDOR', 'FECHA PEDIDO', 'ESTADO']}
        rows={paquetesRows}
        emptyText="Sistema de logística vacío"
      />
    </div>
  );
}