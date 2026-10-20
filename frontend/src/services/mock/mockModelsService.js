/**
 * Mock Models Service Interface
 */

import { models } from '../../data/models';
import { archetypes } from '../../data/archetypes';

export const mockModelsService = {
  getAllModels: async () => {
    return models;
  },

  getModelById: async (id) => {
    return models.find(m => m.id === id) || null;
  },

  getAllArchetypes: async () => {
    return archetypes;
  },

  getArchetypeById: async (id) => {
    return archetypes.find(a => a.id === id) || null;
  }
};
