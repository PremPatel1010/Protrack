import { jwtDecode } from 'jwt-decode';

export const checkAuthStatus = () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }

    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Current time in seconds

    if (decodedToken.exp < currentTime) {
      localStorage.removeItem('token');
      return false;
    }

    return true;
  } catch (err) {
    console.error('Token decode error:', err.message);
    localStorage.removeItem('token');
    return false;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
};