import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = join(__dirname, '../../data/trilhas.json');

/**
 * Load all tracks from the JSON data file.
 * @returns {Array} Array of track objects.
 */
export function loadTrilhas() {
  const raw = readFileSync(DATA_PATH, 'utf-8');
  return JSON.parse(raw);
}

/**
 * Find a single track by its id (case-insensitive).
 * @param {string} id
 * @returns {object|undefined}
 */
export function findTrilha(id) {
  const trilhas = loadTrilhas();
  return trilhas.find((t) => t.id.toLowerCase() === id.toLowerCase());
}

export const VALID_LEVELS = ['iniciante', 'intermediario', 'avancado'];

/**
 * Validate a level string.
 * @param {string} level
 * @returns {boolean}
 */
export function isValidLevel(level) {
  return VALID_LEVELS.includes(level.toLowerCase());
}
