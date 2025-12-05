import api from './api';

export const authService = {
  // Signup
  signup: async (username, email, password) => {
    const response = await api.post('/auth/signup', {
      username,
      email,
      password,
      user_role: 'student',
    });
    return response.data;
  },

  // Login
  login: async (email, password) => {
    const response = await api.post('/auth/login', {
      email,
      password,
    });

    if (response.data.success) {
      const { accessToken, refreshToken, user } = response.data.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      // Dispatch custom event to notify components about auth change
      window.dispatchEvent(new Event('authChange'));
    }

    return response.data;
  },

  // Force Login (logout from other device and login here)
  forceLogin: async (email, password) => {
    console.log('🔄 Sending force login request with:', { email, forceLogin: true });

    const response = await api.post('/auth/login', {
      email,
      password,
      forceLogin: true, // Flag to force logout previous session
    });

    console.log('✅ Force login response:', response.data);

    if (response.data.success) {
      const { accessToken, refreshToken, user } = response.data.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      // Dispatch custom event to notify components about auth change
      window.dispatchEvent(new Event('authChange'));
    }

    return response.data;
  },

  // Logout
  logout: async () => {
    try {
      console.log('🚪 Logging out...');
      // Call logout API to invalidate backend session
      await api.post('/auth/logout');
      console.log('✅ Logout API call successful');

      // Only clear localStorage after successful logout
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      console.log('🧹 Local storage cleared');

      // Dispatch custom event to notify components about auth change
      window.dispatchEvent(new Event('authChange'));
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Even if API call fails, clear local storage to prevent frontend being stuck
      // This ensures user can always clear their local state
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      console.log('🧹 Local storage cleared (after error)');

      // Dispatch custom event to notify components about auth change
      window.dispatchEvent(new Event('authChange'));

      throw error; // Re-throw to let caller know logout had issues
    }
  },

  // Resend verification email
  resendVerification: async (email) => {
    const response = await api.post('/auth/resend-verification', { email });
    return response.data;
  },

  // Get active sessions
  getActiveSessions: async () => {
    const response = await api.get('/auth/sessions');
    return response.data;
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('accessToken');
  },
};
