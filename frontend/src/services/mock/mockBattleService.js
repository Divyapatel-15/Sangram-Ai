/**
 * Mock Battle Service Interface
 * 
 * Manages dialectic battles, real-time stage progression,
 * and battle retrieval.
 */

import { generateBattle } from '../battleService';
import { loadHistory, saveBattleToHistory, clearHistory } from '../historyStore';
import { mockBattlesList, getBattleById } from '../../data/mockBattles';

export const mockBattleService = {
  getRecentBattles: async () => {
    await new Promise(r => setTimeout(r, 150));
    try {
      const stored = loadHistory();
      if (stored && stored.length > 0) {
        // Map stored format to battle card format
        const formatted = stored.map(s => ({
          id: s.id,
          title: s.question,
          topic: 'Arena Dialectic',
          date: new Date(s.savedAt).toISOString(),
          models: s.fighters?.map(f => f.id) || ['chatgpt', 'claude'],
          status: 'completed',
          roundsCount: 3,
          summary: s.finalAnswer?.slice(0, 160) + '...',
          consensusScore: s.agreement?.score || 92
        }));
        return [...formatted, ...mockBattlesList];
      }
    } catch (e) {
      // fallback
    }
    return mockBattlesList;
  },

  getBattleById: async (id) => {
    await new Promise(r => setTimeout(r, 200));
    try {
      const stored = loadHistory();
      const foundInStored = stored.find(b => b.id === id);
      if (foundInStored) {
        return {
          id: foundInStored.id,
          title: foundInStored.question,
          topic: 'Arena Dialectic',
          date: new Date(foundInStored.savedAt).toISOString(),
          models: foundInStored.fighters?.map(f => f.id) || ['chatgpt', 'claude'],
          status: 'completed',
          roundsCount: 3,
          summary: foundInStored.finalAnswer,
          consensusScore: foundInStored.agreement?.score || 94
        };
      }
    } catch (e) {}
    return getBattleById(id);
  },

  createBattle: async ({ modelA, modelB, archetypeA, archetypeB, prompt, context }) => {
    await new Promise(r => setTimeout(r, 300));
    // Uses the deterministic battle generation engine
    const battle = generateBattle({
      modelA,
      modelB,
      archetypeA,
      archetypeB,
      prompt,
      context
    });
    try {
      saveBattleToHistory(battle);
    } catch (e) {}
    return {
      id: battle.id || `battle-${Date.now()}`,
      title: prompt,
      topic: 'Custom Dialectic',
      date: new Date().toISOString(),
      models: [modelA, modelB],
      status: 'completed',
      roundsCount: battle.roundsCount || 3,
      summary: battle.finalAnswer || 'Debate synthesized successfully in War Room.',
      consensusScore: 94
    };
  },

  deleteBattle: async (id) => {
    await new Promise(r => setTimeout(r, 200));
    return true;
  },

  clearAllBattles: async () => {
    clearHistory();
    return true;
  }
};
