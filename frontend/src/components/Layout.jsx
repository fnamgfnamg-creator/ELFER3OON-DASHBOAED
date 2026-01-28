import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { FiHome, FiUsers, FiSettings, FiMenu, FiX } from 'react-icons/fi';
import '../styles/Layout.css';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="layout">
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h1 className="logo">FER3OON</h1>
          <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        <nav className="nav-menu">
          <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <FiHome className="nav-icon" />
            {sidebarOpen && <span>Dashboard</span>}
          </NavLink>

          <NavLink to="/users" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <FiUsers className="nav-icon" />
            {sidebarOpen && <span>Users</span>}
          </NavLink>

          <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <FiSettings className="nav-icon" />
            {sidebarOpen && <span>Settings</span>}
          </NavLink>
        </nav>
      </aside>

      <main className={`main-content ${sidebarOpen ? '' : 'expanded'}`}>
        <div className="content-wrapper">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;