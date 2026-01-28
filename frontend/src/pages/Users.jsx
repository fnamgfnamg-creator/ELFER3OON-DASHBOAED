import React, { useState, useEffect } from 'react';
import { FiSearch, FiCheck, FiX, FiUnlock, FiTrash2 } from 'react-icons/fi';
import { apiService } from '../services/apiService';
import '../styles/Users.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [statusFilter, searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await apiService.getUsers(statusFilter, searchTerm);
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      setActionLoading(userId);
      await apiService.approveUser(userId);
      await fetchUsers();
    } catch (error) {
      console.error('Error approving user:', error);
      alert('Failed to approve user');
    } finally {
      setActionLoading(null);
    }
  };

  const handleBlock = async (userId) => {
    try {
      setActionLoading(userId);
      await apiService.blockUser(userId);
      await fetchUsers();
    } catch (error) {
      console.error('Error blocking user:', error);
      alert('Failed to block user');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnblock = async (userId) => {
    const unblockAll = window.confirm(
      'Unblock all devices for this UID?\n\nOK = Unblock all\nCancel = Unblock only this device'
    );

    try {
      setActionLoading(userId);
      await apiService.unblockUser(userId, unblockAll);
      await fetchUsers();
    } catch (error) {
      console.error('Error unblocking user:', error);
      alert('Failed to unblock user');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      setActionLoading(userId);
      await apiService.deleteUser(userId);
      await fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusClass = (status) => {
    const classes = {
      PENDING: 'status-badge pending',
      APPROVED: 'status-badge approved',
      BLOCKED: 'status-badge blocked'
    };
    return classes[status] || 'status-badge';
  };

  return (
    <div className="users-page">
      <div className="users-header">
        <h1>User Management</h1>
        <p>Manage user access and permissions</p>
      </div>

      <div className="users-controls">
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by UID or Device ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-buttons">
          {['ALL', 'PENDING', 'APPROVED', 'BLOCKED'].map((status) => (
            <button
              key={status}
              className={`filter-btn ${statusFilter === status ? 'active' : ''}`}
              onClick={() => setStatusFilter(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      ) : users.length === 0 ? (
        <div className="empty-state">
          <p>No users found</p>
        </div>
      ) : (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>UID</th>
                <th>Device ID</th>
                <th>Status</th>
                <th>Requested At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.uid}</td>
                  <td className="device-id">{user.deviceId}</td>
                  <td>
                    <span className={getStatusClass(user.status)}>
                      {user.status}
                    </span>
                  </td>
                  <td>{new Date(user.requestedAt).toLocaleString()}</td>
                  <td>
                    <div className="action-buttons">
                      {user.status === 'PENDING' && (
                        <>
                          <button
                            className="action-btn approve"
                            onClick={() => handleApprove(user._id)}
                            disabled={actionLoading === user._id}
                            title="Approve"
                          >
                            <FiCheck />
                          </button>
                          <button
                            className="action-btn block"
                            onClick={() => handleBlock(user._id)}
                            disabled={actionLoading === user._id}
                            title="Block"
                          >
                            <FiX />
                          </button>
                        </>
                      )}
                      {user.status === 'APPROVED' && (
                        <button
                          className="action-btn block"
                          onClick={() => handleBlock(user._id)}
                          disabled={actionLoading === user._id}
                          title="Block"
                        >
                          <FiX />
                        </button>
                      )}
                      {user.status === 'BLOCKED' && (
                        <button
                          className="action-btn unblock"
                          onClick={() => handleUnblock(user._id)}
                          disabled={actionLoading === user._id}
                          title="Unblock"
                        >
                          <FiUnlock />
                        </button>
                      )}
                      <button
                        className="action-btn delete"
                        onClick={() => handleDelete(user._id)}
                        disabled={actionLoading === user._id}
                        title="Delete"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Users;