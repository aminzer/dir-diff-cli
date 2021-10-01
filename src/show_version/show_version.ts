import { log } from '../logging';
import getPackageVersion from './get_package_version';

export default function showVersion(): void {
  log(`v${getPackageVersion()}`);
}
