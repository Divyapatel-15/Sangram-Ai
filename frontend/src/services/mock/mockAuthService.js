/**
 * Mock Authentication Service
 * 
 * Provides standard frontend authentication contract:
 * login, signup, logout, getCurrentUser, forgotPassword, resetPassword, verifyEmail.
 * Backed by localStorage and mock user data for seamless UI demonstration.
 */

import { mockUser } from '../../data/mockUser';

const AUTH_STORAGE_KEY = 'sangram_ai_auth_user';

export const mockAuthService = {
  getCurrentUser: () => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      // ignore
    }
    return mockUser; // default active session for demo
  },

  login: async ({ email, password }) => {
    await new Promise(r => setTimeout(r, 600)); // simulated latency
    if (!email || !password) {
      throw new Error('Please provide both email and password.');
    }
    const user = { ...mockUser, email };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    return user;
  },

  signup: async ({ name, email, password }) => {
    await new Promise(r => setTimeout(r, 700));
    if (!email || !password || !name) {
      throw new Error('Please fill all required registration fields.');
    }
    const user = { ...mockUser, name, email };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    return user;
  },

  logout: async () => {
    await new Promise(r => setTimeout(r, 300));
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return true;
  },

  forgotPassword: async (email) => {
    await new Promise(r => setTimeout(r, 500));
    if (!email) throw new Error('Please enter a valid email address.');
    return { success: true, message: `Reset link sent to ${email} (simulated)` };
  },

  resetPassword: async ({ token, newPassword }) => {
    await new Promise(r => setTimeout(r, 600));
    if (!newPassword || newPassword.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }
    return { success: true, message: 'Password has been successfully reset.' };
  },

  verifyEmail: async (code) => {
    await new Promise(r => setTimeout(r, 500));
    if (code && code.length >= 4) {
      return { success: true, verified: true };
    }
    throw new Error('Invalid verification code provided.');
  }
};
