import React, { useState, useEffect } from 'react';
import { FiUsers, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { apiService } from '../services/apiService';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingRequests: 0,
    approvedUsers: 0,
    blockedDevices: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const data = await apiService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className={`stat-card ${color}`}>
      <div className="stat-icon">
        <Icon />
      </div>
      <div className="stat-content">
        <h3>{title}</h3>
        <p className="stat-value">{value}</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard Overview</h1>
        <p>Real-time statistics and monitoring</p>
      </div>

      <div className="stats-grid">
        <StatCard
          icon={FiUsers}
          title="Total Users"
          value={stats.totalUsers}
          color="blue"
        />
        <StatCard
          icon={FiClock}
          title="Pending Requests"
          value={stats.pendingRequests}
          color="yellow"
        />
        <StatCard
          icon={FiCheckCircle}
          title="Approved Users"
          value={stats.approvedUsers}
          color="green"
        />
        <StatCard
          icon={FiXCircle}
          title="Blocked Devices"
          value={stats.blockedDevices}
          color="red"
        />
      </div>
    </div>
  );
};

export default Dashboard;