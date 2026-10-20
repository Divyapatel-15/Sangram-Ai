/**
 * Mock User Profile & Preferences Service
 */

import { mockUser } from '../../data/mockUser';

const USER_PREFS_KEY = 'sangram_ai_user_preferences';

export const mockUserService = {
  getUserProfile: async () => {
    return mockUser;
  },

  updateUserProfile: async (updates) => {
    await new Promise(r => setTimeout(r, 400));
    const user = { ...mockUser, ...updates };
    return user;
  },

  getPreferences: async () => {
    try {
      const stored = localStorage.getItem(USER_PREFS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return mockUser.preferences;
  },

  updatePreferences: async (newPrefs) => {
    await new Promise(r => setTimeout(r, 300));
    const current = await mockUserService.getPreferences();
    const updated = { ...current, ...newPrefs };
    localStorage.setItem(USER_PREFS_KEY, JSON.stringify(updated));
    return updated;
  }
};
