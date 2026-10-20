/**
 * Mock User Profile and Usage Statistics
 */

export const mockUser = {
  id: 'usr_78910',
  name: 'Alex Vance',
  email: 'alex.vance@sangram.ai',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  role: 'AI Research Lead',
  plan: 'pro',
  planName: 'Pro Dialectic',
  joinedDate: 'May 2026',
  stats: {
    totalBattles: 142,
    savedAnswers: 38,
    clashesResolved: 419,
    tokensSynthesized: '1.8M',
    monthlyCreditsUsed: 420,
    monthlyCreditsTotal: 1000
  },
  preferences: {
    theme: 'dark',
    motion: 'full',
    defaultModels: ['chatgpt', 'claude'],
    emailNotifications: true,
    showTopologyGraph: true,
    autoSaveDebates: true
  }
};
