import chalk from 'chalk';
import { findTrilha, isValidLevel, VALID_LEVELS } from '../utils/data.js';

/**
 * `desafio` command handler.
 * Prints a code challenge for the given technology and level.
 */
export default function desafioCommand(tecnologia, options) {
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

  const challenge = trilha.challenges[level];

  if (!challenge) {
    console.error(chalk.red(`\n✖  No challenge found for ${trilha.name} / ${level}\n`));
    process.exit(1);
  }

  const badge = { iniciante: '🟢', intermediario: '🟡', avancado: '🔴' }[level];

  console.log('\n' + chalk.bold.magenta(`⚡ Code Challenge`));
  console.log(
    chalk.dim(`${trilha.name}`) +
      ' › ' +
      chalk.bold(`${badge} ${capitalise(level)}`) +
      '\n'
  );
  console.log(chalk.white(challenge));
  console.log(
    '\n' +
      chalk.dim('Tip: write clean, well-tested code and commit it to your GitHub repository.') +
      '\n'
  );
}

function capitalise(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
