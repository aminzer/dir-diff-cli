import * as commandLineArgs from 'command-line-args';
import { Commands } from './constants';
import { CommandDefinition, CompareDirectoriesDefinition } from './args_definitions';

export default function parseCmdArgs() {
  let args = {};

  const { command, _unknown: restArgs = [] } = commandLineArgs(CommandDefinition, {
    stopAtFirstUnknown: true,
  });

  if (command === Commands.COMPARE_DIRECTORIES) {
    args = commandLineArgs(CompareDirectoriesDefinition, { argv: restArgs });
  }

  return {
    command,
    args,
  };
}
