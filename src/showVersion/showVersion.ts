import { log } from '../logging/index.js';
import getPackageVersion from './getPackageVersion.js';

const showVersion = (): void => {
  log(`v${getPackageVersion()}`);
};

export default showVersion;
