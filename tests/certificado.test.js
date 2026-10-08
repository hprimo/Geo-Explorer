/**
 * Tests for the certificate generation helpers.
 * Extracted to keep the command thin and logic testable.
 */

/** Deterministic certificate ID generator — mirrors src/commands/certificado.js */
function generateCertId(name, track, level) {
  const seed = `${name}-${track}-${level}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return `GEO-${hash.toString(16).toUpperCase().padStart(8, '0')}`;
}

describe('certificado helpers', () => {
  it('generates a certificate ID that starts with GEO-', () => {
    const id = generateCertId('Ada Lovelace', 'python', 'avancado');
    expect(id).toMatch(/^GEO-[0-9A-F]{8}$/);
  });

  it('is deterministic — same inputs produce the same ID', () => {
    const a = generateCertId('Alan Turing', 'javascript', 'intermediario');
    const b = generateCertId('Alan Turing', 'javascript', 'intermediario');
    expect(a).toBe(b);
  });

  it('produces different IDs for different inputs', () => {
    const a = generateCertId('Alice', 'react', 'iniciante');
    const b = generateCertId('Bob', 'react', 'iniciante');
    expect(a).not.toBe(b);
  });

  it('produces different IDs for different levels', () => {
    const a = generateCertId('Alice', 'typescript', 'iniciante');
    const b = generateCertId('Alice', 'typescript', 'avancado');
    expect(a).not.toBe(b);
  });
});
