import { loadTrilhas, findTrilha, isValidLevel, VALID_LEVELS } from '../src/utils/data.js';

describe('data utils', () => {
  describe('loadTrilhas', () => {
    it('returns a non-empty array', () => {
      const trilhas = loadTrilhas();
      expect(Array.isArray(trilhas)).toBe(true);
      expect(trilhas.length).toBeGreaterThan(0);
    });

    it('each track has id, name, description, levels and challenges', () => {
      loadTrilhas().forEach((t) => {
        expect(t).toHaveProperty('id');
        expect(t).toHaveProperty('name');
        expect(t).toHaveProperty('description');
        expect(t).toHaveProperty('levels');
        expect(t).toHaveProperty('challenges');
      });
    });
  });

  describe('findTrilha', () => {
    it('finds a known track by lowercase id', () => {
      const t = findTrilha('javascript');
      expect(t).toBeDefined();
      expect(t.id).toBe('javascript');
    });

    it('finds a track case-insensitively', () => {
      const t = findTrilha('JavaScript');
      expect(t).toBeDefined();
    });

    it('returns undefined for an unknown track', () => {
      expect(findTrilha('cobol')).toBeUndefined();
    });
  });

  describe('isValidLevel', () => {
    it('returns true for all valid levels', () => {
      VALID_LEVELS.forEach((l) => expect(isValidLevel(l)).toBe(true));
    });

    it('is case-insensitive', () => {
      expect(isValidLevel('Iniciante')).toBe(true);
      expect(isValidLevel('AVANCADO')).toBe(true);
    });

    it('returns false for an unknown level', () => {
      expect(isValidLevel('expert')).toBe(false);
    });
  });
});
