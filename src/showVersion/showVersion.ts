import { LoggerInterface } from '../logging/index.js';
import getPackageVersion from './getPackageVersion.js';

const showVersion = ({ logger }: { logger: LoggerInterface }): void => {
  logger.log(`v${getPackageVersion()}`);
};

export default showVersion;
