#!/usr/bin/env node

import { parseCmdArgs, Commands } from './cmd';
import { log } from './logging';
import showHelpMessage from './show_help_message';
import showVersion from './show_version';
import compareDirectories from './compare_directories';

const allowedCommands = Object.values(Commands);
const formattedAllowedCommands = allowedCommands
  .map((c) => `"${c}"`)
  .join(', ');

async function main(): Promise<void> {
  const { command, args } = parseCmdArgs();

  if (!command) {
    throw new Error(`Command is not set. Allowed commands: ${formattedAllowedCommands}.`);
  }

  if (!allowedCommands.includes(command)) {
    throw new Error(`"${command}" is not a command. Allowed commands: ${formattedAllowedCommands}.`);
  }

  if (command === Commands.SHOW_HELP_MESSAGE) {
    showHelpMessage();
  }

  if (command === Commands.SHOW_VERSION) {
    showVersion();
  }

  if (command === Commands.COMPARE_DIRECTORIES) {
    await compareDirectories(args);
  }
}

main()
  .catch((err) => {
    log();
    log(`Error: ${err.message}`);
    log('See "dir-diff help".');
  });
