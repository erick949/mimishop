/**
 * NEXUS UI — SHOWCASE · DesignSystemShowcase.jsx
 * Demo interactiva de todos los componentes del design system.
 *
 * Uso:
 *   import DesignSystemShowcase from "@/design-system/showcase/DesignSystemShowcase";
 *   // Montar como página o ruta de desarrollo
 */

import { useState, useEffect } from "react";

/* ── Tokens ── */
import { TOKENS, COLOR_MAP, injectGlobalStyles } from "@/design-system/tokens";
/* ── Atoms ── */

import { Text }        from "@/design-system/atoms/Text";
import { Icon }        from "@/design-system/atoms/Icon"; 
import { Dot }         from "@/design-system/atoms/Dot";
import { Badge }       from "@/design-system/atoms/Badge";
import { Spinner }     from "@/design-system/atoms/Spinner";
import { Avatar }      from "@/design-system/atoms/Avatar";
import { Button }      from "@/design-system/atoms/Button";
import { Input }       from "@/design-system/atoms/Input";
import { TextArea }    from "@/design-system/atoms/TextArea";
import { SelectInput } from "@/design-system/atoms/SelectInput";
import { Checkbox }    from "@/design-system/atoms/Checkbox";
import { Switch }      from "@/design-system/atoms/Switch";
import { ProgressBar } from "@/design-system/atoms/ProgressBar";
import { Divider }     from "@/design-system/atoms/Divider";
import { Tag }         from "@/design-system/atoms/Tag";
import { Kbd }         from "@/design-system/atoms/Kbd";
import { Tooltip }     from "@/design-system/atoms/Tooltip";

/* ── Molecules ── */
import { Card }         from "@/design-system/molecules/Card";
import { FormField }    from "@/design-system/molecules/FormField";
import { SearchBar }    from "@/design-system/molecules/SearchBar";
import { StatCard }     from "@/design-system/molecules/StatCard";
import { AlertBanner }  from "@/design-system/molecules/AlertBanner";
import { ChipContact }  from "@/design-system/molecules/ChipContact";
import { NavItem }      from "@/design-system/molecules/NavItem";


/* ── Organisms ── */

import { KPIGrid }       from "@/design-system/organisms/KPIGrid";
import { DataTable }     from "@/design-system/organisms/DataTable";
import { ModuleGrid }    from "@/design-system/organisms/ModuleGrid";
import { SidePanel }     from "@/design-system/organisms/SidePanel";
import { ModalForm }     from "@/design-system/organisms/ModalForm";
import { ConfirmDialog } from "@/design-system/organisms/ConfirmDialog";
import { PageHeader }    from "@/design-system/organisms/PageHeader";
import { SectionHeader } from "@/design-system/organisms/SectionHeader";
import { TabBar }        from "@/design-system/organisms/TabBar";


/* ── Templates ── */

import { DashboardLayout } from "@/design-system/templates/DashboardLayout";
import { ListLayout }      from "@/design-system/templates/ListLayout";
import { ClientesTableTemplate } from "@/design-system/templates/ClientesTableTemplate";


/* ════════════════════════════════════════════════════════════════════
   Helpers de layout interno del Showcase
   ════════════════════════════════════════════════════════════════════ */

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 48 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
        <div style={{ height: 1, flex: 1, background: `linear-gradient(to right, ${TOKENS.cyan}44, transparent)` }} />
        <Text
          variant="label"
          style={{ color: TOKENS.cyan, fontSize: 11, letterSpacing: 3, whiteSpace: "nowrap" }}
        >
          {title}
        </Text>
        <div style={{ height: 1, flex: 1, background: `linear-gradient(to left, ${TOKENS.cyan}44, transparent)` }} />
      </div>
      {children}
    </div>
  );
}

function Row({ children, wrap = true }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        alignItems: "center",
        flexWrap: wrap ? "wrap" : "nowrap",
        marginBottom: 16,
      }}
    >
      {children}
    </div>
  );
}

