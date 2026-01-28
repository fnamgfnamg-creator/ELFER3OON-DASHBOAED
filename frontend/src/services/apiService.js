import axiosInstance from './axios';

export const apiService = {
  async getStats() {
    const response = await axiosInstance.get('/stats');
    return response.data.stats;
  },

  async getUsers(status = '', search = '') {
    const params = {};
    if (status) params.status = status;
    if (search) params.search = search;

    const response = await axiosInstance.get('/users', { params });
    return response.data.users;
  },

  async approveUser(userId) {
    const response = await axiosInstance.patch(`/users/${userId}/approve`);
    return response.data;
  },

  async blockUser(userId) {
    const response = await axiosInstance.patch(`/users/${userId}/block`);
    return response.data;
  },

  async unblockUser(userId, unblockAll = false) {
    const response = await axiosInstance.patch(`/users/${userId}/unblock`, {
      unblockAll
    });
    return response.data;
  },

  async deleteUser(userId) {
    const response = await axiosInstance.delete(`/users/${userId}`);
    return response.data;
  }
};