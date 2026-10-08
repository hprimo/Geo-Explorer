import chalk from 'chalk';
import { findTrilha, isValidLevel, VALID_LEVELS } from '../utils/data.js';

/**
 * `certificado` command handler.
 * Generates and prints a fictional completion certificate.
 */
export default function certificadoCommand(tecnologia, options) {
  const trilha = findTrilha(tecnologia);

  if (!trilha) {
    console.error(
      chalk.red(`\n✖  Track not found: "${tecnologia}"\n`) +
        chalk.yellow(`Available tracks: javascript, python, react, nodejs, typescript\n`)
    );
    process.exit(1);
  }

  const level = options.level.toLowerCase();

  if (!isValidLevel(level)) {
    console.error(
      chalk.red(`\n✖  Invalid level: "${level}"\n`) +
        chalk.yellow(`Valid levels: ${VALID_LEVELS.join(', ')}\n`)
    );
    process.exit(1);
  }

  const studentName = options.name.trim();
  const issueDate = new Date().toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const certId = generateCertId(studentName, trilha.id, level);
  const badge = { iniciante: '🟢', intermediario: '🟡', avancado: '🔴' }[level];
  const border = chalk.bold.yellow('═'.repeat(58));

  console.log('\n' + border);
  console.log(chalk.bold.yellow('║') + ' '.repeat(56) + chalk.bold.yellow('║'));
  console.log(
    chalk.bold.yellow('║') +
      centred('🏆  GEO-EXPLORER  🏆', 56) +
      chalk.bold.yellow('║')
  );
  console.log(
    chalk.bold.yellow('║') +
      centred('Certificate of Completion', 56) +
      chalk.bold.yellow('║')
  );
  console.log(chalk.bold.yellow('║') + ' '.repeat(56) + chalk.bold.yellow('║'));
  console.log(
    chalk.bold.yellow('║') +
      centred(chalk.white('This certifies that'), 56) +
      chalk.bold.yellow('║')
  );
  console.log(
    chalk.bold.yellow('║') +
      centred(chalk.bold.cyan(studentName), 56) +
      chalk.bold.yellow('║')
  );
  console.log(
    chalk.bold.yellow('║') +
      centred('has successfully completed the', 56) +
      chalk.bold.yellow('║')
  );
  console.log(
    chalk.bold.yellow('║') +
      centred(chalk.bold.magenta(`${badge}  ${trilha.name} — ${capitalise(level)}`), 56) +
      chalk.bold.yellow('║')
  );
  console.log(
    chalk.bold.yellow('║') +
      centred('learning track', 56) +
      chalk.bold.yellow('║')
  );
  console.log(chalk.bold.yellow('║') + ' '.repeat(56) + chalk.bold.yellow('║'));
  console.log(
    chalk.bold.yellow('║') +
      centred(chalk.dim(`Issued on ${issueDate}`), 56) +
      chalk.bold.yellow('║')
  );
  console.log(
    chalk.bold.yellow('║') +
      centred(chalk.dim(`Certificate ID: ${certId}`), 56) +
      chalk.bold.yellow('║')
  );
  console.log(chalk.bold.yellow('║') + ' '.repeat(56) + chalk.bold.yellow('║'));
  console.log(border + '\n');
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function capitalise(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Centre a string inside a fixed-width cell, stripping ANSI codes for length
 * measurement so colour sequences do not break the alignment.
 */
function centred(text, width) {
  const visibleLen = stripAnsi(text).length;
  const padding = Math.max(0, width - visibleLen);
  const left = Math.floor(padding / 2);
  const right = padding - left;
  return ' '.repeat(left) + text + ' '.repeat(right);
}

function stripAnsi(str) {
  // eslint-disable-next-line no-control-regex
  return str.replace(/\x1B\[[0-9;]*m/g, '');
}

/**
 * Generate a deterministic-looking certificate ID.
 */
function generateCertId(name, track, level) {
  const seed = `${name}-${track}-${level}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return `GEO-${hash.toString(16).toUpperCase().padStart(8, '0')}`;
}