function Col2({ children }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
      {children}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   Showcase principal
   ════════════════════════════════════════════════════════════════════ */

export default function DesignSystemShowcase() {
  useEffect(() => { injectGlobalStyles(); }, []);

  const [inputVal,    setInputVal]    = useState("");
  const [checked,     setChecked]     = useState(false);
  const [switched,    setSwitched]    = useState(true);
  const [activeTab,   setActiveTab]   = useState("atoms");
  const [showModal,   setShowModal]   = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showPanel,   setShowPanel]   = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  /* ── Loading Screen (full-page) ── */
  if (showLoading) {
    return (
      <div>
        <LoadingScreen />
        <button
          onClick={() => setShowLoading(false)}
          style={{
            position: "fixed", bottom: 20, right: 20, zIndex: 9999,
            background: TOKENS.bgLevel2,
            border: `1px solid ${TOKENS.cyan}`,
            color: TOKENS.cyan,
            padding: "8px 16px",
            cursor: "pointer",
            fontFamily: TOKENS.fontMono,
            fontSize: 10,
          }}
        >
          ✕ CERRAR
        </button>
      </div>
    );
  }

  return (
    <DashboardLayout>

      {/* ── Título principal ── */}
      <div style={{ marginBottom: 40, textAlign: "center" }}>
        <Text as="h1" variant="display" glow style={{ fontSize: 28, letterSpacing: 8, marginBottom: 8 }}>
          NEXUS UI
        </Text>
        <Text variant="label" style={{ letterSpacing: 4 }}>
          DESIGN SYSTEM · ATOMIC COMPONENTS · v1.0
        </Text>
        <Divider color="cyan" style={{ marginTop: 20 }} />
      </div>

      {/* ── Nav Tabs ── */}
      <div style={{ marginBottom: 32 }}>
        <TabBar
          tabs={[
            { key: "atoms",     label: "⬡ Atoms"     },
            { key: "molecules", label: "⬢ Molecules"  },
            { key: "organisms", label: "◈ Organisms"  },
            { key: "templates", label: "◆ Templates"  },
          ]}
          active={activeTab}
          onChange={setActiveTab}
        />
      </div>

      {/* ════════════════════════════════════════════════════════════
          ATOMS
         ════════════════════════════════════════════════════════════ */}
      {activeTab === "atoms" && (
        <div>

          {/* Text */}
          <Section title="TEXT · TYPOGRAPHY">
            <Row>
              <Text variant="display">Display Text</Text>
            </Row>
            <Row>
              <Text variant="body">Body — Rajdhani regular 14px</Text>
              <Text variant="body" color="cyan">Body cyan</Text>
              <Text variant="body" color="green">Body green</Text>
              <Text variant="body" color="red">Body red</Text>
            </Row>
            <Row>
              <Text variant="label">LABEL UPPERCASE</Text>
              <Text variant="mono">mono #0xA3F2</Text>
              <Text variant="muted">Muted text</Text>
              <Text variant="caption">Caption 11px</Text>
            </Row>
            <Row>
              <Text variant="body" glow color="cyan">Glow cyan</Text>
              <Text variant="body" glow color="magenta">Glow magenta</Text>
              <Text variant="body" glow color="green">Glow green</Text>
            </Row>
          </Section>

          {/* Badge */}
          <Section title="BADGE">
            <Row>
              <Badge color="cyan">Cyan</Badge>
              <Badge color="green">Activo</Badge>
              <Badge color="red">Error</Badge>
              <Badge color="yellow">Pendiente</Badge>
              <Badge color="magenta">Magenta</Badge>
              <Badge color="blue">Blue</Badge>
              <Badge color="default">Default</Badge>
            </Row>
            <Row>
              <Badge color="green" dot={false}>Sin dot</Badge>
              <Tag color="cyan" onRemove={() => {}}>tag removible</Tag>
              <Tag color="magenta">tag magenta</Tag>
              <Kbd>⌘K</Kbd>
              <Kbd>ESC</Kbd>
            </Row>
          </Section>

          {/* Dot */}
          <Section title="DOT · INDICATOR">
            <Row>
              {["cyan", "green", "red", "yellow", "magenta"].map(c => (
                <div key={c} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Dot color={c} />
                  <Dot color={c} size={8} />
                  <Dot color={c} size={10} pulse />
                  <Text variant="caption">{c}</Text>
                </div>
              ))}
            </Row>
          </Section>

          {/* Icon */}
          <Section title="ICON">
            <Row>
              {[["◈","cyan"],["◆","green"],["◇","magenta"],["●","yellow"],["⬡","red"],["⬢","blue"]].map(([s, c]) => (
                <Icon key={s} symbol={s} color={c} size={22} />
              ))}
            </Row>
            <Row>
              {[16, 20, 24, 32, 40].map(sz => (
                <Icon key={sz} symbol="◈" color="cyan" size={sz} />
              ))}
            </Row>
          </Section>

          {/* Avatar */}
          <Section title="AVATAR">
            <Row>
              {[["Juan García", 36], ["María López", 48], ["Roberto", 60], ["AB", 76]].map(([n, sz]) => (
                <Avatar key={n} name={n} size={sz} />
              ))}
              <Avatar name="Ana" size={40} colorA={TOKENS.green}   colorB={TOKENS.cyan}    />
              <Avatar name="Rx"  size={40} colorA={TOKENS.red}     colorB={TOKENS.magenta} />
            </Row>
          </Section>

          {/* Spinner */}
          <Section title="SPINNER">
            <Row>
              <Spinner size={32} color="cyan"    label="" />
              <Spinner size={40} color="green"   label="" />
              <Spinner size={48} color="magenta" label="" />
              <Spinner size={32} color="cyan"    label="CARGANDO..." />
            </Row>
          </Section>

          {/* Button */}
          <Section title="BUTTON">
            <Row>
              <Button variant="primary" color="cyan">Primary Cyan</Button>
              <Button variant="primary" color="green">Primary Green</Button>
              <Button variant="primary" color="magenta">Primary Magenta</Button>
              <Button variant="primary" color="red">Primary Red</Button>
            </Row>
            <Row>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger" color="red">Danger</Button>
              <Button variant="clip"   color="cyan">Clip Shape</Button>
              <Button variant="primary" disabled>Disabled</Button>
            </Row>
            <Row>
              <Button variant="primary" size="sm" icon="◈">Small</Button>
              <Button variant="primary" size="md" icon="◆">Medium</Button>
              <Button variant="primary" size="lg" icon="◈">Large</Button>
            </Row>
            <Row>
              <Button variant="icon" color="cyan">✏️</Button>
              <Button variant="icon" color="red">🗑</Button>
              <Button variant="icon" color="green">✓</Button>
              <Tooltip tip="Acción principal">
                <Button variant="primary" size="sm">Con tooltip</Button>
              </Tooltip>
            </Row>
          </Section>

          {/* Input / Form */}
          <Section title="INPUT · FORM CONTROLS">
            <Col2>
              <FormField label="Texto normal">
                <Input
                  placeholder="Escribe algo..."
                  value={inputVal}
                  onChange={e => setInputVal(e.target.value)}
                />
              </FormField>
              <FormField label="Con ícono" required>
                <Input placeholder="Buscar..." icon="🔍" />
              </FormField>
              <FormField label="Email" error="Correo inválido">
                <Input type="email" placeholder="user@nexus.io" error />
              </FormField>
              <FormField label="Seleccionar">
                <SelectInput
                  options={[
                    { value: "a", label: "Opción Alpha" },
                    { value: "b", label: "Opción Beta"  },
                    { value: "c", label: "Opción Gamma" },
                  ]}
                />
              </FormField>
            </Col2>
            <FormField label="Área de texto">
              <TextArea placeholder="Escribe un mensaje largo..." rows={3} />
            </FormField>
            <Row>
              <Checkbox checked={checked} onChange={setChecked} label="Checkbox activo" />
              <Switch checked={switched} onChange={setSwitched} />
              <Text variant="caption">{switched ? "ON" : "OFF"}</Text>
            </Row>
          </Section>

          {/* ProgressBar */}
          <Section title="PROGRESS BAR">
            {[["cyan", 75], ["green", 50], ["magenta", 30], ["red", 90], ["yellow", 60]].map(([c, v]) => (
              <div key={c} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <Text variant="caption">{c}</Text>
                  <Text variant="caption">{v}%</Text>
                </div>
                <ProgressBar value={v} color={c} height={6} />
              </div>
            ))}
          </Section>

          {/* Divider */}
          <Section title="DIVIDER">
            <Divider label="SECCIÓN A" color="cyan"    />
            <Divider label="SEPARADOR" color="magenta" />
            <Divider color="green" />
          </Section>

        </div>
      )}

      {/* ════════════════════════════════════════════════════════════
          MOLECULES
         ════════════════════════════════════════════════════════════ */}
      {activeTab === "molecules" && (
        <div>

          <Section title="STAT CARD">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
              <StatCard label="Usuarios Activos" value="1,248"  icon="◈" color="cyan"    progress={72} />
              <StatCard label="Órdenes Totales"  value="3,891"  icon="◆" color="green"   progress={55} />
              <StatCard label="Envíos"           value="624"    icon="◇" color="magenta" progress={38} />
              <StatCard label="Créditos"         value="$9,402" icon="●" color="yellow"  progress={88} />
            </div>
          </Section>

          <Section title="SEARCH BAR">
            <SearchBar placeholder="Buscar por nombre, ID o estado..." />
          </Section>

          <Section title="ALERT BANNER">
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <AlertBanner message="Sistema funcionando normalmente."            color="green"  icon="✓" onClose={() => {}} />
              <AlertBanner message="Advertencia: límite de transacciones al 80%." color="yellow"        onClose={() => {}} />
              <AlertBanner message="Error crítico: conexión con servidor perdida." color="red"   icon="⊗" onClose={() => {}} />
              <AlertBanner message="Información del sistema actualizada."          color="cyan"  icon="ℹ" onClose={() => {}} />
            </div>
          </Section>

          <Section title="CHIP CONTACT">
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <ChipContact icon="📞" value="+52 55 1234 5678"            active />
              <ChipContact icon="✉️" value="usuario@nexus.io"            active={false} onEdit={() => {}} onDelete={() => {}} />
              <ChipContact icon="📍" value="Calle Innovación 404, CDMX"  active         onEdit={() => {}} />
            </div>
          </Section>

          <Section title="NAV ITEM (Module Grid)">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
              <NavItem icon="⬡" label="Nueva Orden" active />
              <NavItem icon="⬢" label="N.Cliente" />
              <NavItem icon="◈" label="Envío" />
              <NavItem icon="◆" label="Pago" />
            </div>
          </Section>

          <Section title="TAB BAR">
            <TabBar
              tabs={[
                { key: "t", label: "📞 Teléfonos"  },
                { key: "c", label: "✉️ Correos"    },
                { key: "d", label: "📍 Direcciones" },
                { key: "p", label: "📦 Pedidos"     },
              ]}
              active="t"
              onChange={() => {}}
            />
          </Section>

          <Section title="CARD (contenedor base)">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
              <Card>
                <Text variant="label">Card Default</Text>
                <Text variant="body" style={{ marginTop: 8 }}>
                  Contenedor con glassmorphism y borde cyan sutil.
                </Text>
              </Card>
              <Card accentColor="green" glow>
                <Text variant="label" style={{ color: TOKENS.green }}>Card con Glow</Text>
                <Text variant="body" style={{ marginTop: 8 }}>Glow verde activo.</Text>
              </Card>
              <Card accentColor="magenta" hoverable>
                <Text variant="label" style={{ color: TOKENS.magenta }}>Card Hoverable</Text>
                <Text variant="body" style={{ marginTop: 8 }}>Pasa el mouse para ver la animación.</Text>
              </Card>
            </div>
          </Section>

        </div>
      )}

      {/* ════════════════════════════════════════════════════════════
          ORGANISMS
         ════════════════════════════════════════════════════════════ */}
      {activeTab === "organisms" && (
        <div>

          <Section title="KPI GRID">
            <KPIGrid stats={[
              { label: "Usuarios Activos", value: "1,248",  icon: "◈", color: "cyan",    progress: 72 },
              { label: "Órdenes Totales",  value: "3,891",  icon: "◆", color: "green",   progress: 55 },
              { label: "Envíos",           value: "624",    icon: "◇", color: "magenta", progress: 38 },
              { label: "Créditos",         value: "$9,402", icon: "●", color: "yellow",  progress: 88 },
            ]} />
          </Section>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: 24 }}>
            <Section title="DATA TABLE">
              <DataTable
                title="Registros Recientes"
                actionLabel="VER TODOS"
                onAction={() => {}}
                columns={["FOLIO", "CLIENTE", "TOTAL", "ESTADO"]}
                rows={[
                  [
                    <Text variant="mono" style={{ color: TOKENS.cyan }}>#A1B2C3</Text>,
                    "Juan García",
                    <Text style={{ color: TOKENS.green }}>$1,250.00</Text>,
                    <Badge color="blue">En proceso</Badge>,
                  ],
                  [
                    <Text variant="mono" style={{ color: TOKENS.cyan }}>#D4E5F6</Text>,
                    "María López",
                    <Text style={{ color: TOKENS.green }}>$842.50</Text>,
                    <Badge color="green">Completado</Badge>,
                  ],
                  [
                    <Text variant="mono" style={{ color: TOKENS.cyan }}>#G7H8I9</Text>,
                    "Roberto Díaz",
                    <Text style={{ color: TOKENS.green }}>$3,100.00</Text>,
                    <Badge color="yellow">Pendiente</Badge>,
                  ],
                  [
                    <Text variant="mono" style={{ color: TOKENS.cyan }}>#J1K2L3</Text>,
                    "Ana Martínez",
                    <Text style={{ color: TOKENS.green }}>$560.00</Text>,
                    <Badge color="red">Cancelado</Badge>,
                  ],
                ]}
              />
            </Section>

            <Section title="MODULE GRID">
              <ModuleGrid title="Módulos" modules={[
                { label: "Nueva Orden", icon: "⬡", color: "cyan"    },
                { label: "N.Cliente",   icon: "⬢", color: "green"   },
                { label: "Envío",       icon: "◈", color: "magenta" },
                { label: "Pago",        icon: "◆", color: "yellow"  },
              ]} />
            </Section>
          </div>

          <Section title="OVERLAYS · MODALES">
            <Row>
              <Button variant="primary" color="cyan" onClick={() => setShowModal(true)}>
                Abrir ModalForm
              </Button>
              <Button variant="danger" color="red" onClick={() => setShowConfirm(true)}>
                Abrir ConfirmDialog
              </Button>
              <Button variant="secondary" onClick={() => setShowPanel(true)}>
                Abrir SidePanel
              </Button>
            </Row>
          </Section>

        </div>
      )}

      {/* ════════════════════════════════════════════════════════════
          TEMPLATES
         ════════════════════════════════════════════════════════════ */}
      {activeTab === "templates" && (
        <div>

          <Section title="PAGE HEADER">
            <PageHeader
              title="CLIENTES"
              subtitle="Gestión de base de datos · v2.0"
              action={<Button variant="clip" color="cyan" icon="+">Nuevo cliente</Button>}
            />
          </Section>

          <Section title="SECTION HEADER">
            <Card>
              <SectionHeader
                title="Registros activos"
                count={42}
                action={<Button variant="secondary" size="sm">+ Agregar</Button>}
              />
              <Divider color="cyan" />
              <SectionHeader
                title="Transacciones"
                action={<Text variant="label" style={{ color: TOKENS.green }}>+$9,402.00</Text>}
              />
            </Card>
          </Section>

          <Section title="LOADING SCREEN">
            <Button variant="primary" color="cyan" onClick={() => setShowLoading(true)}>
              Ver Loading Screen
            </Button>
          </Section>

          <Section title="TABLA CLIENTES (template)">
            <ClientesTableTemplate
              loading={false}
              search=""
              onSearch={() => {}}
              sortBy="nombre"
              onSortBy={() => {}}
              order="asc"
              onOrder={() => {}}
              total={3}
              rows={[
                <tr key="1" className="nexus-tr" style={{ position: "relative", borderBottom: `1px solid ${TOKENS.borderSubtle}` }}>
                  <div className="nexus-row-bar" />
                  <td style={{ padding: "14px 24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <Avatar name="Juan García" size={36} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 15, color: "#e0eaf5" }}>Juan García</div>
                        <Text variant="mono" style={{ fontSize: 10, letterSpacing: 1 }}>ID · 0001</Text>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "14px 18px" }}><Badge color="green">Activo</Badge></td>
                  <td style={{ padding: "14px 18px" }}><Text variant="mono" style={{ fontSize: 12 }}>12/01/2024</Text></td>
                  <td style={{ padding: "14px 18px" }}><Button variant="danger" size="sm">Eliminar</Button></td>
                </tr>,
                <tr key="2" className="nexus-tr" style={{ position: "relative", borderBottom: `1px solid ${TOKENS.borderSubtle}` }}>
                  <div className="nexus-row-bar" />
                  <td style={{ padding: "14px 24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <Avatar name="María López" size={36} colorA={TOKENS.green} colorB={TOKENS.cyan} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 15, color: "#e0eaf5" }}>María López</div>
                        <Text variant="mono" style={{ fontSize: 10, letterSpacing: 1 }}>ID · 0002</Text>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "14px 18px" }}><Badge color="red">Inactivo</Badge></td>
                  <td style={{ padding: "14px 18px" }}><Text variant="mono" style={{ fontSize: 12 }}>03/03/2024</Text></td>
                  <td style={{ padding: "14px 18px" }}><Button variant="danger" size="sm">Eliminar</Button></td>
                </tr>,
                <tr key="3" className="nexus-tr" style={{ position: "relative" }}>
                  <div className="nexus-row-bar" />
                  <td style={{ padding: "14px 24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <Avatar name="Roberto Díaz" size={36} colorA={TOKENS.red} colorB={TOKENS.magenta} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 15, color: "#e0eaf5" }}>Roberto Díaz</div>
                        <Text variant="mono" style={{ fontSize: 10, letterSpacing: 1 }}>ID · 0003</Text>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "14px 18px" }}><Badge color="green">Activo</Badge></td>
                  <td style={{ padding: "14px 18px" }}><Text variant="mono" style={{ fontSize: 12 }}>20/05/2024</Text></td>
                  <td style={{ padding: "14px 18px" }}><Button variant="danger" size="sm">Eliminar</Button></td>
                </tr>,
              ]}
            />
          </Section>

        </div>
      )}

      {/* ════════════════════════════════════════════════════════════
          OVERLAYS GLOBALES
         ════════════════════════════════════════════════════════════ */}

      {showModal && (
        <ModalForm
          title="Nuevo Registro"
          onClose={() => setShowModal(false)}
          onSave={() => setShowModal(false)}
        >
          <FormField label="Nombre" required>
            <Input placeholder="Nombre completo" />
          </FormField>
          <FormField label="Email">
            <Input type="email" placeholder="correo@nexus.io" icon="✉️" />
          </FormField>
          <Checkbox checked={false} onChange={() => {}} label="Marcar como activo" />
        </ModalForm>
      )}

      {showConfirm && (
        <ConfirmDialog
          message={
            <>
              ¿Eliminar registro{" "}
              <strong style={{ color: TOKENS.red }}>"Juan García"</strong>?
              {" "}Esta acción no se puede deshacer.
            </>
          }
          onConfirm={() => setShowConfirm(false)}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      {showPanel && (
        <SidePanel
          title="Juan García"
          subtitle="ID · 0001 · Cliente activo desde 12/01/2024"
          onClose={() => setShowPanel(false)}
          actions={<Button variant="secondary" size="sm" icon="✏️">Editar</Button>}
        >
          <TabBar
            tabs={[
              { key: "t", label: "📞 Teléfonos"  },
              { key: "c", label: "✉️ Correos"    },
              { key: "d", label: "📍 Direcciones" },
            ]}
            active="t"
            onChange={() => {}}
          />
          <div style={{ marginTop: 20 }}>
            <ChipContact
              icon="📞"
              value="+52 55 1234 5678"
              active
              onEdit={() => {}}
              onDelete={() => {}}
            />
          </div>
        </SidePanel>
      )}

    </DashboardLayout>
  );
}