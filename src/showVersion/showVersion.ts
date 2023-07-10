import { log } from '../logging';
import getPackageVersion from './getPackageVersion';

const showVersion = (): void => {
  log(`v${getPackageVersion()}`);
};

export default showVersion;
