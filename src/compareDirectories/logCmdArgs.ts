import { CompareDirectoriesArgsDefinition, CmdArgs } from '../cmd/index.js';
import { log } from '../logging/index.js';

const logCmdArgs = (args: CmdArgs): void => {
  CompareDirectoriesArgsDefinition.forEach(({ name, type, description }) => {
    const value = args[name];

    if (type === String) {
      log(`${description}: "${value}"`);
    }

    if (type === Boolean && value === true) {
      log(`! ${description} (--${name})`);
    }
  });
};

export default logCmdArgs;
