import { api, setStoredToken, clearStoredToken } from '../services/api';

/**
 * Test API connection
 */
export const testConnection = async () => {
  try {
    const response = await api.get('/test');
    console.log('✅ Backend connected!', response);
    return response;
  } catch (error) {
    console.error('❌ Connection failed:', error);
    throw error;
  }
};

/**
 * Get authenticated user
 */
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/user');
    return response.user || response;
  } catch (error) {
    console.error('Failed to get user:', error);
    throw error;
  }
};

/**
 * Register a new user (stores token from response)
 */
export const register = async (userData) => {
  try {
    // Token-based auth: no CSRF cookie needed
    const response = await api.post('/register', {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      password_confirmation: userData.passwordConfirmation || userData.password,
    });
    if (response.token) {
      setStoredToken(response.token);
    }
    return response;
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
};

/**
 * Login user (stores token from response)
 */
export const login = async (email, password, remember = false) => {
  try {
    // Trim to avoid whitespace causing "incorrect credentials"
    const response = await api.post('/login', {
      email: typeof email === 'string' ? email.trim() : email,
      password: password || '',
      remember,
    });
    if (response.token) {
      setStoredToken(response.token);
    }
    return response;
  } catch (error) {
    const data = error?.response?.data;
    console.error('Login failed:', data ?? error);
    throw error;
  }
};

/**
 * Logout user (revokes token and clears stored token)
 */
export const logout = async () => {
  try {
    await api.post('/logout');
  } catch (error) {
    console.error('Logout failed:', error);
  } finally {
    clearStoredToken();
  }
};
