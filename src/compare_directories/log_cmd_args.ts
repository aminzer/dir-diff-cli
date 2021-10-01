import { CompareDirectoriesArgsDefinition, CmdArgs } from '../cmd';
import { log } from '../logging';

export default function logCmdArgs(args: CmdArgs): void {
  CompareDirectoriesArgsDefinition.forEach(({ name, type, description }) => {
    const value = args[name];

    if (type === String) {
      log(`${description}: "${value}"`);
    }

    if (type === Boolean && value === true) {
      log(`! ${description} (--${name})`);
    }
  });
}
