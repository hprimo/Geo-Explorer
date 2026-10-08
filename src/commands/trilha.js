import chalk from 'chalk';
import { findTrilha, isValidLevel, VALID_LEVELS } from '../utils/data.js';

/**
 * `trilha` command handler.
 * Prints the study plan for the requested technology.
 */
export default function trilhaCommand(tecnologia, options) {
  const trilha = findTrilha(tecnologia);

  if (!trilha) {
    console.error(
      chalk.red(`\n✖  Track not found: "${tecnologia}"\n`) +
        chalk.yellow(`Available tracks: javascript, python, react, nodejs, typescript\n`)
    );
    process.exit(1);
  }

  const levelFilter = options.level ? options.level.toLowerCase() : null;

  if (levelFilter && !isValidLevel(levelFilter)) {
    console.error(
      chalk.red(`\n✖  Invalid level: "${levelFilter}"\n`) +
        chalk.yellow(`Valid levels: ${VALID_LEVELS.join(', ')}\n`)
    );
    process.exit(1);
  }

  console.log('\n' + chalk.bold.cyan(`🌍 ${trilha.name} — Learning Track`));
  console.log(chalk.dim(trilha.description) + '\n');

  const levelsToShow = levelFilter
    ? { [levelFilter]: trilha.levels[levelFilter] }
    : trilha.levels;

  for (const [level, data] of Object.entries(levelsToShow)) {
    console.log(chalk.bold.yellow(`📚 ${capitalise(level)}`) + chalk.dim(` (${data.duration})`));
    data.modules.forEach((mod, i) => {
      console.log(`   ${chalk.cyan(i + 1 + '.')} ${mod}`);
    });
    console.log();
  }
}

function capitalise(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
