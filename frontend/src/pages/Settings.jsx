import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiGlobe } from 'react-icons/fi';
import { authService } from '../services/authService';
import '../styles/Settings.css';

const Settings = ({ onLogout }) => {
  const [language, setLanguage] = useState('en');
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      authService.logout();
      onLogout();
      navigate('/login');
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Configure your dashboard preferences</p>
      </div>

      <div className="settings-content">
        <div className="settings-section">
          <div className="section-header">
            <FiGlobe className="section-icon" />
            <h2>Language</h2>
          </div>
          <div className="setting-item">
            <label htmlFor="language">Dashboard Language</label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="language-select"
            >
              <option value="en">English</option>
              <option value="ar">Arabic</option>
            </select>
          </div>
        </div>

        <div className="settings-section">
          <div className="section-header">
            <FiLogOut className="section-icon" />
            <h2>Account</h2>
          </div>
          <div className="setting-item">
            <button className="logout-button" onClick={handleLogout}>
              <FiLogOut />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;