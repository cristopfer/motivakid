import { useState } from 'react';
import './DashboardPage.css';
import logo from '../assets/logo-motivakids.png';
import { PacientesContent } from '../components/sections/PacientesContent';
import { TerapeutasContent } from '../components/sections/TerapeutasContent';
import { EspecialidadesContent } from '../components/sections/EspecialidadesContent';
import { DisponibilidadesContent } from '../components/sections/DisponibilidadesContent';
import { HorariosContent } from '../components/sections/HorariosContent';
import { CitasContent } from '../components/sections/CitasContent';
import { AgendaDiariaContent } from '../components/sections/AgendaDiariaContent';
import { PagosPacientesContent } from '../components/sections/PagosPacientesContent';
import { PagosTerapeutasContent } from '../components/sections/PagosTerapeutasContent';
import { ReportesContent } from '../components/sections/ReportesContent';
import { PrediccionContent } from '../components/sections/PrediccionContent';

/* ============ Contenido de la pantalla "Inicio" ============ */
function InicioContent() {
  const stats = {
    pacientes: 0,
    terapeutas: 0,
    citasMes: 0,
    pagos: 0,
  };

  const citasPorEspecialidad = [
    { nombre: 'Fisioterapia', valor: 0, color: '#ec4899' },
    { nombre: 'Lenguaje',     valor: 0, color: '#14b8a6' },
    { nombre: 'Psicología',   valor: 0, color: '#f5b400' },
    { nombre: 'Otras',        valor: 0, color: '#a855f7' },
  ];

  const proximasCitas = [];
  const maxValor = Math.max(...citasPorEspecialidad.map(c => c.valor), 1);

  return (
    <>
      {/* Banner bienvenida */}
      <section className="welcome-banner">
        <div className="welcome-text">
          <span className="heart-deco">♥</span>
          <h1>
            ¡Bienvenido,<br />
            <span className="highlight">Administrador!</span>
          </h1>
          <p>
            Hoy es un gran día para seguir<br />
            haciendo la diferencia en la vida de nuestros niños.
          </p>
        </div>
        <div className="welcome-image"></div>
        <div className="welcome-sticker">
          <span>Pequeños avances,</span>
          <span>grandes logros</span>
        </div>
      </section>

      {/* Stats cards */}
      <section className="stats-grid">
        <div className="stat-card pink">
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="#fff">
              <path d="M16 11c1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3 1.3 3 3 3zm-8 0c1.7 0 3-1.3 3-3S9.7 5 8 5 5 6.3 5 8s1.3 3 3 3zm0 2c-2.3 0-7 1.2-7 3.5V19h14v-2.5C15 14.2 10.3 13 8 13zm8 0c-.3 0-.6 0-1 .1 1.2.8 2 1.9 2 3.4V19h6v-2.5c0-2.3-4.7-3.5-7-3.5z"/>
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-label">Total de pacientes</span>
            <span className="stat-value">{stats.pacientes}</span>
            <span className="stat-trend">↑ 0% <em>vs. mes anterior</em></span>
          </div>
        </div>

        <div className="stat-card teal">
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="#fff">
              <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.4c-3.3 0-9.8 1.7-9.8 4.9v2.5h19.6v-2.5c0-3.2-6.5-4.9-9.8-4.9z"/>
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-label">Total de terapeutas</span>
            <span className="stat-value">{stats.terapeutas}</span>
            <span className="stat-trend">↑ 0% <em>vs. mes anterior</em></span>
          </div>
        </div>

        <div className="stat-card yellow">
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="#fff">
              <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z"/>
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-label">Citas del mes</span>
            <span className="stat-value">{stats.citasMes}</span>
            <span className="stat-trend">↑ 0% <em>vs. mes anterior</em></span>
          </div>
        </div>

        <div className="stat-card purple">
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="#fff">
              <path d="M11.8 10.9c-2.3-.6-3-1.2-3-2.1 0-1 .9-1.8 2.5-1.8 1.6 0 2.2.8 2.3 1.9h2c-.1-1.6-1-3-2.9-3.5V3.5h-2.8v1.8c-1.8.4-3.2 1.5-3.2 3.4 0 2.2 1.8 3.3 4.5 4 2.4.6 2.9 1.4 2.9 2.3 0 .6-.5 1.7-2.5 1.7-1.9 0-2.6-.9-2.7-1.9h-2c.1 2 1.6 3.2 3.5 3.6v1.8h2.8v-1.8c1.8-.4 3.2-1.4 3.2-3.4 0-2.7-2.3-3.6-4.6-4.1z"/>
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-label">Pagos registrados</span>
            <span className="stat-value">S/ {stats.pagos.toLocaleString()}</span>
            <span className="stat-trend">↑ 0% <em>vs. mes anterior</em></span>
          </div>
        </div>
      </section>

      {/* Fila: gráfico + próximas citas */}
      <section className="mid-grid">
        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-title">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="#a855f7">
                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z"/>
              </svg>
              <h3>Citas por especialidad</h3>
            </div>
            <select className="chart-select">
              <option>Este mes</option>
              <option>Mes anterior</option>
            </select>
          </div>

          <div className="chart-area">
            <div className="chart-y-axis">
              <span>20</span><span>15</span><span>10</span><span>5</span><span>0</span>
            </div>
            <div className="chart-bars-wrapper">
              {citasPorEspecialidad.map((esp, i) => (
                <div className="bar-column" key={i}>
                  <span className="bar-value">{esp.valor}</span>
                  <div
                    className="bar"
                    style={{
                      height: `${(esp.valor / maxValor) * 100}%`,
                      background: esp.color
                    }}
                  ></div>
                </div>
              ))}
            </div>
          </div>

          <div className="chart-legend">
            {citasPorEspecialidad.map((esp, i) => (
              <div className="legend-item" key={i}>
                <span className="legend-icon" style={{ background: esp.color }}></span>
                <span>{esp.nombre}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="appointments-card">
          <div className="appt-header">
            <div className="appt-title">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="#a855f7">
                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z"/>
              </svg>
              <h3>Próximas citas</h3>
            </div>
            <a href="#" className="see-all">Ver todas →</a>
          </div>

          <div className="appt-list">
            {proximasCitas.length === 0 ? (
              <p className="empty-msg">No hay citas próximas</p>
            ) : (
              proximasCitas.map((c, i) => (
                <div className="appt-item" key={i}>...</div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Predicción */}
      <section className="prediction-card">
        <div className="pred-icon">
          <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#0ea5e9" strokeWidth="2">
            <path d="M9 18h6M10 22h4M12 2a7 7 0 00-4 12.7c.6.5 1 1.3 1 2.1V17h6v-.2c0-.8.4-1.6 1-2.1A7 7 0 0012 2z"/>
          </svg>
        </div>
        <div className="pred-text">
          <h3>Predicción de demanda</h3>
          <p>
            El sistema estima un incremento de citas en la próxima semana
            (entre 12% y 18%) para la especialidad de Lenguaje.
          </p>
        </div>
        <div className="pred-icon-right">
          <svg viewBox="0 0 24 24" width="42" height="42" fill="none" stroke="#14b8a6" strokeWidth="2">
            <path d="M3 17l6-6 4 4 8-8M14 7h7v7"/>
          </svg>
        </div>
        <button className="pred-btn">Ver detalle →</button>
      </section>
    </>
  );
}

/* ============ Contenido vacío para el resto de páginas ============ */
function EmptyContent() {
  return <div className="empty-content"></div>;
}

/* ============ Dashboard ============ */
export function DashboardPage() {
  const [seccionActiva, setSeccionActiva] = useState('inicio');

  const menuItems = [
    { id: 'inicio',           label: 'Inicio',                icon: 'home' },
    { id: 'pacientes',        label: 'Pacientes',             icon: 'pacientes', grupo: 'GESTIÓN' },
    { id: 'terapeutas',       label: 'Terapeutas',            icon: 'terapeutas', grupo: 'GESTIÓN' },
    { id: 'especialidades',   label: 'Especialidades',        icon: 'estrella', grupo: 'GESTIÓN' },
    { id: 'disponibilidades', label: 'Disponibilidades',      icon: 'calendario', grupo: 'PROGRAMACIÓN' },
    { id: 'horarios',         label: 'Horarios',              icon: 'reloj', grupo: 'PROGRAMACIÓN' },
    { id: 'citas',            label: 'Citas',                 icon: 'calendario', grupo: 'PROGRAMACIÓN' },
    { id: 'agenda',           label: 'Agenda diaria',         icon: 'lista', grupo: 'PROGRAMACIÓN' },
    { id: 'pagos-pacientes',  label: 'Pagos de pacientes',    icon: 'tarjeta', grupo: 'PAGOS' },
    { id: 'pagos-terapeutas', label: 'Pagos de terapeutas',   icon: 'tarjeta', grupo: 'PAGOS' },
    { id: 'reportes',         label: 'Reportes',              icon: 'doc', grupo: 'PAGOS' },
    { id: 'prediccion',       label: 'Predicción de demanda', icon: 'grafico', grupo: 'ANÁLISIS' },
  ];

  /* Agrupar por sección para renderizar con títulos */
  const grupos = [];
  menuItems.forEach(item => {
    if (item.grupo) {
      let g = grupos.find(x => x.nombre === item.grupo);
      if (!g) { g = { nombre: item.grupo, items: [] }; grupos.push(g); }
      g.items.push(item);
    } else {
      grupos.push({ nombre: null, items: [item] });
    }
  });

  /* Función que devuelve el ícono según el id */
  const renderIcon = (icon) => {
    const fill = 'currentColor';
    switch (icon) {
      case 'home':
        return <svg viewBox="0 0 24 24" width="18" height="18" fill={fill}><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>;
      case 'pacientes':
        return <svg viewBox="0 0 24 24" width="18" height="18" fill={fill}><path d="M16 11c1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3 1.3 3 3 3zm-8 0c1.7 0 3-1.3 3-3S9.7 5 8 5 5 6.3 5 8s1.3 3 3 3zm0 2c-2.3 0-7 1.2-7 3.5V19h14v-2.5C15 14.2 10.3 13 8 13zm8 0c-.3 0-.6 0-1 .1 1.2.8 2 1.9 2 3.4V19h6v-2.5c0-2.3-4.7-3.5-7-3.5z"/></svg>;
      case 'terapeutas':
        return <svg viewBox="0 0 24 24" width="18" height="18" fill={fill}><path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.4c-3.3 0-9.8 1.7-9.8 4.9v2.5h19.6v-2.5c0-3.2-6.5-4.9-9.8-4.9z"/></svg>;
      case 'estrella':
        return <svg viewBox="0 0 24 24" width="18" height="18" fill="#f5b400"><path d="M12 17.3l-6.2 3.7 1.6-7.1L2 9.2l7.2-.6L12 2l2.8 6.6 7.2.6-5.4 4.7 1.6 7.1z"/></svg>;
      case 'calendario':
        return <svg viewBox="0 0 24 24" width="18" height="18" fill={fill}><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z"/></svg>;
      case 'reloj':
        return <svg viewBox="0 0 24 24" width="18" height="18" fill={fill}><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 11h-5v-2h3V6h2z"/></svg>;
      case 'lista':
        return <svg viewBox="0 0 24 24" width="18" height="18" fill={fill}><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/></svg>;
      case 'tarjeta':
        return <svg viewBox="0 0 24 24" width="18" height="18" fill="#22c55e"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg>;
      case 'doc':
        return <svg viewBox="0 0 24 24" width="18" height="18" fill={fill}><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>;
      case 'grafico':
        return <svg viewBox="0 0 24 24" width="18" height="18" fill={fill}><path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z"/></svg>;
      default:
        return null;
    }
  };

  return (
    <div className="dashboard">

      {/* ============ HEADER ============ */}
      <header className="dash-header">
        <div className="dash-header-left">
          <img src={logo} alt="MotivaKids" className="dash-logo" />
        </div>

        <div className="dash-header-right">
          <button className="menu-btn" aria-label="Menú">
            <span></span><span></span><span></span>
          </button>

          <div className="notif-wrapper">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#7d7d7d" strokeWidth="2">
              <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.7 21a2 2 0 01-3.4 0"/>
            </svg>
            <span className="notif-badge">3</span>
          </div>

          <div className="user-info">
            <div className="user-avatar">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="#fff">
                <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.4c-3.3 0-9.8 1.7-9.8 4.9v2.5h19.6v-2.5c0-3.2-6.5-4.9-9.8-4.9z"/>
              </svg>
            </div>
            <div className="user-text">
              <span className="user-name">Administrador</span>
              <span className="user-role">Centro Motivakid</span>
            </div>
            <svg className="user-caret" viewBox="0 0 24 24" width="14" height="14" fill="#7d7d7d">
              <path d="M7 10l5 5 5-5z"/>
            </svg>
          </div>
        </div>
      </header>

      <div className="dash-body">

        {/* ============ SIDEBAR ============ */}
        <aside className="dash-sidebar">
          <nav>
            {grupos.map((grupo, gi) => (
              <div key={gi}>
                {grupo.nombre && <p className="menu-group">{grupo.nombre}</p>}
                {grupo.items.map(item => (
                  <button
                    key={item.id}
                    className={`menu-item ${seccionActiva === item.id ? 'active' : ''}`}
                    onClick={() => setSeccionActiva(item.id)}
                  >
                    {renderIcon(item.icon)}
                    <span>{item.label}</span>
                    <span className="chevron">›</span>
                  </button>
                ))}
              </div>
            ))}
          </nav>
        </aside>

        {/* ============ MAIN ============ */}
        <main className="dash-main">
            {seccionActiva === 'inicio' && <InicioContent />}
            {seccionActiva === 'pacientes' && <PacientesContent />}
            {seccionActiva === 'terapeutas' && <TerapeutasContent />}
            {seccionActiva === 'especialidades' && <EspecialidadesContent />}
            {seccionActiva === 'disponibilidades' && <DisponibilidadesContent />}
            {seccionActiva === 'horarios' && <HorariosContent />}
            {seccionActiva === 'citas' && <CitasContent />}
            {seccionActiva === 'agenda' && <AgendaDiariaContent />}
            {seccionActiva === 'pagos-pacientes' && <PagosPacientesContent />}
            {seccionActiva === 'pagos-terapeutas' && <PagosTerapeutasContent />}
            {seccionActiva === 'reportes' && <ReportesContent />}
            {seccionActiva === 'prediccion' && <PrediccionContent />}
            {seccionActiva !== 'inicio' &&
             seccionActiva !== 'pacientes' &&
             seccionActiva !== 'terapeutas' &&
             seccionActiva !== 'especialidades' &&
             seccionActiva !== 'disponibilidades' &&
             seccionActiva !== 'horarios' &&
             seccionActiva !== 'citas' &&
             seccionActiva !== 'agenda' &&
             seccionActiva !== 'pagos-pacientes' &&
             seccionActiva !== 'pagos-terapeutas' &&
             seccionActiva !== 'reportes' &&
             seccionActiva !== 'prediccion' && <EmptyContent />}
        </main>
      </div>
    </div>
  );
}