import * as commandLineArgs from 'command-line-args';
import { Commands } from './constants';
import { CommandArgDefinition, CompareDirectoriesArgsDefinition } from './args_definitions';
import { CmdArgs } from './types';

export default function parseCmdArgs(): { command: Commands, args: CmdArgs } {
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
}
