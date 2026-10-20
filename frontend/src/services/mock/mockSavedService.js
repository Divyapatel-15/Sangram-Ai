/**
 * Mock Saved Answers Service Interface
 */

import { mockSavedAnswersList } from '../../data/mockBattles';

const SAVED_STORAGE_KEY = 'sangram_ai_saved_answers';

export const mockSavedService = {
  getSavedAnswers: async () => {
    try {
      const stored = localStorage.getItem(SAVED_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return mockSavedAnswersList;
  },

  saveAnswer: async (answer) => {
    const current = await mockSavedService.getSavedAnswers();
    const newItem = {
      id: `saved-${Date.now()}`,
      dateSaved: new Date().toISOString(),
      ...answer
    };
    const updated = [newItem, ...current];
    localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(updated));
    return newItem;
  },

  removeAnswer: async (id) => {
    const current = await mockSavedService.getSavedAnswers();
    const updated = current.filter(item => item.id !== id);
    localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(updated));
    return true;
  }
};
