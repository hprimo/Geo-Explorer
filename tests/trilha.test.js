/**
 * Tests for the trilha command logic.
 * We test the pure data layer since the command itself writes to stdout.
 */
import { findTrilha } from '../src/utils/data.js';

describe('trilha command — data layer', () => {
  it('javascript track has all three levels', () => {
    const t = findTrilha('javascript');
    expect(t.levels).toHaveProperty('iniciante');
    expect(t.levels).toHaveProperty('intermediario');
    expect(t.levels).toHaveProperty('avancado');
  });

  it('every level has a duration and a non-empty modules array', () => {
    const t = findTrilha('python');
    for (const data of Object.values(t.levels)) {
      expect(typeof data.duration).toBe('string');
      expect(Array.isArray(data.modules)).toBe(true);
      expect(data.modules.length).toBeGreaterThan(0);
    }
  });

  it('react track description is a non-empty string', () => {
    const t = findTrilha('react');
    expect(typeof t.description).toBe('string');
    expect(t.description.length).toBeGreaterThan(0);
  });
});
