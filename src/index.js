#!/usr/bin/env node
import { program } from 'commander';
import trilhaCommand from './commands/trilha.js';
import desafioCommand from './commands/desafio.js';
import certificadoCommand from './commands/certificado.js';

program
  .name('geo-explorer')
  .description('🌍 Explore learning tracks, tackle code challenges and earn certificates.')
  .version('1.0.0');

program
  .command('trilha <tecnologia>')
  .description('Show the study plan for a technology')
  .option('-l, --level <level>', 'Filter by level: iniciante | intermediario | avancado')
  .action(trilhaCommand);

program
  .command('desafio <tecnologia>')
  .description('Get a code challenge for a technology')
  .requiredOption('-l, --level <level>', 'Level: iniciante | intermediario | avancado')
  .action(desafioCommand);

program
  .command('certificado <tecnologia>')
  .description('Generate a fictional certificate for a completed track')
  .requiredOption('-n, --name <name>', 'Your full name')
  .option('-l, --level <level>', 'Level completed (default: avancado)', 'avancado')
  .action(certificadoCommand);

program.parse();
