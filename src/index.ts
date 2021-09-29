#!/usr/bin/env node

import { parseCmdArgs, Commands } from './cmd';
import { log } from './logging';
import showHelp from './show_help';
import compareDirectories from './compare_directories';

const allowedCommands = Object.values(Commands);
const formattedAllowedCommands = allowedCommands
  .map((c) => `"${c}"`)
  .join(', ');

async function main(): Promise<void> {
  const { command, args } = parseCmdArgs();

  if (!command) {
    throw new Error(`Command not set. Allowed commands: ${formattedAllowedCommands}.`);
  }

  if (!allowedCommands.includes(command)) {
    throw new Error(`Command "${command}" not found. Allowed commands: ${formattedAllowedCommands}.`);
  }

  if (command === Commands.SHOW_HELP) {
    showHelp();
  }

  if (command === Commands.COMPARE_DIRECTORIES) {
    await compareDirectories(args);
  }
}

main()
  .catch((err) => {
    log();
    log(`Error: ${err.message}`);
    log('Use "help" command to view help message.');
  });
