import { CompareDirectoriesArgsDefinition, CmdArgs } from '../cmd/index.js';
import { LoggerInterface } from '../logging/index.js';

const logCmdArgs = ({ cmdArgs, logger }: { cmdArgs: CmdArgs; logger: LoggerInterface }): void => {
  CompareDirectoriesArgsDefinition.forEach(({ name, type, description }) => {
    const value = cmdArgs[name];

    if (type === String) {
      logger.log(`${description}: "${value}"`);
    }

    if (type === Boolean && value === true) {
      logger.log(`! ${description} (--${name})`);
    }
  });
};

export default logCmdArgs;
