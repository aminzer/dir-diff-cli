import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const getPackageVersion = (): string => {
  const packageJsonFilePath = resolve(import.meta.dirname, '../../package.json');
  const packageJsonFileContent = readFileSync(packageJsonFilePath, 'utf-8');

  const { version } = JSON.parse(packageJsonFileContent);

  return version;
};

export default getPackageVersion;
