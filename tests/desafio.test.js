import { findTrilha } from '../src/utils/data.js';

describe('desafio command — data layer', () => {
  const levels = ['iniciante', 'intermediario', 'avancado'];
  const tracks = ['javascript', 'python', 'react', 'nodejs', 'typescript'];

  it.each(tracks)('%s has a challenge for every level', (trackId) => {
    const t = findTrilha(trackId);
    levels.forEach((level) => {
      expect(typeof t.challenges[level]).toBe('string');
      expect(t.challenges[level].length).toBeGreaterThan(10);
    });
  });
});
