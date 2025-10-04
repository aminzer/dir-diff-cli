import commandLineArgs from 'command-line-args';
import { CommandArgDefinition, CompareDirectoriesArgsDefinition } from './argsDefinitions.js';
import { Commands } from './constants.js';
import { CmdArgs } from './types.js';

const parseCmdArgs = (): { command: Commands; args: CmdArgs } => {
  let args = {};

  const { command, _unknown: restArgs = [] } = commandLineArgs(CommandArgDefinition, {
    stopAtFirstUnknown: true,
  });

  if (command === Commands.COMPARE_DIRECTORIES) {
    args = commandLineArgs(CompareDirectoriesArgsDefinition, { argv: restArgs });
  }

  return {
    command,
    args,
  };
};

export default parseCmdArgs;
