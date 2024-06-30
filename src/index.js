#!/usr/bin/env node

import { program } from 'commander';
import init from './commands/init.js';
import component from './commands/component.js';
import service from './commands/service.js';
import hooks from './commands/hooks.js';
import info from './commands/info.js';
import { getCLIConfigFile } from './utils/grcConfigUtils.js'

program
  .name("nrx")
  .description("CLI to initialize and structure React apps")
  .action(() => {
    info();
  });

program
  .command('init <appName>')
  .description('Create a new React application with a custom structure')
  .action(appName => {
    init(appName);
    process.exit(0);
  });

program
  .version('1.0.0', '-v, --version', 'Show version and description of nrx CLI')

const generate = program.command('generate')
  .alias('g')
  .description('Generate code')

  component(generate, await getCLIConfigFile() ,process.argv);
  service(generate);
  hooks(generate);
  
  program.parse(process.argv);


