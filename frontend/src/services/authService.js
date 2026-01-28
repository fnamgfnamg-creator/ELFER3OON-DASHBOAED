import axiosInstance from './axios';

export const authService = {
  async login(username, password) {
    try {
      const response = await axiosInstance.post('/auth/login', {
        username,
        password
      });

      if (response.data.success && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('admin', JSON.stringify(response.data.admin));
        return response.data;
      }

      throw new Error('Invalid response from server');
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      throw new Error(message);
    }
  },

  async verifyToken() {
    try {
      const response = await axiosInstance.post('/auth/verify');
      return response.data.valid;
    } catch (error) {
      return false;
    }
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
  },

  getToken() {
    return localStorage.getItem('token');
  },

  isAuthenticated() {
    return !!this.getToken();
  }
};