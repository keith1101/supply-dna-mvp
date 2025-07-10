import React from 'react';
import { FaBell, FaUser } from 'react-icons/fa6';

const sidebarMenu = [
  { label: 'Dashboard', icon: <span className="sidebar-icon">🏠</span> },
  { label: 'Traceability', icon: <span className="sidebar-icon">🧬</span> },
  { label: 'Analytics', icon: <span className="sidebar-icon">📈</span> },
  { label: 'Reports', icon: <span className="sidebar-icon">📄</span> },
  { label: 'Settings', icon: <span className="sidebar-icon">⚙️</span> },
  { label: 'Register', icon: <span className="sidebar-icon">🧬</span> },
];

export default function Sidebar({ activeView, setActiveView, sidebarOpen, setSidebarOpen, sidebarRef }) {
  const isMobile = window.innerWidth <= 600;
  return (
    <>
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} aria-modal="true" aria-label="Sidebar overlay" tabIndex={-1} style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',zIndex:99,background:'rgba(44,62,80,0.25)'}} />}
      <aside ref={sidebarRef} className={`supplydna-sidebar${sidebarOpen ? ' open' : ''}`} style={isMobile && sidebarOpen ? {width: '100vw', zIndex: 100} : sidebarOpen ? {zIndex: 100} : {}} role="navigation" aria-label="Main navigation" tabIndex={sidebarOpen ? 0 : -1}>
          <div className="sidebar-icons">
            <span className="icon-badge">
              <FaBell className="header-icon" />
              <span className="badge">3</span>
            </span>
            <FaUser className="header-icon" />
          </div>
          <div className="supplydna-logo">Supply <span style={{ color: '#2ECC71' }}>DNA</span></div>
        <nav>
          <ul>
            {sidebarMenu.map((item) => (
              <li
                key={item.label}
                className={activeView === item.label ? 'active' : ''}
                onClick={() => { setActiveView(item.label); setSidebarOpen(false); }}
                style={{ userSelect: 'none' }}
              >
                {item.icon}
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
} 