#!/usr/bin/env node

import { parseCmdArgs, Commands } from './cmd/index.js';
import compareDirectories from './compareDirectories/index.js';
import { LoggerInterface } from './logging/index.js';
import showHelpMessage from './showHelpMessage/index.js';
import showVersion from './showVersion/index.js';

const allowedCommands = Object.values(Commands);
const formattedAllowedCommands = allowedCommands.map((c) => `"${c}"`).join(', ');

const main = async ({ logger }: { logger: LoggerInterface }): Promise<void> => {
  try {
    const { command, args } = parseCmdArgs();

    if (!command) {
      throw new Error(`Command is not set. Allowed commands: ${formattedAllowedCommands}.`);
    }

    if (!allowedCommands.includes(command)) {
      throw new Error(
        `"${command}" is not a command. Allowed commands: ${formattedAllowedCommands}.`,
      );
    }

    if (command === Commands.SHOW_HELP_MESSAGE) {
      showHelpMessage({ logger });
    }

    if (command === Commands.SHOW_VERSION) {
      showVersion({ logger });
    }

    if (command === Commands.COMPARE_DIRECTORIES) {
      await compareDirectories({ cmdArgs: args, logger });
    }
  } catch (err) {
    logger.log('');

    if (err instanceof Error) {
      logger.log(`Error: ${err.message}`);
    } else {
      logger.log(`Unknown error: ${err}`);
    }

    logger.log('Run "dir-diff help" to see the usage instructions.');
  }
};

export default main;
